// src/pages/ProfileEdit.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileEdit.css'; // Optional styling
import { useNavigate } from 'react-router-dom';

const ProfileEdit = () => {
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/user/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBio(res.data.bio || '');
        setPreview(res.data.profilePic || null);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('bio', bio);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      const res = await axios.put('/api/user/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      console.log('✅ Profile updated:', res.data);
      navigate('/profile');
    } catch (err) {
      console.error('❌ Failed to update profile:', err.response?.data || err.message);
    }
  };

  return (
    <div className="profile-edit-container">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} className="profile-edit-form">
        <div>
          <label>Bio:</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div>
          <label>Profile Picture:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setProfilePic(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </div>
        {preview && <img src={preview} alt="Preview" className="preview-image" />}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default ProfileEdit;
