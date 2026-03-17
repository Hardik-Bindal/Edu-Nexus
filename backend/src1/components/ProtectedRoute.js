// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

// 🔒 Wrapper for private routes
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("pp_token"); // stored JWT
  const user = localStorage.getItem("pp_user") ? JSON.parse(localStorage.getItem("pp_user")) : null;

  // If not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If role doesn't match
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Authorized → render children
  return children;
};

export default ProtectedRoute;
