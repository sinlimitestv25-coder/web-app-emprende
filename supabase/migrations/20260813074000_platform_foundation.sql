create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create sequence if not exists public.tenant_public_id_seq start 1;

create table public.plans (
  id bigint generated always as identity primary key,
  code text not null unique,
  name text not null,
  monthly_price numeric(12,2),
  trial_days integer not null default 0 check (trial_days >= 0),
  max_users integer not null default 1 check (max_users > 0),
  storage_limit_mb bigint not null default 2048 check (storage_limit_mb > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id bigint generated always as identity primary key,
  code text not null unique,
  name text not null,
  description text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.plan_modules (
  plan_id bigint not null references public.plans(id) on delete cascade,
  module_id bigint not null references public.modules(id) on delete cascade,
  primary key (plan_id, module_id)
);

create table public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text not null,
  status text not null default 'invited' check (status in ('invited','active','suspended')),
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tenants (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique default ('NX-' || lpad(nextval('public.tenant_public_id_seq')::text, 6, '0')),
  name text not null,
  slug text not null unique,
  owner_name text not null,
  contact_email text not null,
  contact_phone text,
  plan_id bigint not null references public.plans(id),
  status text not null default 'configuring' check (status in ('configuring','active','suspended','archived')),
  max_users integer not null default 1 check (max_users > 0),
  storage_used_bytes bigint not null default 0 check (storage_used_bytes >= 0),
  accent_color text not null default '#e7674e' check (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  logo_path text,
  portal_status text not null default 'draft' check (portal_status in ('draft','published','hidden')),
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table public.memberships (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','admin','staff')),
  status text not null default 'invited' check (status in ('invited','active','suspended')),
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, user_id)
);

create table public.tenant_modules (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  module_id bigint not null references public.modules(id) on delete cascade,
  enabled boolean not null default true,
  configured_by uuid references auth.users(id) on delete set null,
  configured_at timestamptz not null default now(),
  primary key (tenant_id, module_id)
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  tenant_id uuid references public.tenants(id) on delete set null,
  action text not null,
  target_type text not null,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index memberships_user_id_idx on public.memberships(user_id);
create index memberships_tenant_status_idx on public.memberships(tenant_id, status);
create index tenants_status_created_at_idx on public.tenants(status, created_at desc);
create index tenants_plan_id_idx on public.tenants(plan_id);
create index tenant_modules_module_id_idx on public.tenant_modules(module_id);
create index audit_events_actor_id_idx on public.audit_events(actor_id);
create index audit_events_tenant_created_at_idx on public.audit_events(tenant_id, created_at desc);
create index audit_events_created_at_idx on public.audit_events(created_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger plans_set_updated_at before update on public.plans for each row execute function private.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger tenants_set_updated_at before update on public.tenants for each row execute function private.set_updated_at();
create trigger memberships_set_updated_at before update on public.memberships for each row execute function private.set_updated_at();

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(new.email, 'Usuario'), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_auth_user();

revoke execute on function private.set_updated_at() from public, anon, authenticated;
revoke execute on function private.handle_new_auth_user() from public, anon, authenticated;

alter table public.plans enable row level security;
alter table public.modules enable row level security;
alter table public.plan_modules enable row level security;
alter table public.platform_admins enable row level security;
alter table public.profiles enable row level security;
alter table public.tenants enable row level security;
alter table public.memberships enable row level security;
alter table public.tenant_modules enable row level security;
alter table public.audit_events enable row level security;

create policy platform_admins_read_self on public.platform_admins
for select to authenticated
using (user_id = (select auth.uid()) and active = true);

create policy profiles_read_authorized on public.profiles
for select to authenticated
using (
  id = (select auth.uid())
  or exists (select 1 from public.platform_admins pa where pa.user_id = (select auth.uid()) and pa.active)
);

create policy plans_read_authenticated on public.plans
for select to authenticated using (true);

create policy modules_read_authenticated on public.modules
for select to authenticated using (true);

create policy plan_modules_read_authenticated on public.plan_modules
for select to authenticated using (true);

create policy tenants_read_authorized on public.tenants
for select to authenticated
using (
  exists (select 1 from public.platform_admins pa where pa.user_id = (select auth.uid()) and pa.active)
  or exists (select 1 from public.memberships m where m.tenant_id = id and m.user_id = (select auth.uid()) and m.status = 'active')
);

create policy memberships_read_authorized on public.memberships
for select to authenticated
using (
  user_id = (select auth.uid())
  or exists (select 1 from public.platform_admins pa where pa.user_id = (select auth.uid()) and pa.active)
);

create policy tenant_modules_read_authorized on public.tenant_modules
for select to authenticated
using (
  exists (select 1 from public.platform_admins pa where pa.user_id = (select auth.uid()) and pa.active)
  or exists (select 1 from public.memberships m where m.tenant_id = tenant_modules.tenant_id and m.user_id = (select auth.uid()) and m.status = 'active')
);

create policy audit_events_read_platform_admins on public.audit_events
for select to authenticated
using (exists (select 1 from public.platform_admins pa where pa.user_id = (select auth.uid()) and pa.active));

revoke all on public.plans, public.modules, public.plan_modules, public.platform_admins, public.profiles, public.tenants, public.memberships, public.tenant_modules, public.audit_events from anon;
revoke all on public.plans, public.modules, public.plan_modules, public.platform_admins, public.profiles, public.tenants, public.memberships, public.tenant_modules, public.audit_events from authenticated;
grant select on public.plans, public.modules, public.plan_modules, public.platform_admins, public.profiles, public.tenants, public.memberships, public.tenant_modules, public.audit_events to authenticated;

insert into public.plans (code, name, monthly_price, trial_days, max_users, storage_limit_mb)
values
  ('base', 'Base', 18000, 0, 1, 2048),
  ('team', 'Equipo', 28000, 0, 3, 8192),
  ('trial', 'Prueba', null, 14, 1, 500)
on conflict (code) do nothing;

insert into public.modules (code, name, description)
values
  ('inventory', 'Inventario', 'Productos, variantes y movimientos de stock'),
  ('customers', 'Clientes', 'Agenda e historial de relación'),
  ('suppliers', 'Proveedores', 'Contactos y compras'),
  ('orders', 'Pedidos', 'Preparación, estados y entrega'),
  ('finance', 'Finanzas', 'Gastos, costos y rentabilidad'),
  ('portal', 'Portal', 'Catálogo público y carrito'),
  ('bundles', 'Combos', 'Paquetes y promociones'),
  ('reports', 'Reportes', 'Indicadores y exportaciones')
on conflict (code) do nothing;

insert into public.plan_modules (plan_id, module_id)
select p.id, m.id
from public.plans p
cross join public.modules m
where p.code = 'team'
   or (p.code in ('base','trial') and m.code in ('inventory','customers','orders','finance','portal'))
on conflict do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog-public', 'catalog-public', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

create policy catalog_assets_insert_authorized on storage.objects
for insert to authenticated
with check (
  bucket_id = 'catalog-public'
  and (
    exists (select 1 from public.platform_admins pa where pa.user_id = (select auth.uid()) and pa.active)
    or exists (
      select 1 from public.memberships m
      where m.tenant_id::text = (storage.foldername(name))[1]
        and m.user_id = (select auth.uid())
        and m.role in ('owner','admin')
        and m.status = 'active'
    )
  )
);

create policy catalog_assets_update_authorized on storage.objects
for update to authenticated
using (
  bucket_id = 'catalog-public'
  and (
    exists (select 1 from public.platform_admins pa where pa.user_id = (select auth.uid()) and pa.active)
    or exists (select 1 from public.memberships m where m.tenant_id::text = (storage.foldername(name))[1] and m.user_id = (select auth.uid()) and m.role in ('owner','admin') and m.status = 'active')
  )
)
with check (
  bucket_id = 'catalog-public'
  and (
    exists (select 1 from public.platform_admins pa where pa.user_id = (select auth.uid()) and pa.active)
    or exists (select 1 from public.memberships m where m.tenant_id::text = (storage.foldername(name))[1] and m.user_id = (select auth.uid()) and m.role in ('owner','admin') and m.status = 'active')
  )
);

create policy catalog_assets_delete_authorized on storage.objects
for delete to authenticated
using (
  bucket_id = 'catalog-public'
  and (
    exists (select 1 from public.platform_admins pa where pa.user_id = (select auth.uid()) and pa.active)
    or exists (select 1 from public.memberships m where m.tenant_id::text = (storage.foldername(name))[1] and m.user_id = (select auth.uid()) and m.role in ('owner','admin') and m.status = 'active')
  )
);

comment on table public.audit_events is 'Platform-level audit only. Never store customer, order, product, sales or financial content here.';

select pg_catalog.set_config('search_path', 'public', false);
