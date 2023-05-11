import React from "react";

import { useSelector } from "react-redux";

const Alert = () => {
  let m = 50;
  const alerts = useSelector((state) => state.alert);
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert, index) => (
      <div
        key={alert.id}
        className={`alert alert-${alert.alertType}`}
        style={{ marginTop: `${index * m + "px"}` }}
      >
        {alert.msg}
      </div>
    ))
  );
};

export default Alert;
