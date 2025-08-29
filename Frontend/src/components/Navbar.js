import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");
  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <nav style={navStyle}>
      <div style={{ fontWeight: 700 }}>AshuApp</div>
      <div style={{ display: "flex", gap: 12 }}>
        {token ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/create">Create</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={logout} style={btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const navStyle = { display: "flex", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid #eee" };
const btn = { border: "1px solid #ddd", background: "#fff", padding: "6px 10px", cursor: "pointer" };

export default Navbar;
