-- Function to create an order and update product quantities
create or replace function create_order(
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
  id uuid,
  created_at timestamptz,
  updated_at timestamptz
) language plpgsql security definer as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_product_quantity integer;
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
  ) returning orders.id into v_order_id;

  -- Process each order item
  for v_item in select * from jsonb_array_elements(p_items)
  loop
    -- Check product quantity
    select products.quantity into v_product_quantity
    from products
    where products.id = (v_item->>'product_id')::uuid
    and products.track_quantity = true
    for update;

    if v_product_quantity is not null then
      if v_product_quantity < (v_item->>'quantity')::integer then
        raise exception 'Insufficient stock for product %', (v_item->>'product_id')::uuid;
      end if;

      -- Update product quantity
      update products
      set quantity = quantity - (v_item->>'quantity')::integer
      where products.id = (v_item->>'product_id')::uuid;
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
      (v_item->>'product_id')::uuid,
      (v_item->>'quantity')::integer,
      (v_item->>'price')::decimal,
      (v_item->>'total')::decimal
    );
  end loop;

  return query
  select
    o.id,
    o.created_at,
    o.updated_at
  from orders o
  where o.id = v_order_id;
end;
$$;