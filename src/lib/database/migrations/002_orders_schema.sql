-- Create orders table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  store_name text references profiles(store_name) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  status text not null check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal decimal(10,2) not null,
  discount decimal(10,2) default 0,
  shipping decimal(10,2) default 0,
  tax decimal(10,2) default 0,
  total decimal(10,2) not null,
  notes text,
  tags text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create order items table
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity integer not null,
  price decimal(10,2) not null,
  total decimal(10,2) not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes
create index orders_store_name_idx on orders(store_name);
create index orders_customer_id_idx on orders(customer_id);
create index orders_status_idx on orders(status);
create index order_items_order_id_idx on order_items(order_id);
create index order_items_product_id_idx on order_items(product_id);

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- Create RLS policies for orders
create policy "Users can view their store's orders"
  on orders for select
  using (
    exists (
      select 1 from profiles
      where profiles.store_name = orders.store_name
      and profiles.id = auth.uid()
    )
  );

create policy "Users can insert orders to their store"
  on orders for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.store_name = orders.store_name
      and profiles.id = auth.uid()
    )
  );

create policy "Users can update their store's orders"
  on orders for update
  using (
    exists (
      select 1 from profiles
      where profiles.store_name = orders.store_name
      and profiles.id = auth.uid()
    )
  );

create policy "Users can delete their store's orders"
  on orders for delete
  using (
    exists (
      select 1 from profiles
      where profiles.store_name = orders.store_name
      and profiles.id = auth.uid()
    )
  );

-- Create RLS policies for order items
create policy "Users can manage their store's order items"
  on order_items for all
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and exists (
        select 1 from profiles
        where profiles.store_name = orders.store_name
        and profiles.id = auth.uid()
      )
    )
  );