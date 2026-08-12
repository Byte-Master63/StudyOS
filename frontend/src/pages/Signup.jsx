import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUniversities } from "../api/universities";

const initialProfile = { fullName: "", age: "", institution: "", country: "", username: "", email: "", password: "", confirmPassword: "", gender: "", ethnicity: "" };

const passwordRules = [
  ["8 or more characters", (value) => value.length >= 8],
  ["an uppercase letter", (value) => /[A-Z]/.test(value)],
  ["a lowercase letter", (value) => /[a-z]/.test(value)],
  ["a number", (value) => /\d/.test(value)],
  ["a special character", (value) => /[^A-Za-z0-9]/.test(value)],
];

export default function Signup() {
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(initialProfile);
  const [universities, setUniversities] = useState([]);
  const [formError, setFormError] = useState("");
  const update = (field) => (event) => setProfile({ ...profile, [field]: event.target.value });

  useEffect(() => {
    getUniversities().then(setUniversities).catch(() => {
      // The existing free-text field remains usable if the directory is unavailable.
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    const required = ["fullName", "age", "institution", "country", "username", "email", "password"];
    if (required.some((field) => !String(profile[field]).trim())) {
      setFormError("Please complete every required field.");
      return;
    }
    if (!passwordRules.every(([, passes]) => passes(profile.password))) return setFormError("Choose a stronger password before continuing.");
    if (profile.password !== profile.confirmPassword) return setFormError("Your passwords do not match.");
    const payload = Object.fromEntries(Object.entries(profile).filter(([field]) => field !== "confirmPassword"));
    try {
      const { session } = await signup(payload);
      if (session) navigate("/");
      else setFormError("Check your email to confirm your account, then log in.");
    } catch { /* Context exposes the API error. */ }
  }

  return <div className="min-h-screen py-8 px-4 flex items-center justify-center bg-paper">
    <form onSubmit={handleSubmit} className="signup-card bg-white p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-2xl border border-violet-100">
      <p className="font-mono text-xs uppercase tracking-[.2em] text-fuchsia-600">Join your study space</p>
      <h1 className="font-display text-3xl text-ink mt-2">Create your StudyOS account ✦</h1>
      <p className="text-sm text-slate mt-2 mb-6">Fields marked <span className="text-fuchsia-600 font-bold">*</span> are required. Optional details help personalise your profile.</p>
      {(error || formError) && <p className="rounded-xl bg-rose-50 px-3 py-2 text-stamp text-sm mb-4">{formError || error}</p>}

      <fieldset className="grid md:grid-cols-2 gap-4"><legend className="sr-only">Account profile</legend>
        <Field label="Full name" required><input required value={profile.fullName} onChange={update("fullName")} className="input w-full" autoComplete="name" /></Field>
        <Field label="Age" required><input required type="number" min="1" max="130" value={profile.age} onChange={update("age")} className="input w-full" autoComplete="age" /></Field>
        <Field label="Institution" required><input required list="university-directory" value={profile.institution} onChange={update("institution")} placeholder="e.g. University of South Africa" className="input w-full" autoComplete="organization" /><UniversityOptions universities={universities} /></Field>
        <Field label="Country" required><input required value={profile.country} onChange={update("country")} placeholder="e.g. South Africa" className="input w-full" autoComplete="country-name" /></Field>
        <Field label="Username" required><input required value={profile.username} onChange={update("username")} className="input w-full" autoComplete="username" /></Field>
        <Field label="Email" required><input required type="email" value={profile.email} onChange={update("email")} className="input w-full" autoComplete="email" /></Field>
        <Field label="Password" required><input required type="password" minLength="8" value={profile.password} onChange={update("password")} className="input w-full" autoComplete="new-password" /><PasswordStrength value={profile.password} /></Field>
        <Field label="Confirm password" required><input required type="password" minLength="8" value={profile.confirmPassword} onChange={update("confirmPassword")} className="input w-full" autoComplete="new-password" />{profile.confirmPassword && <span className={`text-xs mt-1 block ${profile.password === profile.confirmPassword ? "text-emerald-700" : "text-stamp"}`}>{profile.password === profile.confirmPassword ? "Passwords match" : "Passwords do not match"}</span>}</Field>
        <Field label="Gender" optional><select value={profile.gender} onChange={update("gender")} className="input w-full"><option value="">Prefer not to say</option><option>Woman</option><option>Man</option><option>Non-binary</option><option>Another identity</option></select></Field>
        <Field label="Ethnicity" optional><input value={profile.ethnicity} onChange={update("ethnicity")} placeholder="Optional" className="input w-full" /></Field>
      </fieldset>
      <p className="text-xs text-slate mt-4">Your password must have at least 8 characters, uppercase and lowercase letters, a number, and a special character.</p>
      <button type="submit" disabled={loading} className="w-full mt-5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-mono text-sm py-3 hover:opacity-90 transition-opacity disabled:opacity-50">{loading ? "Creating account..." : "Create my account"}</button>
      <p className="text-sm text-slate mt-4 text-center">Already have an account? <Link to="/login" className="text-violet-700 font-medium hover:underline">Log in</Link></p>
    </form>
  </div>;
}

function Field({ label, required, optional, children }) {
  return <label className="block text-sm font-medium text-ink/80">{label} {required && <span className="text-fuchsia-600">*</span>}{optional && <span className="font-normal text-slate">(optional)</span>}<span className="block mt-1">{children}</span></label>;
}

function UniversityOptions({ universities }) {
  return <datalist id="university-directory">{universities.map((university) => <option key={university.id} value={university.name} />)}</datalist>;
}

function PasswordStrength({ value }) {
  const passed = passwordRules.filter(([, check]) => check(value)).length;
  const label = !value ? "Start typing" : passed === 5 ? "Strong" : passed >= 3 ? "Getting there" : "Weak";
  return <div className="mt-2"><div className="flex gap-1" aria-label={`Password strength: ${label}`}>{passwordRules.map(([rule, check]) => <span key={rule} className={`h-1 flex-1 rounded-full ${check(value) ? "bg-emerald-500" : "bg-slate-200"}`} />)}</div><p className="mt-1 text-[11px] text-slate">{label} · {passed}/5 requirements</p><ul className="mt-1 text-[11px] text-slate">{passwordRules.map(([rule, check]) => <li key={rule} className={check(value) ? "text-emerald-700" : ""}> {check(value) ? "✓" : "○"} {rule}</li>)}</ul></div>;
}
