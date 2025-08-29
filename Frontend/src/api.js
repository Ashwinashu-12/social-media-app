import axios from "axios";
const BASE = "http://localhost:5000/api";

const authHeader = (t) => ({ Authorization: `Bearer ${t}` });

// Auth
const register = (payload) => axios.post(`${BASE}/auth/register`, payload).then(r => r.data);
const login = (payload) => axios.post(`${BASE}/auth/login`, payload).then(r => r.data);

// User
const getCurrentUser = (t) => axios.get(`${BASE}/user/me`, { headers: authHeader(t) }).then(r => r.data);
const searchUsers = (q, t) =>
  axios.get(`${BASE}/user/search?query=${encodeURIComponent(q)}`, { headers: authHeader(t) }).then(r => r.data);

// Posts
const getPosts = (t) => axios.get(`${BASE}/posts`, { headers: authHeader(t) }).then(r => r.data);
const createPost = (data, t) => axios.post(`${BASE}/posts`, data, { headers: authHeader(t) }).then(r => r.data);
const likePost = (id, t) => axios.post(`${BASE}/posts/${id}/like`, {}, { headers: authHeader(t) }).then(r => r.data);
const commentPost = (id, text, t) =>
  axios.post(`${BASE}/posts/${id}/comment`, { text }, { headers: authHeader(t) }).then(r => r.data);
const deletePost = (id, t) => axios.delete(`${BASE}/posts/${id}`, { headers: authHeader(t) }).then(r => r.data);
const getMyPosts = (t) => axios.get(`${BASE}/user/me/posts`, { headers: authHeader(t) }).then(r => r.data);

const API = { register, login, getCurrentUser, searchUsers, getPosts, createPost, likePost, commentPost, deletePost, getMyPosts };
export default API;
