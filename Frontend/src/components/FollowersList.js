import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FollowersList = () => {
  const { id } = useParams();
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/user/${id}/followers`)
      .then(res => res.json())
      .then(data => setFollowers(data))
      .catch(err => console.error(err));
  }, [id]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Followers</h2>
      <ul>
        {followers.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default FollowersList;
