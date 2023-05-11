import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

//assets

//redux,api

import { getCurrentProfile } from "../actions/profile";
import { deleteCart } from "../actions/cart";

const Items = ({ product }) => {
  return (
    <>
      <div className="Items">
        <img src={product.productimg} alt="Product" className="itemsimg" />
        <div className="itemsd1">
          <h1 className="itemsh1">{product.productname}</h1>
          <p className="itemsp1">$ {product.productprice}</p>
        </div>
        <div className="itemsd2">
          <p className="itemsp2">Quantity</p>
          <p className="itemsp3">{product.productquantity}</p>
        </div>
      </div>
    </>
  );
};

const Thankyou = () => {
  const dispatch = useDispatch();

  const profile = useSelector((state) => state.profile);
  const [totalprice, setTotalPrice] = useState();
  useEffect(() => {
    dispatch(getCurrentProfile());
    dispatch(deleteCart());
  }, []);
  useEffect(() => {
    let price = 0;

    if (!profile.loading && profile.profile) {
      profile.profile.history[0].items.forEach((element) => {
        price = price + element.productprice * element.productquantity;
      });
    }

    setTotalPrice(price);
  }, [profile.loading]);

  return (
    <>
      <div className="thankyou">
        <h1 className="thankyouh1">
          Thankyou,{" "}
          {!profile.loading && profile.profile
            ? profile.profile.name
            : "Customer"}
        </h1>
        <div className="thankyoul1"></div>
        <h1 className="thankyouh2">Order Placed</h1>
        <p className="thankyoup1">
          We Have Accepted Your Order And We Are Preparing It.
          <br /> A Confirmation Email Has Been Sent To{" "}
          {!profile.loading && profile.profile
            ? profile.profile.history[0].email
            : ""}
          <br />
          Please Return To This Page For Updates On The Status Of Your Order.
        </p>
        <div className="thankyoul1"></div>
        <h1 className="thankyouh3">
          Order ID :{" "}
          {!profile.loading && profile.profile
            ? profile.profile.history[0]._id
            : ""}
        </h1>
        <div className="thankyoud1">
          {!profile.loading && profile.profile
            ? profile.profile.history[0].items.map((product) => (
                <Items key={product._id} product={product} />
              ))
            : ""}
          <div className="thankyoud2">
            <p className="thankyoup2">Total </p>
            <p className="thankyoup3">{totalprice}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Thankyou;
