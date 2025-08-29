// frontend/src/pages/OtherProfile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';

const OtherProfile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const resUser = await axios.get(`http://localhost:5000/api/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(resUser.data);

        const resPosts = await axios.get(`http://localhost:5000/api/posts/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(resPosts.data);
      } catch (err) {
        console.error('Error fetching user profile');
      }
    };

    fetchProfileData();
  }, [id]);

  if (!profile) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="profile-card">
        <h2>{profile.name}'s Profile</h2>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Followers:</strong> {profile.followers.length}</p>
        <p><strong>Following:</strong> {profile.following.length}</p>
      </div>

      <h3 style={{ marginTop: '30px' }}>Posts by {profile.name}</h3>
      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map(post => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
};

export default OtherProfile;
