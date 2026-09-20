-- Run this in Supabase: SQL Editor -> New query -> Run.
-- Builds on the login task: same user-scoped table, plus REALTIME turned on.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  channel text default 'WhatsApp',
  status text default 'open',
  created_at timestamptz default now()
);

alter table public.leads add column if not exists user_id uuid default auth.uid();

-- Row Level Security (same per-user rules as the login task).
alter table public.leads enable row level security;

drop policy if exists "select own leads" on public.leads;
drop policy if exists "insert own leads" on public.leads;
drop policy if exists "update own leads" on public.leads;
drop policy if exists "delete own leads" on public.leads;

create policy "select own leads" on public.leads for select using (auth.uid() = user_id);
create policy "insert own leads" on public.leads for insert with check (auth.uid() = user_id);
create policy "update own leads" on public.leads for update using (auth.uid() = user_id);
create policy "delete own leads" on public.leads for delete using (auth.uid() = user_id);

-- THE NEW PART: let this table broadcast realtime changes.
-- If you see "table is already member of publication", that's fine — ignore it.
alter publication supabase_realtime add table public.leads;
