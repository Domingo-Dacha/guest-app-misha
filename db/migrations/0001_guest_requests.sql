create table if not exists schema_migrations (
  version text primary key,
  applied_at timestamptz not null default now()
);

-- statement-breakpoint

create table if not exists guest_requests (
  id uuid primary key default gen_random_uuid(),
  team_slug text not null check (team_slug ~ '^[a-z0-9-]{1,48}$'),
  kind text not null check (kind in ('question', 'service', 'help')),
  guest_name text check (guest_name is null or char_length(guest_name) between 1 and 80),
  message text not null check (char_length(message) between 3 and 2000),
  status text not null default 'new' check (status in ('new', 'in_progress', 'done')),
  idempotency_key text not null,
  created_at timestamptz not null default now(),
  unique (team_slug, idempotency_key)
);

-- statement-breakpoint

create index if not exists guest_requests_team_created_idx
  on guest_requests (team_slug, created_at desc);

-- statement-breakpoint

create table if not exists pin_access_attempts (
  team_slug text not null check (team_slug ~ '^[a-z0-9-]{1,48}$'),
  fingerprint text not null,
  failed_count integer not null default 0 check (failed_count >= 0),
  window_started_at timestamptz not null default now(),
  blocked_until timestamptz,
  updated_at timestamptz not null default now(),
  primary key (team_slug, fingerprint)
);

-- statement-breakpoint

create index if not exists pin_access_attempts_blocked_idx
  on pin_access_attempts (team_slug, blocked_until)
  where blocked_until is not null;
