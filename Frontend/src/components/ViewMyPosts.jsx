import React, { useEffect, useState } from 'react';

const ViewMyPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/posts/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || 'Failed to fetch posts');
          return;
        }

        setPosts(data);
      } catch (err) {
        setError('Something went wrong');
      }
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Posts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
            <p>{post.content}</p>
            <small>Posted on: {new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewMyPosts;
