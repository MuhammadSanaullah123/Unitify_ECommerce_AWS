import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const auth = useSelector((state) => state.auth);
  const admin = useSelector((state) => state.admin);
  if (admin.admin) {
    for (let i = 0; i < admin.admin.length; i++) {
      if (
        isAuthenticated &&
        auth.user.email !== admin.admin[i].email &&
        auth.user.registeration !== admin.admin[i].registeration
      ) {
        console.log("back");

        navigate(-1);
      } else {
        console.log("admin");

        return <Component />;
      }
    }
  }
};

export default PrivateRoute;
