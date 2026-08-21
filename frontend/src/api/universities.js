import { getSupabase } from "./supabase";

export async function getUniversities() {
  const { data, error } = await getSupabase()
    .from("universities")
    .select("id, name")
    .order("name");
  if (error) throw error;
  return data;
}
