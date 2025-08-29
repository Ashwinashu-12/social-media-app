import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';

const MyPosts = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState('');

  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/posts/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/user/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data._id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyPosts();
    fetchCurrentUser();
  }, []);

  return (
    <div className="my-posts-page">
      <h2>My Posts</h2>
      {myPosts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          fetchPosts={fetchMyPosts}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default MyPosts;
