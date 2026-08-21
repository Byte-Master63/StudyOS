-- Sprint 2B: Initial vetted shared configurations for end-to-end validation.
-- These UNISA module schedules are based on the existing StudyOS myAdmin
-- assessment export. Due dates are stored as recurring month/day templates;
-- the cloning RPC applies the student's chosen academic year.

with seeded_modules as (
  insert into public.shared_modules (
    university_id, code, name, period, coursework_weight, exam_entrance_mark
  )
  select
    university.id,
    seed.code,
    seed.name,
    seed.period,
    seed.coursework_weight,
    seed.exam_entrance_mark
  from public.universities university
  join (
    values
      ('University of South Africa', 'COS1511', 'Introduction to Programming II', 'semester', 40.00::numeric, 40.00::numeric),
      ('University of South Africa', 'INF1520', 'Introduction to Information Systems', 'semester', 40.00::numeric, 40.00::numeric)
  ) as seed(university_name, code, name, period, coursework_weight, exam_entrance_mark)
    on university.name = seed.university_name
  on conflict (university_id, lower(code)) do update
    set name = excluded.name,
        period = excluded.period,
        coursework_weight = excluded.coursework_weight,
        exam_entrance_mark = excluded.exam_entrance_mark
  returning id, code
)
insert into public.shared_module_assessments (
  shared_module_id, assessment_number, type, weight, due_month, due_day
)
select
  shared_module.id,
  template.assessment_number,
  template.type,
  template.weight,
  template.due_month,
  template.due_day
from seeded_modules shared_module
join (
  values
    ('COS1511', 1, 'Quiz', 10.00::numeric, 5, 15),
    ('COS1511', 2, 'Assignment', 10.00::numeric, 6, 24),
    ('COS1511', 3, 'Assignment', 10.00::numeric, 8, 14),
    ('COS1511', 4, 'Quiz', 10.00::numeric, 9, 9),
    ('INF1520', 1, 'Quiz', 10.00::numeric, 5, 29),
    ('INF1520', 2, 'Quiz', 10.00::numeric, 6, 30),
    ('INF1520', 3, 'Quiz', 10.00::numeric, 7, 31),
    ('INF1520', 4, 'Assignment', 10.00::numeric, 8, 31)
) as template(module_code, assessment_number, type, weight, due_month, due_day)
  on lower(shared_module.code) = lower(template.module_code)
on conflict (shared_module_id, assessment_number) do update
  set type = excluded.type,
      weight = excluded.weight,
      due_month = excluded.due_month,
      due_day = excluded.due_day;
