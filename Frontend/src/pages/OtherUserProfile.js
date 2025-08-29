// frontend/src/pages/OtherUserProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';

const OtherUserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`http://localhost:5000/api/user/${id}`);
      setUser(res.data);
    };

    const fetchPosts = async () => {
      const res = await axios.get(`http://localhost:5000/api/posts/user/${id}`);
      setPosts(res.data);
    };

    fetchUser();
    fetchPosts();
  }, [id]);

  return (
    <div className="container">
      <h2>{user.name}'s Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <h3 style={{ marginTop: '30px' }}>{user.name}'s Posts</h3>
      {posts.length === 0 ? <p>No posts yet.</p> : posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default OtherUserProfile;
