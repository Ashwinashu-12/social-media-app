import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FollowingList = () => {
  const { id } = useParams();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/user/${id}/following`)
      .then(res => res.json())
      .then(data => setFollowing(data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Following</h2>
      <ul>
        {following.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default FollowingList;
