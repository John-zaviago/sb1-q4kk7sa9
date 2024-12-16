create or replace function update_product_stock(
  p_product_id uuid,
  p_quantity integer
) returns void
language plpgsql
security definer
as $$
begin
  update products
  set 
    quantity = quantity - p_quantity,
    updated_at = now()
  where 
    id = p_product_id
    and track_quantity = true
    and quantity >= p_quantity;
    
  if not found then
    raise exception 'Failed to update product stock';
  end if;
end;
$$;