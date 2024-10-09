-- This file is autogenerated from regen-schema.ts
create table if not exists
  creator_portfolio_history (
    id bigint primary key generated always as identity not null,
    user_id text not null,
    ts timestamp without time zone default now() not null,
    unique_bettors integer not null,
    fees_earned numeric not null,
    volume numeric not null,
    views integer not null
  );

-- Row Level Security
alter table creator_portfolio_history enable row level security;

-- Policies
drop policy if exists "public read" on creator_portfolio_history;

create policy "public read" on creator_portfolio_history for
select
  using (true);

-- Indexes
drop index if exists creator_portfolio_history_pkey;

create unique index creator_portfolio_history_pkey on public.creator_portfolio_history using btree (id);

drop index if exists creator_portfolio_history_user_ts;

create index creator_portfolio_history_user_ts on public.creator_portfolio_history using btree (user_id, ts desc);
