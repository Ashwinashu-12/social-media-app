// frontend/src/pages/UserProfile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { format } from 'timeago.js';
import './UserProfile.css'; // Optional for custom styling

const UserProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const token = localStorage.getItem('token');

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data.user);
      setIsFollowing(res.data.isFollowing);
      setPosts(res.data.posts);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/follow/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFollowing(true);
      fetchUserProfile(); // Refresh data
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/user/unfollow/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFollowing(false);
      fetchUserProfile(); // Refresh data
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  return (
    <div className="user-profile-container">
      {userData ? (
        <>
          <div className="user-profile-header">
            <h2>{userData.name}'s Profile</h2>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Bio:</strong> {userData.bio || 'No bio provided'}</p>
            <p><strong>Followers:</strong> {userData.followers.length}</p>
            <p><strong>Following:</strong> {userData.following.length}</p>

            {isFollowing ? (
              <button className="unfollow-btn" onClick={handleUnfollow}>Unfollow</button>
            ) : (
              <button className="follow-btn" onClick={handleFollow}>Follow</button>
            )}
          </div>

          <h3>Posts by {userData.name}</h3>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                {post.image && (
                  <img
                    src={`http://localhost:5000${post.image}`}
                    alt="Post"
                    className="post-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/600x300?text=Image+Not+Found';
                    }}
                  />
                )}
                <h4>{post.title}</h4>
                <p>{post.content}</p>
                <small className="post-time">{format(post.createdAt)}</small>
              </div>
            ))
          ) : (
            <p>No posts yet.</p>
          )}
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
