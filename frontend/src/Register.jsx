import { useState } from "react";

const API = import.meta.env.VITE_API || "http://localhost:5000";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setErr(null);
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Register error:", data);
        throw new Error(data?.error || data?.message || "Register failed");
      }
      setMsg("✅ สมัครสมาชิกเรียบร้อย! ไปหน้า Login ได้เลย");
      setForm({ name: "", email: "", password: "" });
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>ชื่อ</label>
          <input
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>อีเมล</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>รหัสผ่าน</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            required
            style={{ width: "100%" }}
          />
        </div>

        <button disabled={loading} type="submit">
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>
      </form>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "crimson" }}>{err}</p>}
    </div>
  );
}
