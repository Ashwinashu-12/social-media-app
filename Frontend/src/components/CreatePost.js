import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [text, setText] = useState("");
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await API.createPost({ text }, token);
    nav("/");
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h2>Create Post</h2>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} placeholder="What's on your mind?" />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
