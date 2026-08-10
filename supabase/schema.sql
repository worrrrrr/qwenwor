-- ============================================================
-- Agentic Knowledge Workspace — Database Schema
-- รันผ่าน: Supabase Dashboard → SQL Editor (หรือ supabase db push)
-- ============================================================

-- ส่วนขยายสำหรับ RAG (embedding search) — Supabase มีให้พร้อมแล้ว
create extension if not exists vector;

-- 1) Agents -------------------------------------------------
create table if not exists public.agents (
  id          text primary key,
  name        text not null,
  identity    jsonb not null default '{}'::jsonb,
  capabilities text[] not null default '{}',
  status      text not null default 'idle'
              check (status in ('idle', 'working', 'waiting', 'error')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 2) Knowledge (RAG) ----------------------------------------
create table if not exists public.knowledge (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text not null,
  embeddings  vector(1536),
  source      text not null default '',
  tags        text[] not null default '{}',
  agent_id    text references public.agents(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 3) Memories ------------------------------------------------
create table if not exists public.memories (
  id          uuid primary key default gen_random_uuid(),
  agent_id    text not null references public.agents(id) on delete cascade,
  type        text not null
              check (type in ('short_term', 'long_term', 'episodic', 'semantic')),
  content     text not null,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- 4) Workflows -----------------------------------------------
create table if not exists public.workflows (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  status      text not null default 'pending'
              check (status in ('pending', 'running', 'completed', 'failed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 5) Workflow steps ------------------------------------------
create table if not exists public.workflow_steps (
  id          uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflows(id) on delete cascade,
  position    int not null default 0,
  name        text not null,
  agent_id    text references public.agents(id) on delete set null,
  action      text not null default '',
  input       jsonb not null default '{}'::jsonb,
  output      jsonb,
  status      text not null default 'pending'
              check (status in ('pending', 'running', 'completed', 'failed', 'skipped'))
);

-- 6) Scheduled tasks -----------------------------------------
create table if not exists public.tasks (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  cron_expression text not null default '',
  workflow_id     uuid references public.workflows(id) on delete set null,
  action          text not null default '',
  enabled         boolean not null default true,
  last_run        timestamptz,
  next_run        timestamptz,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- เปิด RLS ไว้ (service_role key ยังเข้าถึงได้เสมอ)
-- แอปนี้ยังไม่มีระบบ login — ใช้ฝั่ง server เป็นหลัก
-- ============================================================
alter table public.agents         enable row level security;
alter table public.knowledge      enable row level security;
alter table public.memories       enable row level security;
alter table public.workflows      enable row level security;
alter table public.workflow_steps enable row level security;
alter table public.tasks          enable row level security;

-- 7) Agent chats (คุยแยกแต่ละ Agent / แชทรวม) ----------------
create table if not exists public.agent_chats (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  agent_id    text references public.agents(id) on delete cascade,
  is_group    boolean not null default false,
  title       text not null default 'แชทใหม่',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 8) Chat messages -------------------------------------------
create table if not exists public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  chat_id     uuid not null references public.agent_chats(id) on delete cascade,
  role        text not null check (role in ('user', 'agent')),
  agent_id    text references public.agents(id) on delete set null,
  content     text not null,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- 9) Agent works (ผลงาน) --------------------------------------
create table if not exists public.agent_works (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  agent_id    text references public.agents(id) on delete cascade,
  chat_id     uuid references public.agent_chats(id) on delete set null,
  title       text not null,
  content     text not null,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- เพิ่มคอลัมน์ให้ agents (เลือก AI provider + สีอวาตาร์)
alter table public.agents
  add column if not exists provider     text not null default 'groq',
  add column if not exists model        text not null default '',
  add column if not exists avatar_color text not null default 'blue';

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.agent_chats   enable row level security;
alter table public.chat_messages enable row level security;
alter table public.agent_works   enable row level security;

-- Index ช่วยให้ค้นหาเร็วขึ้น
create index if not exists idx_chats_user     on public.agent_chats (user_id);
create index if not exists idx_messages_chat  on public.chat_messages (chat_id);
create index if not exists idx_works_user     on public.agent_works (user_id);
