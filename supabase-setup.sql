-- Run this in the Supabase SQL Editor to create the sandbox tables

-- Subscribers table
create table if not exists subscribers (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null unique,
  company text,
  role text,
  subscribed_at timestamptz default now()
);

-- Sandboxes configuration table
create table if not exists sandboxes (
  slug text primary key,
  name text not null,
  description text not null,
  status text not null default 'active',
  auto_approve boolean default true,
  created_at timestamptz default now()
);

-- Sandbox access table
create table if not exists sandbox_access (
  id uuid default gen_random_uuid() primary key,
  subscriber_id uuid not null references subscribers(id) on delete cascade,
  sandbox_slug text not null references sandboxes(slug) on delete cascade,
  requested_at timestamptz default now(),
  status text not null default 'approved',
  approved_at timestamptz,
  unique(subscriber_id, sandbox_slug)
);

-- Enable Row Level Security
alter table subscribers enable row level security;
alter table sandboxes enable row level security;
alter table sandbox_access enable row level security;

-- Policies: allow anon key to read sandboxes, insert subscribers, manage access
create policy "Anyone can read sandboxes" on sandboxes for select using (true);
create policy "Anyone can insert subscribers" on subscribers for insert with check (true);
create policy "Anyone can read subscribers" on subscribers for select using (true);
create policy "Anyone can insert access" on sandbox_access for insert with check (true);
create policy "Anyone can read access" on sandbox_access for select using (true);

-- Seed the Compass sandbox
insert into sandboxes (slug, name, description, status, auto_approve)
values ('compass', 'Compass — PM Agent Pipeline', 'A multi-agent AI pipeline for product managers, from discovery to delivery.', 'active', true)
on conflict (slug) do nothing;
