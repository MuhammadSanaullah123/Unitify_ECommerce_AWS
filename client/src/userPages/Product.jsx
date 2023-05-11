import React, { useState, useEffect } from "react";
import { CloudinaryImage } from "@cloudinary/url-gen";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
//assets
import headphone from "./../assets/headphone.jpg";

//components

import ProductCard from "../components/ProductCard/ProductCard";

//others
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { v4 as uuid } from "uuid";
import Cookies from "universal-cookie";
//mui
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CircularProgress from "@mui/material/CircularProgress";

//redux,api
import { getProductById } from "../actions/product";
import { getProducts } from "../actions/product";
import { setAlert } from "../actions/alert";
import { addItem } from "../actions/cart";

const responsive2 = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1130, min: 700 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 760, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

const ButtonGroup = ({ next, previous, goToSlide, ...rest }) => {
  /*  const {
      carouselState: { currentSlide },
    } = rest; */
  return (
    <div className="carousel-button-group">
      <ChevronLeftIcon
        className="left_arr"
        style={{ alignSelf: "center", cursor: "pointer" }}
        sx={{ color: "#ff5e00", fontSize: 60 }}
        onClick={() => previous()}
      />
      <ChevronRightIcon
        className="right_arr"
        style={{ alignSelf: "center", cursor: "pointer" }}
        sx={{ color: "#ff5e00", fontSize: 60 }}
        onClick={() => next()}
      />
    </div>
  );
};

const Product = () => {
  /*   let primarycolor = useState(
    getComputedStyle(document.documentElement).getPropertyValue(`--primary`) //getting value of primary var from css
  ); */
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product);
  const productname = useSelector((state) =>
    !product.currentloading ? state.product.currentProduct.productname : ""
  );
  const productprice = useSelector((state) =>
    !product.currentloading ? state.product.currentProduct.productprice : ""
  );
  /*  const productquantity = useSelector((state) =>
    !product.currentloading ? state.product.currentProduct.productquantity : ""
  ); */
  const productimg = useSelector((state) =>
    !product.currentloading ? state.product.currentProduct.productimg : ""
  );

  const auth = useSelector((state) => state.auth);
  const { product_id } = useParams();
  const [productquantity, setQuantity] = useState(1);

  const handleQuantity = (text) => {
    if (text === "add") {
      setQuantity(productquantity + 1);
    } else {
      if (productquantity - 1 !== 0) {
        setQuantity(productquantity - 1);
      }
    }
  };

  const Add = () => {
    if (!auth.isAuthenticated) {
      dispatch(
        setAlert(
          "You must login to purchase items. Redirecting...",
          "danger",
          5000
        )
      );

      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      /*  setCart([
        ...cart,
        {
          itemname: name,
          itemid: id,
          itemprice: price,
          itemquantity: quantity,
        },
      ]);
      window.location.reload(false); */

      dispatch(
        addItem({
          product_id,
          productname,
          productprice,
          productquantity,
          productimg,
        })
      );
    }
  };

  useEffect(() => {
    dispatch(getProductById(product_id));
    dispatch(getProducts());
    /*     const params = new URLSearchParams(location.search);
    const myParam = params.get("product/:product_id");

    if (myParam) {
      window.location.reload();
    } */
  }, [getProductById, getProducts, location]);

  return (
    <>
      {!product.currentloading ? (
        <>
          <div className="product">
            <div className="productd1">
              <h6 className="productcardh1">
                {product.currentProduct.productname}
              </h6>
              <div className="productd1span1">
                <p className="productcardp1">
                  Price: ${product.currentProduct.productprice}
                </p>
              </div>
              <div style={{ marginTop: "20px" }} className="line"></div>
              <div className="productcarddespdiv">
                <h6 className="productcarddesph1">Description</h6>
                <p className="productcarddespp">
                  {product.currentProduct.productdesc}
                </p>
              </div>
              <div style={{ marginTop: "20px" }} className="line"></div>

              <div className="productd2">
                <div className="productd2quandiv">
                  <p className="productd2quanp">Quantity: </p>
                  <AddIcon
                    sx={{
                      cursor: "pointer",
                      border: "1px solid",
                      borderRadius: "8px",
                    }}
                    onClick={() => handleQuantity("add")}
                  />
                  <p className="productd2quannumber"> {productquantity} </p>

                  <RemoveIcon
                    sx={{
                      cursor: "pointer",
                      border: "1px solid",
                      borderRadius: "8px",
                    }}
                    onClick={() => handleQuantity("remove")}
                  />
                </div>
                <button
                  disabled={
                    product.currentProduct.productquantity <= 0 ? true : false
                  }
                  onClick={Add}
                  className={`${
                    product.currentProduct.productquantity <= 0
                      ? "productd2btndisabled"
                      : "productd2btn"
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
            <div
              style={{
                backgroundImage:
                  "url(" + product.currentProduct.productimg + ")",
              }}
              className="productpicdiv"
            >
              <div className="productcardd2"></div>
            </div>
          </div>
          <div className="productcarousel">
            <h6 className="productcarouselh1">Related Products</h6>
            <Carousel
              arrows={false}
              renderButtonGroupOutside={true}
              customButtonGroup={<ButtonGroup />}
              responsive={responsive2}
              infinite={true}
              swipeable={true}
              containerClass="home-carousel h-full"
            >
              {!product.loading && product.products !== null ? (
                product.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <CircularProgress className="spinner" />
              )}
            </Carousel>
          </div>
        </>
      ) : (
        <CircularProgress className="spinner" />
      )}
    </>
  );
};

export default Product;
