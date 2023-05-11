import React from "react";

import Moment from "react-moment";
//assets
import headphone from "../../assets/headphone.jpg";

const History = ({ items }) => {
  /*  history from profile
  const history = history.map((hist) => (
    <div>
      <Moment format="DD/MM/YYYY">{hist.date}</Moment>
    </div>
  )); */

  return (
    <>
      <div className="History">
        <div className="historyd1">
          <p className="historyp1">
            <b>Name:</b> {items.name}
          </p>
          <p className="historyp1" style={{ marginLeft: "20px" }}>
            <b>Email:</b> {items.email}
          </p>
        </div>
        <p style={{ marginLeft: "10px" }} className="historyp1">
          <b>Address:</b> {items.address}
        </p>
        <p style={{ margin: "10px 0 0 10px" }} className="historyp1">
          <b>Date:</b> <Moment format="DD/MM/YYYY">{items.date}</Moment>
        </p>
        {items.items.map((item, index) => (
          <div index={index} className="historyd2">
            <img className="historyd2img" src={item.productimg} alt="" />
            <div className="historyd2d1">
              <h6 className="historyd2d1h1">{item.productname}</h6>
              <p className="historyd2d1p1">
                <b>Price:</b> {item.productprice}
              </p>
              <p className="historyd2d1p1">
                <b>Quantity:</b> {item.productquantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default History;
