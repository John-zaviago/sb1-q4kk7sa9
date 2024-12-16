create or replace function place_order(
  p_store_name text,
  p_customer_id uuid,
  p_status text,
  p_subtotal decimal,
  p_discount decimal,
  p_shipping decimal,
  p_tax decimal,
  p_total decimal,
  p_notes text,
  p_tags text[],
  p_items jsonb
) returns table (
  order_id uuid,
  order_created_at timestamptz,
  order_updated_at timestamptz
) language plpgsql security definer as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_product record;
begin
  -- Start transaction
  begin
    -- Create the order
    insert into orders (
      store_name,
      customer_id,
      status,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      notes,
      tags
    ) values (
      p_store_name,
      p_customer_id,
      p_status,
      p_subtotal,
      p_discount,
      p_shipping,
      p_tax,
      p_total,
      p_notes,
      p_tags
    ) returning id into v_order_id;

    -- Process each order item
    for v_item in select * from jsonb_array_elements(p_items)
    loop
      -- Lock and validate product
      select *
      into strict v_product
      from products
      where id = (v_item->>'product_id')::uuid
        and store_name = p_store_name
        and status = 'active'
      for update;

      -- Check stock if tracking is enabled
      if v_product.track_quantity then
        if v_product.quantity < (v_item->>'quantity')::integer then
          raise exception 'Insufficient stock for product %: % available, % requested',
            v_product.name, v_product.quantity, (v_item->>'quantity')::integer;
        end if;

        -- Update product stock
        update products
        set 
          quantity = quantity - (v_item->>'quantity')::integer,
          updated_at = now()
        where id = v_product.id;
      end if;

      -- Create order item
      insert into order_items (
        order_id,
        product_id,
        quantity,
        price,
        total
      ) values (
        v_order_id,
        v_product.id,
        (v_item->>'quantity')::integer,
        (v_item->>'price')::decimal,
        (v_item->>'total')::decimal
      );
    end loop;

    -- Return the created order details
    return query
    select
      o.id as order_id,
      o.created_at as order_created_at,
      o.updated_at as order_updated_at
    from orders o
    where o.id = v_order_id;

    -- Commit transaction
    commit;
  exception
    when others then
      -- Rollback transaction on any error
      rollback;
      raise;
  end;
end;
$$;