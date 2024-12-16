-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create customers table first
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

-- Then create customer_addresses with proper foreign key
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
create index customer_addresses_customer_id_idx on customer_addresses(customer_id);
create index customers_store_name_idx on customers(store_name);
create index customers_email_idx on customers(email);

-- Enable RLS
alter table customer_addresses enable row level security;
alter table customers enable row level security;

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