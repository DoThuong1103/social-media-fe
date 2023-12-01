// PrivateRoute.js
import React, { Children } from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ isLoggedIn, children }) => {
  return (
    isLoggedIn ? <Navigate to="/login" /> : children
  );
};

export default PrivateRoute;
