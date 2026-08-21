-- Sprint 2A: Shared directory of South African public universities.
-- Baseline names are sourced from the DHET "Universities in South Africa" directory:
-- https://www.dhet.gov.za/SitePages/UniversitiesinSA.aspx

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null check (name = btrim(name) and char_length(name) > 0)
);

create unique index if not exists universities_name_unique_idx
  on public.universities (lower(name));

-- Fixed IDs make this baseline stable and reproducible across fresh environments.
insert into public.universities (id, name)
values
  ('00000000-0000-4000-8000-000000000001', 'Cape Peninsula University of Technology'),
  ('00000000-0000-4000-8000-000000000002', 'Central University of Technology, Free State'),
  ('00000000-0000-4000-8000-000000000003', 'Durban University of Technology'),
  ('00000000-0000-4000-8000-000000000004', 'Mangosuthu University of Technology'),
  ('00000000-0000-4000-8000-000000000005', 'Nelson Mandela University'),
  ('00000000-0000-4000-8000-000000000006', 'North-West University'),
  ('00000000-0000-4000-8000-000000000007', 'Rhodes University'),
  ('00000000-0000-4000-8000-000000000008', 'Sefako Makgatho Health Sciences University'),
  ('00000000-0000-4000-8000-000000000009', 'Sol Plaatje University'),
  ('00000000-0000-4000-8000-000000000010', 'Stellenbosch University'),
  ('00000000-0000-4000-8000-000000000011', 'Tshwane University of Technology'),
  ('00000000-0000-4000-8000-000000000012', 'University of Cape Town'),
  ('00000000-0000-4000-8000-000000000013', 'University of Fort Hare'),
  ('00000000-0000-4000-8000-000000000014', 'University of Johannesburg'),
  ('00000000-0000-4000-8000-000000000015', 'University of KwaZulu-Natal'),
  ('00000000-0000-4000-8000-000000000016', 'University of Limpopo'),
  ('00000000-0000-4000-8000-000000000017', 'University of Mpumalanga'),
  ('00000000-0000-4000-8000-000000000018', 'University of Pretoria'),
  ('00000000-0000-4000-8000-000000000019', 'University of South Africa'),
  ('00000000-0000-4000-8000-000000000020', 'University of the Free State'),
  ('00000000-0000-4000-8000-000000000021', 'University of the Western Cape'),
  ('00000000-0000-4000-8000-000000000022', 'University of the Witwatersrand'),
  ('00000000-0000-4000-8000-000000000023', 'University of Venda'),
  ('00000000-0000-4000-8000-000000000024', 'University of Zululand'),
  ('00000000-0000-4000-8000-000000000025', 'Vaal University of Technology'),
  ('00000000-0000-4000-8000-000000000026', 'Walter Sisulu University')
on conflict (id) do update set name = excluded.name;

alter table public.universities enable row level security;

drop policy if exists "Anyone can read the university directory" on public.universities;
create policy "Anyone can read the university directory"
  on public.universities
  for select
  to anon, authenticated
  using (true);
