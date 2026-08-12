import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/");
    } catch {
      // error already captured in context
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-md shadow-sm w-full max-w-sm border-l-4 border-ink"
      >
        <h1 className="font-display text-xl text-ink mb-6">Log in to StudyOS</h1>

        {error && <p className="text-stamp text-sm mb-4">{error}</p>}

        <label className="block text-sm text-ink/80 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-slate/30 rounded px-3 py-2 mb-4 bg-paper text-ink"
        />

        <label className="block text-sm text-ink/80 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-slate/30 rounded px-3 py-2 mb-6 bg-paper text-ink"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper font-mono text-sm py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p className="text-sm text-slate mt-4 text-center">
          No account?{" "}
          <Link to="/signup" className="text-stamp hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
