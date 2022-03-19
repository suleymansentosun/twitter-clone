import React from 'react';
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

function RequireAuth({ children }) {
    const { currentUser } = useAuth();
  
    if (!currentUser) {
      return <Navigate to="/" />;
    }
  
    return children;
}

export default RequireAuth
