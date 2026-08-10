-- ============================================================
-- ซ่อมตาราง Chat / Works (รันเมื่อเจอ error: column "chat_id" does not exist)
-- สาเหตุ: ตารางถูกสร้างค้างสถานะครึ่งๆ จากการรันครั้งก่อน
-- วิธีใช้: รันไฟล์นี้ใน Supabase SQL Editor (แทนส่วนที่ error) แล้วรัน seed.sql
-- ============================================================

-- ลบตารางที่ค้างอยู่ออกก่อน (เรียงตามลำดับ dependency)
drop table if exists public.agent_works;
drop table if exists public.chat_messages;
drop table if exists public.agent_chats;

-- สร้างใหม่ให้สะอาด
create table public.agent_chats (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  agent_id    text references public.agents(id) on delete cascade,
  is_group    boolean not null default false,
  title       text not null default 'แชทใหม่',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  chat_id     uuid not null references public.agent_chats(id) on delete cascade,
  role        text not null check (role in ('user', 'agent')),
  agent_id    text references public.agents(id) on delete set null,
  content     text not null,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create table public.agent_works (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  agent_id    text references public.agents(id) on delete cascade,
  chat_id     uuid references public.agent_chats(id) on delete set null,
  title       text not null,
  content     text not null,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- เปิด RLS
alter table public.agent_chats   enable row level security;
alter table public.chat_messages enable row level security;
alter table public.agent_works   enable row level security;

-- Index
create index if not exists idx_chats_user    on public.agent_chats (user_id);
create index if not exists idx_messages_chat on public.chat_messages (chat_id);
create index if not exists idx_works_user    on public.agent_works (user_id);

-- ตรวจสอบว่าคอลัมน์เพิ่มใน agents มีครบ (ถ้ายังไม่ได้รัน schema ครั้งแรก)
alter table public.agents
  add column if not exists provider     text not null default 'groq',
  add column if not exists model        text not null default '',
  add column if not exists avatar_color text not null default 'blue';
