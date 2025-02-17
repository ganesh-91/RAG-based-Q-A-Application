import React from "react";

import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true; // Replace with your auth logic

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
