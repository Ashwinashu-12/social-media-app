import React, { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function FollowRequests() {
  const [requests, setRequests] = useState([]);

  const load = async () => {
    const { data } = await API.get("/users/follow/requests/me");
    setRequests(data);
  };

  const accept = async (id) => {
    await API.put(`/users/follow/accept/${id}`);
    load();
  };
  const reject = async (id) => {
    await API.put(`/users/follow/reject/${id}`);
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="container">
      <h2>Follow Requests</h2>
      {requests.length === 0 && <p>No pending requests</p>}
      {requests.map(r => (
        <div key={r._id} className="request-card">
          <Link to={`/profile/${r._id}`}>{r.name}</Link>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => accept(r._id)}>Accept</button>
            <button onClick={() => reject(r._id)}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}
