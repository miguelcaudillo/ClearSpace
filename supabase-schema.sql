-- =====================================================================
-- ClearSpace — Supabase schema for dashboard cloud sync.
-- Run this ONCE in your Supabase project: SQL Editor → New query → paste → Run.
-- =====================================================================
-- It stores your whole dashboard (clients, jobs, invoices, calendar) as a
-- single JSON document, one row per logged-in user, protected by row-level
-- security so ONLY you can read or write your own data.

create table if not exists public.dashboard_state (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  state      jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row-Level Security: a user can only see and change their own row.
alter table public.dashboard_state enable row level security;

drop policy if exists "read own state"   on public.dashboard_state;
drop policy if exists "insert own state" on public.dashboard_state;
drop policy if exists "update own state" on public.dashboard_state;

create policy "read own state"   on public.dashboard_state
  for select using (auth.uid() = user_id);
create policy "insert own state" on public.dashboard_state
  for insert with check (auth.uid() = user_id);
create policy "update own state" on public.dashboard_state
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- That's it. Now create your login:
--   Supabase → Authentication → Users → "Add user" → your email + a password.
-- (Optional but recommended: Authentication → Providers → Email → turn OFF
--  "Confirm email" so your single owner account signs in immediately.)
