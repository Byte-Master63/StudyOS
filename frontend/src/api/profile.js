import { getSupabase } from "./supabase";

const fromRow = (row) => row ? ({
  username: row.username ?? "",
  fullName: row.full_name ?? "",
  age: row.age ?? "",
  birthDate: row.birth_date ?? "",
  institution: row.institution ?? "",
  country: row.country ?? "",
  gender: row.gender ?? "",
  ethnicity: row.ethnicity ?? "",
  avatarData: row.avatar_data ?? "",
  bio: row.bio ?? "",
  hobbies: row.hobbies ?? "",
}) : {};

export async function getProfile(id) {
  const { data, error } = await getSupabase().from("profiles").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return fromRow(data);
}

export async function updateProfile(data) {
  const supabase = getSupabase();
  const { data: authData, error: authError } = await supabase.auth.updateUser({
    email: data.email,
    data: { username: data.username, fullName: data.fullName },
  });
  if (authError) throw authError;
  const { data: row, error } = await supabase.from("profiles").update({
    username: data.username.trim(), full_name: data.fullName.trim(), age: data.age === "" ? null : Number(data.age),
    birth_date: data.birthDate || null, institution: data.institution.trim(), country: data.country.trim(),
    gender: data.gender, ethnicity: data.ethnicity.trim(), avatar_data: data.avatarData || null,
    bio: data.bio.trim(), hobbies: data.hobbies.trim(),
  }).eq("id", authData.user.id).select().single();
  if (error) throw error;
  return { user: { ...fromRow(row), email: authData.user.email } };
}

export async function changePassword(data) {
  const { data: authData, error } = await getSupabase().auth.updateUser({ password: data.newPassword });
  if (error) throw error;
  return { user: authData.user, session: authData.session };
}

export async function logoutAllSessions() {
  const { error } = await getSupabase().auth.signOut({ scope: "global" });
  if (error) throw error;
}
