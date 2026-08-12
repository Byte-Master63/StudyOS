import { getSupabase } from "./supabase";

export function signup(profile) {
  const { email, password, ...metadata } = profile;
  return getSupabase().auth.signUp({
    email,
    password,
    options: { data: metadata },
  });
}

export function login({ email, password }) {
  return getSupabase().auth.signInWithPassword({
    email,
    password,
  });
}

export function loginWithGoogle() {
  return getSupabase().auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}` },
  });
}
