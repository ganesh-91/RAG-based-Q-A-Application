import React, { useContext } from "react";

import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/auth";

export const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  const isAuthenticated = user;
  const isAuthorized = user?.role?.toUpperCase() === role?.toUpperCase(); // Replace with your auth logic

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated && isAuthorized) {
    return children;
  }

  if (isAuthenticated && !isAuthorized) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/" replace />;
};
