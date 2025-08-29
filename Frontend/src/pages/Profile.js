// frontend/src/pages/Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('token');
        const resUser = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(resUser.data);

        const resPosts = await axios.get(`http://localhost:5000/api/posts/user/${resUser.data._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(resPosts.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfileData();
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        {user.profilePicture && (
          <img
            src={`http://localhost:5000/${user.profilePicture}`}
            alt="Profile"
            className="profile-picture"
          />
        )}
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>

      <div className="profile-posts">
        <h3>My Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              {post.image && (
                <img
                  src={`http://localhost:5000/${post.image}`}
                  alt={post.title}
                  className="post-image"
                />
              )}
              <h4>{post.title}</h4>
              <p>{post.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
