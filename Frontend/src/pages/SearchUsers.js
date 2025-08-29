import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './SearchUsers.css';

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const res = await axios.get(`http://localhost:5000/api/user/search?query=${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  return (
    <div className="search-users-container">
      <h2>Search Users</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="search-results">
        {results.length === 0 ? (
          <p>No results</p>
        ) : (
          results.map((user) => (
            <div key={user._id} className="user-card">
              <Link to={`/user/${user._id}`}>
                <strong>{user.name}</strong> - {user.email}
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchUsers;
