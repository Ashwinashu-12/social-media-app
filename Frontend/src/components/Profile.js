import React, { useEffect, useState } from "react";
import API from "../api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    API.getCurrentUser(token).then(setProfile);
  }, [token]);

  const remove = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    await API.deletePost(id, token);
    setProfile((p) => ({ ...p, posts: p.posts.filter((x) => x._id !== id) }));
  };

  if (!profile) return <p style={{ padding: 16 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: 16 }}>
      <h2 style={{ marginBottom: 4 }}>{profile.username}</h2>
      <div style={{ color: "#666" }}>{profile.email}</div>
      <div style={{ margin: "8px 0 16px" }}>
        <b>{profile.followers?.length || 0}</b> followers · <b>{profile.following?.length || 0}</b> following
      </div>

      <h3>My Posts</h3>
      {(profile.posts || []).length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        profile.posts.map((p) => (
          <div key={p._id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12, marginBottom: 12 }}>
            <div>{p.text}</div>
            {p.image && <img src={p.image} alt="" style={{ width: "100%", borderRadius: 8, marginTop: 8 }} />}
            <button onClick={() => remove(p._id)} style={{ marginTop: 10, background: "#ffebee", border: "1px solid #f5c6cb", padding: "6px 10px", cursor: "pointer" }}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}
