import { getSupabase } from "./supabase";

const fromRow = (row) => ({
  id: row.id,
  moduleId: row.module_id,
  module: row.modules.code,
  number: row.assessment_number,
  type: row.type,
  dueDate: row.due_date,
  mark: row.mark === null ? null : Number(row.mark),
  weight: Number(row.weight),
  status: row.status,
});

export async function getAssessments() {
  const { data, error } = await getSupabase()
    .from("assignments")
    .select("id, module_id, assessment_number, type, due_date, mark, weight, status, modules!inner(code)")
    .order("due_date");
  if (error) throw error;
  return data.map(fromRow);
}

export async function createAssessment(assessment) {
  const payload = {
    module_id: assessment.moduleId,
    assessment_number: Number(assessment.number),
    type: assessment.type,
    due_date: assessment.dueDate,
    weight: Number(assessment.weight),
  };
  const { data, error } = await getSupabase()
    .from("assignments")
    .insert(payload)
    .select("id, module_id, assessment_number, type, due_date, mark, weight, status, modules!inner(code)")
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateAssessment(id, updates) {
  const payload = {};
  if ("mark" in updates) payload.mark = updates.mark;
  if ("dueDate" in updates) payload.due_date = updates.dueDate;
  if ("weight" in updates) payload.weight = Number(updates.weight);
  if ("status" in updates) payload.status = updates.status;
  const { data, error } = await getSupabase()
    .from("assignments")
    .update(payload)
    .eq("id", id)
    .select("id, module_id, assessment_number, type, due_date, mark, weight, status, modules!inner(code)")
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function deleteAssessment(id) {
  const { error } = await getSupabase().from("assignments").delete().eq("id", id);
  if (error) throw error;
}
