import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [username, setU] = useState("");
  const [email, setE] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const data = await API.register({ username, email, password });
      localStorage.setItem("token", data.token);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Register failed");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
      <form onSubmit={submit} style={{ ...card, width: 340 }}>
        <h2>Register</h2>
        {err && <div style={errBox}>{err}</div>}
        <input value={username} onChange={(e) => setU(e.target.value)} placeholder="Username" />
        <input value={email} onChange={(e) => setE(e.target.value)} placeholder="Email" />
        <input value={password} onChange={(e) => setP(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">Create account</button>
        <p style={{ marginTop: 8 }}>Have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
}

const card = { display: "flex", flexDirection: "column", gap: 10, border: "1px solid #eee", borderRadius: 8, padding: 16 };
const errBox = { background: "#ffecec", color: "#a10000", padding: 8, borderRadius: 6 };
