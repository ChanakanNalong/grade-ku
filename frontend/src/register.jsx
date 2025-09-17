import { useState } from "react";

const API = import.meta.env.VITE_API || "http://localhost:5000";

export default function Register() {
    const [form, setForm] = useState({
        student_id: "",
        username: "",
        password: "",
        Fname: "",
        Lname: "",
        faculty: "",
        dept: "",
        email: "",
        phone: ""
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState(null);
    const [err, setErr] = useState(null);

    const onChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        console.log("form will send:", form);
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
            if (!res.ok) throw new Error(data?.error || data?.message || "Register failed");
            setMsg("สมัครสมาชิกเรียบร้อย");
            setForm({
                student_id: "",
                username: "",
                password: "",
                Fname: "",
                Lname: "",
                faculty: "",
                dept: "",
                email: "",
                phone: "",
            });
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
                    <label>รหัสนิสิต</label>
                    <input
                        name="student_id"
                        type="number"
                        value={form.student_id}
                        onChange={onChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>username</label>
                    <input
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={onChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>password</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Fname</label>
                    <input
                        name="Fname"
                        type="text"
                        value={form.Fname}
                        onChange={onChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>Lname</label>
                    <input
                        name="Lname"
                        type="text"
                        value={form.Lname}
                        onChange={onChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>faculty</label>
                    <input
                        name="faculty"
                        type="text"
                        value={form.faculty}
                        onChange={onChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>dept</label>
                    <input
                        name="dept"
                        type="text"
                        value={form.dept}
                        onChange={onChange}
                        required
                        style={{ width: "100%" }}
                    />
                </div>

                <div style={{ marginBottom: 12 }}>
                    <label>email</label>
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
                    <label>phone</label>
                    <input
                        name="phone"
                        type="text"
                        value={form.phone}
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
