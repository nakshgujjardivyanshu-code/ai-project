import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getErrorMessage } from "../api.js";
import AuthLayout from "../components/AuthLayout.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/signup", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start keeping track of your spending.">
      <form className="form-stack" onSubmit={handleSubmit}>
        <label>
          Your name
          <input name="name" value={form.name} onChange={updateField} required maxLength="60" autoComplete="name" />
        </label>
        <label>
          Email address
          <input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            minLength="8"
            required
            autoComplete="new-password"
          />
          <span className="field-hint">Use at least 8 characters.</span>
        </label>
        {error && <p className="notice error" role="alert">{error}</p>}
        <button className="button primary full-width" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
    </AuthLayout>
  );
}
