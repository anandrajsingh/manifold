-- This file is autogenerated from regen-schema.ts
create table if not exists
  love_likes (
    creator_id text not null,
    target_id text not null,
    like_id text default random_alphanumeric (12) not null,
    created_time timestamp with time zone default now() not null,
    constraint primary key (creator_id, like_id)
  );

-- Row Level Security
alter table love_likes enable row level security;

-- Policies
drop policy if exists "public read" on love_likes;

create policy "public read" on love_likes for
select
  using (true);

-- Indexes
drop index if exists love_likes_pkey;

create unique index love_likes_pkey on public.love_likes using btree (creator_id, like_id);

drop index if exists user_likes_target_id_raw;

create index user_likes_target_id_raw on public.love_likes using btree (target_id);
