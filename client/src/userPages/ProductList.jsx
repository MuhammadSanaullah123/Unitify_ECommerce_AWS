import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
//components

import ProductCard from "../components/ProductCard/ProductCard";
//mui
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
//redux,api
import { getProducts } from "../actions/product";

const ProductList = () => {
  const dispatch = useDispatch();
  const { type } = useParams();

  const products = useSelector((state) => state.product);
  const [state, setState] = useState(false);
  const [price, setPrice] = useState(0);
  const [selected, setSelected] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    Electronics: false,
    Fashion: false,
    CarAccessories: false,
    Toys: false,
    Furniture: false,
    CD: false,
  });

  //Pagination---->
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState();
  const ITEMS_PER_PAGE = 9;
  const calculatePageCount = () => {
    let isCheck = false;
    let productCount = 0;
    for (let key in checkboxes) {
      if (checkboxes[key]) {
        isCheck = true;
        products.products.forEach((item) => {
          if (item.producttype === key) {
            productCount = productCount + 1;
            console.log("KEY is", key);
          }
        });
      }
    }
    console.log("isCheck is:", isCheck);

    setPageCount(
      Math.ceil(
        isCheck
          ? productCount / ITEMS_PER_PAGE
          : products.products.length / ITEMS_PER_PAGE
      )
    );
  };
  console.log("pagecount is", pageCount);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const handlePreviousPageClick = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPageClick = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    if (!products.loading) {
      calculatePageCount();
    }
  }, [products.products, checkboxes]);

  //<-------Pagination
  const toggleDrawer = (open) => (event) => {
    setState(open);
  };

  const handleChange = (event) => {
    setPrice(event.target.value);
  };

  const handleCheckbox = (e) => {
    const Value = e.target.checked;
    if (Value === true) {
      setSelected(true);
    } else {
      setSelected(false);
    }
    setCheckboxes({
      [e.target.name]: Value,
    });
    window.history.pushState(null, null, `/productlist/${e.target.name}`);
  };
  useEffect(() => {
    dispatch(getProducts());
  }, []);
  useEffect(() => {
    Object.keys(checkboxes).forEach((key) => {
      if (type.includes(key)) {
        setCheckboxes((prevState) => ({
          ...prevState,
          [key]: true,
        }));
        setSelected(true);
      }
    });
  }, [type]);
  useEffect(() => {
    setCurrentPage(1);
  }, [price]);
  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="productlistd2">
        <h6 className="productlistd2h1">Filters</h6>
        <div className="line"></div>

        <div className="productlistcheckboxdiv">
          <Checkbox
            name="Electronics"
            className="form-check-input"
            checked={checkboxes.Electronics}
            onChange={handleCheckbox}
          />
          <p className="productlistcheckboxp">Electronics</p>
        </div>
        <div className="productlistcheckboxdiv">
          <Checkbox
            name="Fashion"
            className="form-check-input"
            checked={checkboxes.Fashion}
            onChange={handleCheckbox}
          />
          <p className="productlistcheckboxp">Men Fashion</p>
        </div>
        <div className="productlistcheckboxdiv">
          <Checkbox
            name="CD"
            className="form-check-input"
            checked={checkboxes.CD}
            onChange={handleCheckbox}
          />
          <p className="productlistcheckboxp">CD</p>
        </div>
        <div className="productlistcheckboxdiv">
          <Checkbox
            name="Toys"
            className="form-check-input"
            checked={checkboxes.Toys}
            onChange={handleCheckbox}
          />
          <p className="productlistcheckboxp">Toys</p>
        </div>
        <div className="productlistcheckboxdiv">
          <Checkbox
            name="Furniture"
            className="form-check-input"
            checked={checkboxes.Furniture}
            onChange={handleCheckbox}
          />
          <p className="productlistcheckboxp">Furniture</p>
        </div>
        <div className="productlistcheckboxdiv">
          <Checkbox
            name="CarAccessories"
            className="form-check-input"
            checked={checkboxes.CarAccessories}
            onChange={handleCheckbox}
          />
          <p className="productlistcheckboxp">Car Accessories</p>
        </div>
      </div>
    </Box>
  );
  return (
    <>
      <div className="productlist">
        <div className="productlistd1">
          <FormControl className="productlistd1form">
            <Select
              value={price}
              onChange={handleChange}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
              className="productlistmenuitem"
            >
              <MenuItem value={0}>
                <p style={{ margin: "0" }}>None</p>
              </MenuItem>
              <MenuItem value={1}>Low - High</MenuItem>
              <MenuItem value={2}>High - Low</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="productlistd2">
          <h6 className="productlistd2h1">Filters</h6>
          <div className="line"></div>

          <div className="productlistcheckboxdiv">
            <Checkbox
              name="Electronics"
              className="form-check-input"
              checked={checkboxes.Electronics}
              onChange={handleCheckbox}
            />
            <p className="productlistcheckboxp">Electronics</p>
          </div>
          <div className="productlistcheckboxdiv">
            <Checkbox
              name="Fashion"
              className="form-check-input"
              checked={checkboxes.Fashion}
              onChange={handleCheckbox}
            />
            <p className="productlistcheckboxp">Men Fashion</p>
          </div>
          <div className="productlistcheckboxdiv">
            <Checkbox
              name="CD"
              className="form-check-input"
              checked={checkboxes.CD}
              onChange={handleCheckbox}
            />
            <p className="productlistcheckboxp">CD</p>
          </div>
          <div className="productlistcheckboxdiv">
            <Checkbox
              name="Toys"
              className="form-check-input"
              checked={checkboxes.Toys}
              onChange={handleCheckbox}
            />
            <p className="productlistcheckboxp">Toys</p>
          </div>
          <div className="productlistcheckboxdiv">
            <Checkbox
              name="Furniture"
              className="form-check-input"
              checked={checkboxes.Furniture}
              onChange={handleCheckbox}
            />
            <p className="productlistcheckboxp">Furniture</p>
          </div>
          <div className="productlistcheckboxdiv">
            <Checkbox
              name="CarAccessories"
              className="form-check-input"
              checked={checkboxes.CarAccessories}
              onChange={handleCheckbox}
            />
            <p className="productlistcheckboxp">Car Accessories</p>
          </div>
        </div>
        <div className="productlistd2mobile">
          <Button
            className="productlistd2mobilebtn"
            onClick={toggleDrawer(true)}
          >
            <ChevronRightIcon className="menupic" />
            <p className="productlistd2mobilep">Filter</p>
          </Button>
          <Drawer anchor={"left"} open={state} onClose={toggleDrawer(false)}>
            {list()}
          </Drawer>
        </div>

        <div className="productlistd3">
          {/*    {!selected
            ? !products.loading
              ? products.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              : ""
            : ""} */}
          {!selected
            ? !products.loading
              ? price === 1
                ? products.products
                    .sort((a, b) => a.productprice - b.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 2
                ? products.products
                    .sort((a, b) => b.productprice - a.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 0
                ? products.products
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : ""
              : ""
            : ""}

          {checkboxes.Electronics
            ? !products.loading
              ? price === 1
                ? products.products
                    .filter((product) => product.producttype === "Electronics")
                    .sort((a, b) => a.productprice - b.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 2
                ? products.products
                    .filter((product) => product.producttype === "Electronics")
                    .sort((a, b) => b.productprice - a.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 0
                ? products.products
                    .filter((product) => product.producttype === "Electronics")

                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : ""
              : ""
            : ""}
          {checkboxes.Furniture
            ? !products.loading
              ? price === 1
                ? products.products
                    .filter((product) => product.producttype === "Furniture")
                    .sort((a, b) => a.productprice - b.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 2
                ? products.products
                    .filter((product) => product.producttype === "Furniture")
                    .sort((a, b) => b.productprice - a.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 0
                ? products.products
                    .filter((product) => product.producttype === "Furniture")
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : ""
              : ""
            : ""}
          {checkboxes.Toys
            ? !products.loading
              ? price === 1
                ? products.products
                    .filter((product) => product.producttype === "Toys")
                    .sort((a, b) => a.productprice - b.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 2
                ? products.products
                    .filter((product) => product.producttype === "Toys")
                    .sort((a, b) => b.productprice - a.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 0
                ? products.products
                    .filter((product) => product.producttype === "Toys")
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : ""
              : ""
            : ""}
          {checkboxes.CD
            ? !products.loading
              ? price === 1
                ? products.products
                    .filter((product) => product.producttype === "CD")
                    .sort((a, b) => a.productprice - b.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 2
                ? products.products
                    .filter((product) => product.producttype === "CD")
                    .sort((a, b) => b.productprice - a.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 0
                ? products.products
                    .filter((product) => product.producttype === "CD")
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : ""
              : ""
            : ""}
          {checkboxes.CarAccessories
            ? !products.loading
              ? price === 1
                ? products.products
                    .filter(
                      (product) => product.producttype === "CarAccessories"
                    )
                    .sort((a, b) => a.productprice - b.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 2
                ? products.products
                    .filter(
                      (product) => product.producttype === "CarAccessories"
                    )
                    .sort((a, b) => b.productprice - a.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 0
                ? products.products
                    .filter(
                      (product) => product.producttype === "CarAccessories"
                    )
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : ""
              : ""
            : ""}
          {checkboxes.Fashion
            ? !products.loading
              ? price === 1
                ? products.products
                    .filter((product) => product.producttype === "Fashion")
                    .sort((a, b) => a.productprice - b.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 2
                ? products.products
                    .filter((product) => product.producttype === "Fashion")
                    .sort((a, b) => b.productprice - a.productprice)
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : price === 0
                ? products.products
                    .filter((product) => product.producttype === "Fashion")
                    .slice(startIndex, endIndex)
                    .map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))
                : ""
              : ""
            : ""}
        </div>
        <div className="pagination">
          <ArrowBackIosIcon
            className="paginationlink"
            style={{
              display: `${currentPage === 1 ? "none" : ""}`,
              marginRight: "30px",
            }}
            onClick={handlePreviousPageClick}
          />
          <ArrowForwardIosIcon
            className="paginationlink"
            style={{
              display: `${currentPage === pageCount ? "none" : ""}`,
            }}
            onClick={handleNextPageClick}
          />
        </div>
        {/*    <button disabled={currentPage === 1} onClick={handlePreviousPageClick}>
          Previous Page
        </button> */}
      </div>
    </>
  );
};

export default ProductList;
