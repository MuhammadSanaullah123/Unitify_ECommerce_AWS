import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//assets
import headphone from "../../assets/headphone.jpg";
const ProductCard = ({ product }) => {
  const [path] = useState(window.location.pathname);

  return (
    <>
      <Link
        to={`/product/${product._id}`}
        style={{ textDecoration: "none" }}
        className="productcardlink"
      >
        <div
          style={{
            backgroundImage: "url(" + product.productimg + ")",
          }}
          className={path === "/home" ? "productcardd1" : "productcardlistd1"}
        ></div>
        <div className="productcardd2">
          <h6 className="productcardh1">{product.productname}</h6>
          <p className="productcardp1">Price: ${product.productprice}</p>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;
