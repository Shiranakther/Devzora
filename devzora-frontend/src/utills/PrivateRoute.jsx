// utils/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem('token'); // simple mock check

  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
