-- This file is autogenerated from regen-schema.ts
create table if not exists
  votes (
    id text not null,
    contract_id text not null,
    user_id text not null,
    created_time timestamp with time zone default now() not null,
    constraint primary key (id, contract_id, user_id)
  );

-- Indexes
drop index if exists votes_pkey;

create unique index votes_pkey on public.votes using btree (id, contract_id, user_id);
