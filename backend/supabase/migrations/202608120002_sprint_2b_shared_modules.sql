-- Sprint 2B: Shared module configurations and reusable assessment templates.
-- Shared records are reference data. Student-specific modules and assignments
-- continue to live exclusively in public.modules and public.assignments.

create table if not exists public.shared_modules (
  id uuid primary key default gen_random_uuid(),
  university_id uuid not null references public.universities(id) on delete cascade,
  code text not null check (code = btrim(code) and char_length(code) between 1 and 20),
  name text not null check (name = btrim(name) and char_length(name) between 1 and 160),
  period text not null default 'semester' check (period in ('semester', 'year')),
  coursework_weight numeric(5,2) not null default 50 check (coursework_weight between 0 and 99),
  exam_entrance_mark numeric(5,2) not null default 40 check (exam_entrance_mark between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists shared_modules_university_code_unique_idx
  on public.shared_modules (university_id, lower(code));

create table if not exists public.shared_module_assessments (
  id uuid primary key default gen_random_uuid(),
  shared_module_id uuid not null references public.shared_modules(id) on delete cascade,
  assessment_number integer not null check (assessment_number > 0),
  type text not null check (type = btrim(type) and char_length(type) between 1 and 80),
  weight numeric(5,2) not null check (weight between 0 and 100),
  due_month smallint not null check (due_month between 1 and 12),
  due_day smallint not null check (
    due_day between 1 and 31
    and due_day <= extract(day from (date_trunc('month', make_date(2000, due_month, 1)) + interval '1 month - 1 day'))
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (shared_module_id, assessment_number)
);

create index if not exists shared_module_assessments_module_idx
  on public.shared_module_assessments (shared_module_id, assessment_number);

drop trigger if exists shared_modules_set_updated_at on public.shared_modules;
create trigger shared_modules_set_updated_at before update on public.shared_modules
  for each row execute procedure public.set_updated_at();
drop trigger if exists shared_module_assessments_set_updated_at on public.shared_module_assessments;
create trigger shared_module_assessments_set_updated_at before update on public.shared_module_assessments
  for each row execute procedure public.set_updated_at();

alter table public.shared_modules enable row level security;
alter table public.shared_module_assessments enable row level security;

drop policy if exists "Anyone can read shared module configurations" on public.shared_modules;
create policy "Anyone can read shared module configurations"
  on public.shared_modules for select to anon, authenticated using (true);
drop policy if exists "Anyone can read shared module assessment templates" on public.shared_module_assessments;
create policy "Anyone can read shared module assessment templates"
  on public.shared_module_assessments for select to anon, authenticated using (true);

create or replace function public.create_module_from_shared_config(
  p_shared_module_id uuid,
  p_academic_year integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_shared_module public.shared_modules%rowtype;
  v_module public.modules%rowtype;
  v_assignments jsonb;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to add a module.' using errcode = '42501';
  end if;

  if p_academic_year not between 2000 and 2100 then
    raise exception 'Academic year must be between 2000 and 2100.' using errcode = '22023';
  end if;

  -- A student can use only the configuration associated with their own profile institution.
  select sm.* into v_shared_module
  from public.shared_modules sm
  join public.universities u on u.id = sm.university_id
  join public.profiles p on p.id = auth.uid()
  where sm.id = p_shared_module_id
    and lower(btrim(p.institution)) = lower(u.name);

  if not found then
    raise exception 'No shared module configuration is available for your institution.' using errcode = '42501';
  end if;

  insert into public.modules (
    user_id, code, name, period, academic_year, coursework_weight, exam_entrance_mark
  ) values (
    auth.uid(), v_shared_module.code, v_shared_module.name, v_shared_module.period,
    p_academic_year, v_shared_module.coursework_weight, v_shared_module.exam_entrance_mark
  ) returning * into v_module;

  with inserted as (
    insert into public.assignments (
      user_id, module_id, assessment_number, type, due_date, weight
    )
    select
      auth.uid(),
      v_module.id,
      template.assessment_number,
      template.type,
      make_date(
        p_academic_year,
        template.due_month,
        least(
          template.due_day,
          extract(day from (date_trunc('month', make_date(p_academic_year, template.due_month, 1)) + interval '1 month - 1 day'))::integer
        )
      ),
      template.weight
    from public.shared_module_assessments template
    where template.shared_module_id = v_shared_module.id
    returning *
  )
  select coalesce(jsonb_agg(to_jsonb(inserted) order by inserted.assessment_number), '[]'::jsonb)
    into v_assignments
  from inserted;

  return jsonb_build_object(
    'module', to_jsonb(v_module),
    'assignments', v_assignments
  );
end;
$$;

revoke all on function public.create_module_from_shared_config(uuid, integer) from public;
grant execute on function public.create_module_from_shared_config(uuid, integer) to authenticated;
