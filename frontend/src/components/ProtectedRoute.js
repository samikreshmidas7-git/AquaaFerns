import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import AccessDeniedDialog from './AccessDeniedDialog';
import LoginDialog from './LoginDialog';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  if (!user) {
    // If not logged in, redirect to home and show login dialog
    return (
      <>
        <LoginDialog 
          open={true} 
          onClose={() => {
            setShowLogin(false);
            if (location.pathname !== '/') {
              navigate('/');
            }
          }}
        />
        <Navigate to="/" replace />
      </>
    );
  }

  // If user exists but is not staff, only allow access to public routes
  if (user.role !== 'staff') {
    const publicRoutes = ['/', '/products'];
    if (!publicRoutes.includes(location.pathname)) {
      return (
        <>
          <AccessDeniedDialog
            open={true}
            onClose={() => {
              setShowAccessDenied(false);
              navigate('/');
            }}
          />
          <Navigate to="/" replace />
        </>
      );
    }
  }

  // Check for staff restrictions
  if (user.role === 'staff' && user.restrictions) {
    const path = location.pathname.substring(1); // Remove leading slash
    if (user.restrictions.includes(path)) {
      return (
        <>
          <AccessDeniedDialog
            open={true}
            onClose={() => {
              setShowAccessDenied(false);
              navigate('/');
            }}
          />
          <Navigate to="/" replace />
        </>
      );
    }
  }

  return children;
};

export default ProtectedRoute;
