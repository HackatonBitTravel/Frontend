import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AgencyAuthRedirectProps {
  children?: React.ReactNode;
}

const AgencyAuthRedirect: React.FC<AgencyAuthRedirectProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/agency/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AgencyAuthRedirect;