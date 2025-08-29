import React, { useState } from 'react';
import axios from 'axios';

const ProfileEdit = () => {
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');

  const handleFileChange = (e) => {
    const image = e.target.files[0];
    setFile(image);
    if (image) setPreview(URL.createObjectURL(image));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('profilePic', file);

    try {
      const res = await axios.put('/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization: `Bearer ${token}` ← If you're using token auth
        },
      });

      alert('Profile updated!');
      console.log(res.data);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Error updating profile');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit Profile</h2>

      <textarea
        placeholder="Enter your bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        rows={4}
        style={{ width: '300px' }}
      />

      <br />

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div>
          <h4>Preview:</h4>
          <img src={preview} alt="Preview" width={100} />
        </div>
      )}

      <br />
      <button onClick={handleSubmit}>Update Profile</button>
    </div>
  );
};

export default ProfileEdit;
