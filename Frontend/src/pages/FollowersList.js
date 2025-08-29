// src/pages/FollowersList.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FollowersList = () => {
  const { id: userId } = useParams();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/followers/${userId}`);
        const data = await res.json();
        setFollowers(data);
      } catch (err) {
        console.error('Error fetching followers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Followers</h2>
      {loading ? (
        <p>Loading followers...</p>
      ) : followers.length > 0 ? (
        <ul>
          {followers.map((follower) => (
            <li key={follower._id} style={{ marginBottom: '10px' }}>
              <img
                src={follower.profilePicture || '/default-avatar.png'}
                alt={follower.name}
                style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
              />
              <span>{follower.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No followers yet.</p>
      )}
    </div>
  );
};

export default FollowersList;
