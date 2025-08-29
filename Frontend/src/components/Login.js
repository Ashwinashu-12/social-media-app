import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [emailOrUsername, setEU] = useState("");
  const [password, setPW] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const data = await API.login({ emailOrUsername, password });
      localStorage.setItem("token", data.token);
      nav("/");
    } catch (e) {
      setErr(e.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={authWrap}>
      <form onSubmit={submit} style={card}>
        <h2>Login</h2>
        {err && <div style={errBox}>{err}</div>}
        <input value={emailOrUsername} onChange={(e) => setEU(e.target.value)} placeholder="Email or Username" />
        <input value={password} onChange={(e) => setPW(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">Login</button>
        <p style={{ marginTop: 8 }}>No account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
}

const authWrap = { display: "flex", justifyContent: "center", padding: 24 };
const card = { display: "flex", flexDirection: "column", gap: 10, width: 320, border: "1px solid #eee", borderRadius: 8, padding: 16 };
const errBox = { background: "#ffecec", color: "#a10000", padding: 8, borderRadius: 6 };
