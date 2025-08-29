// frontend/src/utils/auth.js

// Save token to localStorage
export const saveToken = (token) => {
    localStorage.setItem("token", token);
  };
  
  // Get token from localStorage
  export const getToken = () => {
    return localStorage.getItem("token");
  };
  
  // Remove token from localStorage (Logout)
  export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login page
  };
  
  // Check if user is authenticated
  export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };
  
  