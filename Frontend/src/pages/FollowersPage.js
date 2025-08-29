import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FollowersPage = () => {
  const { userId } = useParams();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/followers/${userId}`);
        setFollowers(res.data);
      } catch (err) {
        console.error('Error fetching followers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [userId]);

  return (
    <div className="container">
      <h2>Followers</h2>
      {loading ? (
        <p>Loading...</p>
      ) : followers.length > 0 ? (
        <ul>
          {followers.map((follower) => (
            <li key={follower._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <img
                src={follower.profilePicture || '/default-avatar.png'}
                alt="profile"
                width="40"
                height="40"
                style={{ borderRadius: '50%', marginRight: '10px' }}
              />
              <div>
                <strong>{follower.name}</strong><br />
                <span style={{ fontSize: '0.9em', color: '#888' }}>{follower.email}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No followers yet.</p>
      )}
    </div>
  );
};

export default FollowersPage;
