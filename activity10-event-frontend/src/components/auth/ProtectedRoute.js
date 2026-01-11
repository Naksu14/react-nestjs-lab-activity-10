import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to their respective dashboard if they don't have access
    if (userRole === "admin") {
       return <Navigate to="/admin/events-management" replace />;
    } else if (userRole === "organizer") {
      return <Navigate to="/organizer" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
