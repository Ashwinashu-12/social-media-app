import React, { useEffect, useState } from "react";
import API from "../api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    API.getPosts(token)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [token]);

  const like = async (id) => {
    await API.likePost(id, token);
    setPosts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, likesCount: (p.likesCount || p.likes?.length || 0) + (p.liked ? -1 : 1), liked: !p.liked } : p))
    );
  };

  const comment = async (id, text) => {
    if (!text.trim()) return;
    await API.commentPost(id, text, token);
    // refetch or optimistically add — here we refetch quickly
    const fresh = await API.getPosts(token);
    setPosts(fresh);
  };

  if (loading) return <p style={{ padding: 16 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      {posts.map((p) => (
        <div key={p._id} style={postCard}>
          <div style={{ fontWeight: 600 }}>{p.user?.username || "User"}</div>
          <div style={{ margin: "8px 0" }}>{p.text}</div>
          {p.image && <img src={p.image} alt="" style={{ width: "100%", borderRadius: 8 }} />}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button onClick={() => like(p._id)}>Like ({p.likes?.length ?? 0})</button>
          </div>
          <CommentBox onSubmit={(t) => comment(p._id, t)} />
          <div style={{ marginTop: 8 }}>
            {(p.comments || []).map((c) => (
              <div key={c._id} style={{ padding: "6px 0", borderTop: "1px solid #f3f3f3" }}>
                <b>{c.user?.username || "user"}:</b> {c.text}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const CommentBox = ({ onSubmit }) => {
  const [t, setT] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(t);
        setT("");
      }}
      style={{ marginTop: 8, display: "flex", gap: 8 }}
    >
      <input value={t} onChange={(e) => setT(e.target.value)} placeholder="Write a comment..." style={{ flex: 1 }} />
      <button type="submit">Send</button>
    </form>
  );
};

const postCard = { border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 16 };
