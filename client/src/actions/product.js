import axios from "axios";
import {
  PRODUCT_ADDED,
  PRODUCT_FAIL,
  GET_PRODUCT,
  GET_SINGLE_PRODUCT,
  PRODUCT_DELETED,
} from "./types";
import { setAlert } from "./alert";

// Add item to website
export const addProduct = (formData) => async (dispatch) => {
  try {
    const res = await axios.post("/api/product", formData);

    dispatch({
      type: PRODUCT_ADDED,
      payload: res.data,
    });
    dispatch(setAlert("Product Added", "success", 2000));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger", 5000)));
    }

    dispatch({
      type: PRODUCT_FAIL,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};

// Delete item from website
export const deleteItem = (formData) => async (dispatch) => {
  try {
    const res = await axios.delete("/api/product", {
      params: { id: formData },
    });

    dispatch({
      type: PRODUCT_DELETED,
      payload: res.data,
    });

    dispatch(setAlert("Product Removed", "success", 2500));
  } catch (err) {
    dispatch({
      type: PRODUCT_FAIL,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};

// Get all products
export const getProducts = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/product");

    dispatch({
      type: GET_PRODUCT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_FAIL,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};

//Get product by ID
export const getProductById = (productId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/product/${productId}`);

    dispatch({
      type: GET_SINGLE_PRODUCT,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_FAIL,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};
