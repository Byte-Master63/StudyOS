import { getSupabase } from "./supabase";

const fromRow = (row) => ({
  id: row.id,
  code: row.code,
  name: row.name,
  period: row.period,
  academicYear: row.academic_year,
  courseworkWeight: Number(row.coursework_weight),
  examEntranceMark: Number(row.exam_entrance_mark),
});

const toRow = (data) => ({
  code: data.code.trim(),
  name: data.name.trim(),
  period: data.period,
  academic_year: Number(data.academicYear),
  coursework_weight: Number(data.courseworkWeight),
  exam_entrance_mark: Number(data.examEntranceMark),
});

export async function getModules() {
  const { data, error } = await getSupabase().from("modules").select("*").order("code");
  if (error) throw error;
  return data.map(fromRow);
}

export async function createModule(data) {
  const { data: row, error } = await getSupabase().from("modules").insert(toRow(data)).select().single();
  if (error) throw error;
  return fromRow(row);
}

export async function updateModule(id, data) {
  const { data: row, error } = await getSupabase().from("modules").update(toRow(data)).eq("id", id).select().single();
  if (error) throw error;
  return fromRow(row);
}

export async function deleteModule(id) {
  const { error } = await getSupabase().from("modules").delete().eq("id", id);
  if (error) throw error;
}
