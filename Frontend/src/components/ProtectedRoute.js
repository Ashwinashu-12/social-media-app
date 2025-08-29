import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If no token exists, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  // Otherwise, render the children (protected component)
  return children;
};

export default ProtectedRoute;
