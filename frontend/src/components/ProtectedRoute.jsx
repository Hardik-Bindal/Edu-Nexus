import React from "react";
import { Navigate } from "react-router-dom";
import { getUser, isLoggedIn } from "../services/session";

const ProtectedRoute = ({ children, role }) => {
  const user = getUser();
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
