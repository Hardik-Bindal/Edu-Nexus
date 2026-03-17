// src/services/authService.js
const API_URL = "http://localhost:8080/api/auth"; // backend base URL

// Save user/token in localStorage
const saveAuth = (data) => {
  localStorage.setItem("pp_token", data.token);
  localStorage.setItem("pp_user", JSON.stringify(data.user));
};

// Remove user/token
export const logout = () => {
  localStorage.removeItem("pp_token");
  localStorage.removeItem("pp_user");
};

// ✅ Register
export const register = async (payload) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
  return data;
};

// ✅ Login
export const login = async (payload) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  saveAuth(data);
  return data;
};

// ✅ Get profile
export const getProfile = async () => {
  const token = localStorage.getItem("pp_token");
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load profile");

  return data;
};
