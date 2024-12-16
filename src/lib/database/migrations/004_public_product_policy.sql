-- Add public policy for viewing active products
create policy "Public users can view active products"
  on products for select
  using (
    status = 'active' and
    exists (
      select 1 from profiles
      where profiles.store_name = products.store_name
    )
  );

-- Add public policy for viewing product images
create policy "Public users can view product images"
  on product_images for select
  using (
    exists (
      select 1 from products
      where products.id = product_images.product_id
      and products.status = 'active'
    )
  );

-- Add public policy for viewing product tags
create policy "Public users can view product tags"
  on product_tags for select
  using (
    exists (
      select 1 from products
      where products.id = product_tags.product_id
      and products.status = 'active'
    )
  );