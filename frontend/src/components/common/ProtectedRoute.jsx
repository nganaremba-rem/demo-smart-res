import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { addToast } = useToast();

  if (!user) {
    addToast('Please login to access this page', 'warning');
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    addToast('You do not have permission to access this page', 'error');
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectedRoute;
