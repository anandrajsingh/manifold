-- This file is autogenerated from regen-schema.ts
create table if not exists
  user_comment_view_events (
    id bigint primary key generated always as identity not null,
    created_time timestamp with time zone default now() not null,
    user_id text not null,
    contract_id text not null,
    comment_id text not null
  );

-- Row Level Security
alter table user_comment_view_events enable row level security;

-- Indexes
drop index if exists user_comment_view_events_pkey;

create unique index user_comment_view_events_pkey on public.user_comment_view_events using btree (id);

drop index if exists user_comment_view_events_user_id_created_time;

create index user_comment_view_events_user_id_created_time on public.user_comment_view_events using btree (user_id, created_time desc);
