import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const isLoading = useSelector((state) => state.auth.loading);

  if (!isAuthenticated && !isLoading) {
    return <Navigate to="/login" />;
  } else {
    return <Component />;
  }
};

export default PrivateRoute;
