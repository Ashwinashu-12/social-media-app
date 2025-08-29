import React, { useEffect, useState } from 'react';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch posts');
        }

        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>{post.user?.username || 'Unknown User'}</strong></p>
            <p>{post.content}</p>
            <p style={{ fontSize: '12px', color: '#888' }}>{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PostsList;
