-- Sprint 1: Supabase Auth-backed student profiles, modules, and assignments.
-- Run with `supabase db push` or in the Supabase SQL editor.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  full_name text,
  age smallint check (age between 1 and 130),
  birth_date date check (birth_date <= current_date),
  institution text,
  country text,
  gender text,
  ethnicity text,
  avatar_data text,
  bio text check (char_length(bio) <= 2000),
  hobbies text check (char_length(hobbies) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  code text not null check (char_length(trim(code)) between 1 and 20),
  name text not null check (char_length(trim(name)) between 1 and 160),
  period text not null default 'semester' check (period in ('semester', 'year')),
  academic_year integer not null check (academic_year between 2000 and 2100),
  coursework_weight numeric(5,2) not null default 50 check (coursework_weight between 0 and 99),
  exam_entrance_mark numeric(5,2) not null default 40 check (exam_entrance_mark between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, code, academic_year),
  unique (user_id, id)
);

create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  module_id uuid not null,
  assessment_number integer not null check (assessment_number > 0),
  type text not null check (char_length(trim(type)) between 1 and 80),
  due_date date not null,
  mark numeric(5,2) check (mark is null or mark between 0 and 100),
  weight numeric(5,2) not null default 0 check (weight between 0 and 100),
  status text not null default 'active' check (status in ('active', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (user_id, module_id) references public.modules(user_id, id) on delete cascade
);

create index if not exists assignments_user_due_date_idx on public.assignments (user_id, due_date);
create index if not exists assignments_module_idx on public.assignments (module_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, age, institution, country, gender, ethnicity)
  values (
    new.id,
    nullif(trim(new.raw_user_meta_data ->> 'username'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'fullName'), ''),
    nullif(new.raw_user_meta_data ->> 'age', '')::smallint,
    nullif(trim(new.raw_user_meta_data ->> 'institution'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'country'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'gender'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'ethnicity'), '')
  ) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
drop trigger if exists modules_set_updated_at on public.modules;
create trigger modules_set_updated_at before update on public.modules
  for each row execute procedure public.set_updated_at();
drop trigger if exists assignments_set_updated_at on public.assignments;
create trigger assignments_set_updated_at before update on public.assignments
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.modules enable row level security;
alter table public.assignments enable row level security;

create policy "Students can read their own profile" on public.profiles for select using (id = auth.uid());
create policy "Students can update their own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "Students can read their own modules" on public.modules for select using (user_id = auth.uid());
create policy "Students can add their own modules" on public.modules for insert with check (user_id = auth.uid());
create policy "Students can update their own modules" on public.modules for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Students can delete their own modules" on public.modules for delete using (user_id = auth.uid());
create policy "Students can read their own assignments" on public.assignments for select using (user_id = auth.uid());
create policy "Students can add their own assignments" on public.assignments for insert with check (user_id = auth.uid());
create policy "Students can update their own assignments" on public.assignments for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Students can delete their own assignments" on public.assignments for delete using (user_id = auth.uid());
