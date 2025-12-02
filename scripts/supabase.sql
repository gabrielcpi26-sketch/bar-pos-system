-- Roles
create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

insert into roles (id, name)
values
  (gen_random_uuid(), 'Administrador'),
  (gen_random_uuid(), 'Gerente'),
  (gen_random_uuid(), 'Mesero'),
  (gen_random_uuid(), 'Cocina'),
  (gen_random_uuid(), 'Barra')
on conflict do nothing;

-- Users
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role_id uuid references roles(id),
  created_at timestamptz default now()
);

-- Tables (mesas)
create table if not exists tables (
  id uuid primary key default gen_random_uuid(),
  number int not null,
  status text default 'libre',
  assigned_to uuid references users(id),
  map_position jsonb,
  created_at timestamptz default now()
);

-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  category_id uuid references categories(id),
  is_happy_hour boolean default false,
  status text default 'activo',
  created_at timestamptz default now()
);

-- Ingredients
create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text default 'ml',
  created_at timestamptz default now()
);

-- Inventory
create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid references ingredients(id),
  quantity numeric default 0,
  low_stock_threshold numeric default 0,
  updated_at timestamptz default now()
);

-- Recipes
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  ingredient_id uuid references ingredients(id),
  quantity numeric not null
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  table_id uuid references tables(id),
  status text default 'open',
  total numeric(10,2) default 0,
  payment_method text,
  created_at timestamptz default now(),
  closed_at timestamptz
);

-- Order Items
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity int default 1,
  price numeric(10,2)
);

-- Payments
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id),
  amount numeric(10,2) not null,
  method text not null,
  tip numeric(10,2) default 0,
  created_at timestamptz default now()
);

-- Sessions (POS)
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  opened_at timestamptz default now(),
  closed_at timestamptz,
  cash_opening numeric(10,2) default 0,
  cash_closing numeric(10,2)
);

-- Stock movements
create table if not exists stock_movements (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid references ingredients(id),
  change numeric not null,
  reason text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Tickets
create table if not exists kitchen_tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists bar_tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  status text default 'pending',
  created_at timestamptz default now()
);

-- RLS policies
alter table users enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table tables enable row level security;
alter table products enable row level security;
alter table inventory enable row level security;
alter table kitchen_tickets enable row level security;
alter table bar_tickets enable row level security;

-- Basic policies allowing owners and service roles
create policy "service-role full access" on users for all using (auth.role() = 'service_role');
create policy "service-role full access" on orders for all using (auth.role() = 'service_role');
create policy "service-role full access" on order_items for all using (auth.role() = 'service_role');
create policy "service-role full access" on tables for all using (auth.role() = 'service_role');
create policy "service-role full access" on products for all using (auth.role() = 'service_role');
create policy "service-role full access" on inventory for all using (auth.role() = 'service_role');
create policy "service-role full access" on kitchen_tickets for all using (auth.role() = 'service_role');
create policy "service-role full access" on bar_tickets for all using (auth.role() = 'service_role');

create policy "public read menu" on products for select using (true);
create policy "public read tables" on tables for select using (true);

-- Helper function for top products
create or replace function top_products()
returns table(product_id uuid, name text, total_qty numeric)
as $$
  select oi.product_id, p.name, sum(oi.quantity) as total_qty
  from order_items oi
  join products p on p.id = oi.product_id
  group by 1,2
  order by total_qty desc
  limit 10;
$$ language sql;
