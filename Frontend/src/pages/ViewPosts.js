import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error.message);
        alert("Failed to load posts.");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "15px",
              borderRadius: "5px",
            }}
          >
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>
              By {post.author?.name || "Unknown"} | {new Date(post.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

export default ViewPosts;
