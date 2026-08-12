import { getSupabase } from "./supabase";

const normalizeCode = (code) => code.trim().toUpperCase();

const fromRow = (row) => ({
  id: row.id,
  code: row.code,
  name: row.name,
  period: row.period,
  courseworkWeight: Number(row.coursework_weight),
  examEntranceMark: Number(row.exam_entrance_mark),
  assessments: (row.shared_module_assessments ?? []).map((assessment) => ({
    number: assessment.assessment_number,
    type: assessment.type,
    weight: Number(assessment.weight),
    dueMonth: assessment.due_month,
    dueDay: assessment.due_day,
  })),
});

export async function findSharedModule(institution, code) {
  if (!institution?.trim() || !code?.trim()) return null;

  const { data, error } = await getSupabase()
    .from("shared_modules")
    .select("id, code, name, period, coursework_weight, exam_entrance_mark, universities!inner(name), shared_module_assessments(assessment_number, type, weight, due_month, due_day)")
    .ilike("code", normalizeCode(code))
    .ilike("universities.name", institution.trim())
    .maybeSingle();
  if (error) throw error;
  return data ? fromRow(data) : null;
}
