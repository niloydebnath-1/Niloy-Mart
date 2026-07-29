import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await register({ name: form.name, email: form.email, password: form.password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container narrow page-section">
      <form className="card form-card" onSubmit={submit}>
        <h1>Create account</h1>
        <Message>{error}</Message>
        <label>Name<input name="name" value={form.name} onChange={update} required /></label>
        <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
        <label>Password<input name="password" type="password" minLength="6" value={form.password} onChange={update} required /></label>
        <label>Confirm password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={update} required /></label>
        <button className="button full" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
        <p>Already registered? <Link to="/login">Login</Link></p>
      </form>
    </main>
  );
}
