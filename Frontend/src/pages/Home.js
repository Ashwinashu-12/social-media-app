import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [commentValues, setCommentValues] = useState({});

  // Fetch posts once on mount
  const fetchPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found.');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/posts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts', error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle comment input per post
  const handleCommentChange = useCallback((postId, value) => {
    setCommentValues((prev) => ({
      ...prev,
      [postId]: value,
    }));
  }, []);

  // Comment on a post
  const handleComment = useCallback(async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const text = commentValues[postId]?.trim();
      if (!text) return;

      await axios.post(
        'http://localhost:5000/api/comments',
        { postId, text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentValues((prev) => ({ ...prev, [postId]: '' }));
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment', error);
    }
  }, [commentValues, fetchPosts]);

  // Like a post
  const handleLike = useCallback(async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchPosts();
    } catch (error) {
      console.error('Error liking post', error);
    }
  }, [fetchPosts]);

  // Delete a post
  const handleDelete = useCallback(async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post', error);
    }
  }, [fetchPosts]);

  return (
    <div className="home-page">
      <h2 style={{ textAlign: 'center' }}>All Posts</h2>
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No posts found.</p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            commentValue={commentValues[post._id] || ''}
            onCommentChange={(e) => handleCommentChange(post._id, e.target.value)}
            onComment={() => handleComment(post._id)}
            onLike={() => handleLike(post._id)}
            onDelete={() => handleDelete(post._id)}
          />
        ))
      )}
    </div>
  );
};

export default Home;
