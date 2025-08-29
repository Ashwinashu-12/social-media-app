// src/pages/EditProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css'; // Optional: for styling
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // 🔁 Load current bio on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBio(res.data.bio || '');
        if (res.data.profilePic) {
          setPreview(`http://localhost:5000${res.data.profilePic}`);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('bio', bio);
    if (profilePic) {
      formData.append('profilePic', profilePic);
    }

    try {
      const res = await axios.put('/api/user/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Profile updated:', res.data);
      navigate('/profile');
    } catch (err) {
      console.error('❌ Update failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Bio:</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="4"
            placeholder="Write something about yourself..."
          />
        </div>

        <div>
          <label>Profile Picture:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" width="100" />}
        </div>

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;
