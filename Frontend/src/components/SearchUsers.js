import React, { useState } from "react";
import API from "../api";

export default function SearchUsers() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("token");

  const search = async (e) => {
    e.preventDefault();
    const data = await API.searchUsers(q, token);
    setResults(data);
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      <h2>Search Users</h2>
      <form onSubmit={search} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by username or email" style={{ flex: 1 }} />
        <button type="submit">Search</button>
      </form>
      <div>
        {results.map((u) => (
          <div key={u._id} style={{ padding: "8px 0", borderBottom: "1px solid #f3f3f3" }}>
            {u.username} — <span style={{ color: "#666" }}>{u.email}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
