/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import * as authApi from "../api/auth";
import { getSupabase, isSupabaseConfigured } from "../api/supabase";
import { getProfile } from "../api/profile";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(isSupabaseConfigured);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(() => isSupabaseConfigured ? null : "Supabase is not configured. Add the public project URL and anon key to .env.");
  const [loginStamp, setLoginStamp] = useState(() => Date.now());

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return undefined;
    }

    let active = true;
    const supabase = getSupabase();

    async function setSessionAndProfile(nextSession) {
      if (!active) return;
      setSession(nextSession);
      if (!nextSession) {
        setUser(null);
        return;
      }
      try {
        const profile = await getProfile(nextSession.user.id);
        if (active) setUser({ ...nextSession.user, ...profile, email: nextSession.user.email });
      } catch (profileError) {
        if (active) setError(profileError.message);
      }
    }

    async function initializeSession() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!active) return;

        if (sessionError) {
          setError(sessionError.message);
          await setSessionAndProfile(null);
        } else if (data.session) {
          // A persisted access JWT may have expired while the app was closed.
          // Refresh before any profile or dashboard REST request uses that token.
          const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError || !refreshed.session) {
            await supabase.auth.signOut({ scope: "local" });
            if (active) setError("Your session has expired. Please log in again.");
            await setSessionAndProfile(null);
          } else {
            await setSessionAndProfile(refreshed.session);
          }
        } else {
          await setSessionAndProfile(null);
        }
      } catch (sessionError) {
        if (active) {
          setError(sessionError.message || "Unable to restore your session. Please log in again.");
          await setSessionAndProfile(null);
        }
      } finally {
        if (active) setInitializing(false);
      }
    }

    initializeSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, nextSession) => {
      // initializeSession owns the first session read, avoiding a stale INITIAL_SESSION
      // event racing the explicit refresh above.
      if (event === "INITIAL_SESSION") return;
      setSessionAndProfile(nextSession);
      if (nextSession) setLoginStamp(Date.now());
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signup(credentials) {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.signup(credentials);
      if (data.error) throw data.error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials) {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.login(credentials);
      if (data.error) throw data.error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function loginWithGoogle() {
    setLoading(true);
    setError(null);
    try {
      const data = await authApi.loginWithGoogle();
      if (data.error) throw data.error;
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    if (isSupabaseConfigured) await getSupabase().auth.signOut();
    setSession(null);
    setUser(null);
  }

  function updateUser(nextUser) {
    setUser((current) => ({ ...current, ...nextUser }));
  }

  return (
    <AuthContext.Provider value={{ token: session?.access_token ?? null, user, loading, error, initializing, loginStamp, signup, login, loginWithGoogle, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
