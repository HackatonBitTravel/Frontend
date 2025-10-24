import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ClientAuthGuardProps {
  children?: React.ReactNode;
}

const ClientAuthGuard: React.FC<ClientAuthGuardProps> = ({ children }) => {
  const { isLoggedIn, user } = useAuth();

  // A more robust solution would involve a 'role' property in the user object from the backend.
  // For now, we assume if a user is logged in and has role 'client', they are a client.
  const isClient = isLoggedIn && user && user.role === 'client';

  if (!isClient) {
    // If not a client, redirect to signin. If an agency, they should not be here.
    return <Navigate to="/signin" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ClientAuthGuard;