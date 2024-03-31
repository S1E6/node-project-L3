// ProtectedRoute.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProtectedRoute({ element, ...rest }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
}

export default ProtectedRoute;
