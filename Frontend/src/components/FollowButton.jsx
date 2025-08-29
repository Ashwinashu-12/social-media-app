import React, { useState, useEffect } from "react";
import API from "../api";

export default function FollowButton({ targetId, initialStatus }) {
  // initialStatus can be "following" | "requested" | "none" (optional)
  const [status, setStatus] = useState(initialStatus || "none");
  const [loading, setLoading] = useState(false);

  const follow = async () => {
    try {
      setLoading(true);
      const { data } = await API.post(`/users/follow/${targetId}`);
      setStatus(data.status); // "requested" or "following"
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  const unfollow = async () => {
    try {
      setLoading(true);
      await API.put(`/users/unfollow/${targetId}`);
      setStatus("none");
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === "following") {
    return <button disabled={loading} onClick={unfollow}>Following ✓ (Unfollow)</button>;
  }
  if (status === "requested") {
    return <button disabled>Requested ⏳</button>;
  }
  return <button disabled={loading} onClick={follow}>Follow</button>;
}
