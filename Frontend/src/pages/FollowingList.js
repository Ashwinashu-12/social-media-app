// src/pages/FollowingList.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './FollowersFollowing.css';

const FollowingList = () => {
  const { id } = useParams();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await fetch(`/api/users/${id}/following`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        setFollowing(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFollowing();
  }, [id]);

  return (
    <div className="followers-following-page">
      <h2>Following</h2>
      <div className="user-list">
        {following.map((user) => (
          <Link to={`/user/${user._id}`} key={user._id} className="user-card">
            <div className="user-avatar">{user.name[0]}</div>
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FollowingList;
