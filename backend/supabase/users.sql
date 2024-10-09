-- This file is autogenerated from regen-schema.ts
create table if not exists
  users (
    id text primary key default random_alphanumeric (12) not null,
    data jsonb not null,
    username text not null,
    name text not null,
    created_time timestamp with time zone default now() not null,
    name_username_vector tsvector generated always as (
      to_tsvector(
        'english'::regconfig,
        (name || ' '::text) || username
      )
    ) stored,
    balance numeric default 0 not null,
    total_deposits numeric default 0 not null,
    spice_balance numeric default 0 not null,
    resolved_profit_adjustment numeric,
    cash_balance numeric default 0 not null,
    total_cash_deposits numeric default 0 not null
  );

-- Row Level Security
alter table users enable row level security;

-- Policies
drop policy if exists "public read" on users;

create policy "public read" on users for
select
  using (true);

-- Indexes
drop index if exists users_pkey;

create unique index users_pkey on public.users using btree (id);

drop index if exists user_referrals_idx;

create index user_referrals_idx on public.users using btree (((data ->> 'referredByUserId'::text)))
where
  ((data ->> 'referredByUserId'::text) is not null);

drop index if exists user_username_idx;

create index user_username_idx on public.users using btree (username);

drop index if exists users_betting_streak_idx;

create index users_betting_streak_idx on public.users using btree (
  (((data -> 'currentBettingStreak'::text))::integer)
);

drop index if exists users_created_time;

create index users_created_time on public.users using btree (created_time desc);

drop index if exists users_name_idx;

create index users_name_idx on public.users using btree (name);

drop index if exists users_phone_key;

create unique index users_phone_key on auth.users using btree (phone);

drop index if exists users_pkey;

create unique index users_pkey on auth.users using btree (id);

drop index if exists confirmation_token_idx;

create unique index confirmation_token_idx on auth.users using btree (confirmation_token)
where
  ((confirmation_token)::text !~ '^[0-9 ]*$'::text);

drop index if exists email_change_token_current_idx;

create unique index email_change_token_current_idx on auth.users using btree (email_change_token_current)
where
  (
    (email_change_token_current)::text !~ '^[0-9 ]*$'::text
  );

drop index if exists email_change_token_new_idx;

create unique index email_change_token_new_idx on auth.users using btree (email_change_token_new)
where
  (
    (email_change_token_new)::text !~ '^[0-9 ]*$'::text
  );

drop index if exists reauthentication_token_idx;

create unique index reauthentication_token_idx on auth.users using btree (reauthentication_token)
where
  (
    (reauthentication_token)::text !~ '^[0-9 ]*$'::text
  );

drop index if exists recovery_token_idx;

create unique index recovery_token_idx on auth.users using btree (recovery_token)
where
  ((recovery_token)::text !~ '^[0-9 ]*$'::text);

drop index if exists users_email_partial_key;

create unique index users_email_partial_key on auth.users using btree (email)
where
  (is_sso_user = false);

drop index if exists users_is_anonymous_idx;

create index users_is_anonymous_idx on auth.users using btree (is_anonymous);
