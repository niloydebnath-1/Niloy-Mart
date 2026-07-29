import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      await login(form);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container narrow page-section">
      <form className="card form-card" onSubmit={submit}>
        <h1>Login</h1>
        <Message>{error}</Message>
        <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
        <label>Password<input name="password" type="password" value={form.password} onChange={update} required /></label>
        <button className="button full" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        <p>New user? <Link to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
