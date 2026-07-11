-- ─── Inflate AI CRM — Supabase Schema ────────────────────────────────────────
-- Run this entire file in: Supabase Dashboard → SQL Editor → New Query → Run

-- Leads table
create table if not exists leads (
  id              uuid primary key default gen_random_uuid(),
  business_name   text not null,
  owner_name      text not null,
  phone           text,
  email           text,
  contact_method  text,        -- 'phone-call' | 'facebook' | 'email' | 'cold-call'
  date_contacted  date,
  status          text not null default 'new',
  -- 'new' | 'no-answer' | 'contacted' | 'engaged' | 'fu1' | 'fu2' | 'fu3' | 'demo-sent' | 'meeting' | 'closed' | 'dead'
  last_contacted_at timestamptz, -- set whenever status changes to 'contacted' or 'engaged'
  followup_sent_at  timestamptz, -- set when user marks fu1/fu2 outreach as sent; drives auto-advance timer
  notes           text,
  deal_value      numeric,
  source          text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Companies table
create table if not exists companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  industry    text,
  website     text,
  phone       text,
  email       text,
  address     text,
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Activity log table
create table if not exists activity_log (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid references leads(id) on delete set null,
  type        text not null,
  description text not null,
  created_at  timestamptz not null default now()
);

-- Auto-update updated_at on leads
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();

create trigger companies_updated_at
  before update on companies
  for each row execute function update_updated_at();

-- Disable Row Level Security (this is a private internal tool)
-- If you want to add auth later, remove these and set up RLS policies instead.
alter table leads         disable row level security;
alter table companies     disable row level security;
alter table activity_log  disable row level security;

-- Migration: contacted/engaged statuses + auto-followup timestamps
-- Run this against the existing live DB (fresh installs already get these from the CREATE TABLE above).
alter table leads add column if not exists last_contacted_at timestamptz;
alter table leads add column if not exists followup_sent_at   timestamptz;
