import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {
  getAuthSession,
  getSessionRole,
  isSessionValid,
  resolveHomeByRole,
} from '../services/authSession';

export default function RoleProtectedRoute({ allowedRoles = [] }) {
  const session = getAuthSession();

  if (!isSessionValid(session)) {
    return <Navigate to="/login" replace />;
  }

  const role = getSessionRole(session);
  if (!role || (allowedRoles.length > 0 && !allowedRoles.includes(role))) {
    return <Navigate to={resolveHomeByRole(role)} replace />;
  }

  return <Outlet />;
}
