-- LightBudget cloud backend for Supabase.
-- Enable Anonymous Sign-Ins in Supabase Auth before using the app.

create table if not exists public.transactions (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id text not null,
  type text not null check (type in ('expense', 'income')),
  amount numeric(14, 2) not null check (amount > 0 and amount <= 99999999),
  category text not null check (char_length(category) between 1 and 30),
  category_icon text not null default 'receipt_long',
  account text not null check (char_length(account) between 1 and 30),
  occurred_at timestamptz not null,
  remark text not null default '' check (char_length(remark) <= 50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists transactions_user_occurred_at_idx
  on public.transactions (user_id, occurred_at desc);

create table if not exists public.user_settings (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  monthly_budget numeric(14, 2) not null default 4500 check (monthly_budget > 0),
  default_account text not null default '现金',
  theme text not null default 'light' check (theme in ('auto', 'light', 'dark')),
  currency_symbol text not null default '¥',
  currency_code text not null default 'CNY',
  updated_at timestamptz not null default now()
);

alter table public.transactions enable row level security;
alter table public.user_settings enable row level security;

drop policy if exists "users_manage_own_transactions" on public.transactions;
create policy "users_manage_own_transactions"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "users_manage_own_settings" on public.user_settings;
create policy "users_manage_own_settings"
  on public.user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.transactions to anon, authenticated;
grant select, insert, update, delete on public.user_settings to anon, authenticated;
