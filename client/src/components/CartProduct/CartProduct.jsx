import React, { useState } from "react";
import { useDispatch } from "react-redux";
//assets
import headphone from "../../assets/headphone.jpg";
//mui
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
//redux,api
import { deleteItem } from "../../actions/cart";

const CartProduct = ({ item }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.itemquantity);

  /*   let primarycolor = useState(
    getComputedStyle(document.documentElement).getPropertyValue(`--primary`) //getting value of primary var from css
  ); */
  const handleQuantity = (text) => {
    if (text === "add") {
      setQuantity(quantity + 1);
    } else {
      if (quantity - 1 !== 0) {
        setQuantity(quantity - 1);
      }
    }
  };
  return (
    <div className="cartproduct">
      <img src={item.productimg} alt="Product" className="cartproductimg" />
      <div className="cartproductd1">
        <h1 className="cartproducth1">{item.productname.slice(0, 8)}...</h1>
        <p className="cartproductp1">$ {item.productprice}</p>
      </div>
      <div className="cartproductd2">
        <AddIcon
          className="cartproductd2icon"
          sx={{
            cursor: "pointer",
            fontSize: "2rem",
          }}
          onClick={() => handleQuantity("add")}
        />
        <p className="cartproductd2quannumber"> {item.productquantity} </p>

        <RemoveIcon
          className="cartproductd2icon"
          onClick={() => handleQuantity("remove")}
        />
        <CancelOutlinedIcon
          onClick={() => dispatch(deleteItem(item._id))}
          className="cartproductd2deleteicon"
        />
      </div>
    </div>
  );
};

export default CartProduct;
