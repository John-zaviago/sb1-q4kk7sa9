-- Drop existing tables and policies
drop policy if exists "Users can view their store's customer addresses" on customer_addresses;
drop policy if exists "Users can insert addresses to their store's customers" on customer_addresses;
drop policy if exists "Users can update their store's customer addresses" on customer_addresses;
drop policy if exists "Users can delete their store's customer addresses" on customer_addresses;

drop policy if exists "Users can view their store's customers" on customers;
drop policy if exists "Users can insert customers to their store" on customers;
drop policy if exists "Users can update their store's customers" on customers;
drop policy if exists "Users can delete their store's customers" on customers;

drop table if exists customer_addresses;
drop table if exists customers;
drop table if exists product_tags;
drop table if exists product_images;
drop table if exists products;

-- Create products table
create table products (
  id uuid primary key default uuid_generate_v4(),
  store_name text references profiles(store_name) on delete cascade,
  name text not null,
  description text,
  category_id text,
  category_name text,
  price decimal(10,2) not null,
  compare_at_price decimal(10,2),
  cost decimal(10,2),
  sku text,
  barcode text,
  track_quantity boolean default false,
  quantity integer,
  weight decimal(10,2) not null,
  weight_unit text not null check (weight_unit in ('kg', 'lb')),
  status text not null check (status in ('draft', 'active', 'archived')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create product images table
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  url text not null,
  alt text,
  position integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create product tags table
create table product_tags (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create customers table
create table customers (
  id uuid primary key default uuid_generate_v4(),
  store_name text references profiles(store_name) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  accepts_marketing boolean default false,
  tags text[],
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(store_name, email)
);

-- Create customer addresses table
create table customer_addresses (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete cascade,
  store_name text references profiles(store_name) on delete cascade,
  type text not null check (type in ('billing', 'shipping')),
  first_name text not null,
  last_name text not null,
  company text,
  address1 text not null,
  address2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null,
  phone text,
  is_default boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create indexes
create index products_store_name_idx on products(store_name);
create index products_status_idx on products(status);
create index product_images_product_id_idx on product_images(product_id);
create index product_tags_product_id_idx on product_tags(product_id);
create index customers_store_name_idx on customers(store_name);
create index customers_email_idx on customers(email);
create index customer_addresses_customer_id_idx on customer_addresses(customer_id);

-- Enable RLS
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_tags enable row level security;
alter table customers enable row level security;
alter table customer_addresses enable row level security;

-- Create RLS policies for products
create policy "Users can view their store's products"
  on products for select
  using (
    exists (
      select 1 from profiles
      where profiles.store_name = products.store_name
      and profiles.id = auth.uid()
    )
  );

create policy "Users can insert products to their store"
  on products for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.store_name = products.store_name
      and profiles.id = auth.uid()
    )
  );

create policy "Users can update their store's products"
  on products for update
  using (
    exists (
      select 1 from profiles
      where profiles.store_name = products.store_name
      and profiles.id = auth.uid()
    )
  );

create policy "Users can delete their store's products"
  on products for delete
  using (
    exists (
      select 1 from profiles
      where profiles.store_name = products.store_name
      and profiles.id = auth.uid()
    )
  );

-- Create RLS policies for product images
create policy "Users can manage their store's product images"
  on product_images for all
  using (
    exists (
      select 1 from products
      where products.id = product_images.product_id
      and exists (
        select 1 from profiles
        where profiles.store_name = products.store_name
        and profiles.id = auth.uid()
      )
    )
  );

-- Create RLS policies for product tags
create policy "Users can manage their store's product tags"
  on product_tags for all
  using (
    exists (
      select 1 from products
      where products.id = product_tags.product_id
      and exists (
        select 1 from profiles
        where profiles.store_name = products.store_name
        and profiles.id = auth.uid()
      )
    )
  );

-- Create RLS policies for customers
create policy "Users can view their store's customers"
  on customers for select
  using (
    exists (
      select 1 from profiles
      where profiles.store_name = customers.store_name
      and profiles.id = auth.uid()
    )
  );

create policy "Users can insert customers to their store"
  on customers for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.store_name = customers.store_name
      and profiles.id = auth.uid()
    )
  );

create policy "Users can update their store's customers"
  on customers for update
  using (
    exists (
      select 1 from profiles
      where profiles.store_name = customers.store_name
      and profiles.id = auth.uid()
    )
  );

create policy "Users can delete their store's customers"
  on customers for delete
  using (
    exists (
      select 1 from profiles
      where profiles.store_name = customers.store_name
      and profiles.id = auth.uid()
    )
  );

-- Create RLS policies for customer addresses
create policy "Users can view their store's customer addresses"
  on customer_addresses for select
  using (
    exists (
      select 1 from customers
      where customers.id = customer_addresses.customer_id
      and customers.store_name = customer_addresses.store_name
      and exists (
        select 1 from profiles
        where profiles.store_name = customers.store_name
        and profiles.id = auth.uid()
      )
    )
  );

create policy "Users can insert addresses to their store's customers"
  on customer_addresses for insert
  with check (
    exists (
      select 1 from customers
      where customers.id = customer_addresses.customer_id
      and customers.store_name = customer_addresses.store_name
      and exists (
        select 1 from profiles
        where profiles.store_name = customers.store_name
        and profiles.id = auth.uid()
      )
    )
  );

create policy "Users can update their store's customer addresses"
  on customer_addresses for update
  using (
    exists (
      select 1 from customers
      where customers.id = customer_addresses.customer_id
      and customers.store_name = customer_addresses.store_name
      and exists (
        select 1 from profiles
        where profiles.store_name = customers.store_name
        and profiles.id = auth.uid()
      )
    )
  );

create policy "Users can delete their store's customer addresses"
  on customer_addresses for delete
  using (
    exists (
      select 1 from customers
      where customers.id = customer_addresses.customer_id
      and customers.store_name = customer_addresses.store_name
      and exists (
        select 1 from profiles
        where profiles.store_name = customers.store_name
        and profiles.id = auth.uid()
      )
    )
  );