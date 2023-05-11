import axios from "axios";
import {
  CREATE_CART,
  CREATE_CART_FAIL,
  UPDATE_CART,
  CLEAR_CART,
} from "./types";
import { setAlert } from "./alert";

// Create cart
export const createCart =
  (formData) =>
  //if error then remove formdata
  async (dispatch) => {
    try {
      const res = await axios.post("/api/cart", formData);

      dispatch({
        type: CREATE_CART,
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: CREATE_CART_FAIL,
        payload: { msg: err.response.data.msg, status: err.response.status },
      });
    }
  };

// Get current users cart
export const getCurrentCart = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/cart/me");

    dispatch({
      type: CREATE_CART,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: CREATE_CART_FAIL,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};

// Add item to cart
export const addItem = (formData) => async (dispatch) => {
  try {
    const res = await axios.put("/api/cart/items", formData);

    dispatch({
      type: UPDATE_CART,
      payload: res.data,
    });
    dispatch(setAlert("Item Added", "success", 5000));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger", 5000)));
    }

    /*  dispatch({
      type: CREATE_CART_FAIL,
      payload: { msg: err.response.data.msg, status: err.response.status },
    }); */
  }
};

// Delete item from cart
export const deleteItem = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/cart/${id}`);

    dispatch({
      type: UPDATE_CART,
      payload: res.data,
    });

    dispatch(setAlert("Item Removed", "success", 5000));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger", 5000)));
    }

    /*    dispatch({
      type: CREATE_CART_FAIL,
      payload: { msg: err.response.data.msg, status: err.response.status },
    }); */
  }
};

// Delete cart
export const deleteCart = () => async (dispatch) => {
  try {
    const res = await axios.delete("/api/cart/");

    dispatch({
      type: CREATE_CART_FAIL,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger", 5000)));
    }

    /*    dispatch({
      type: CREATE_CART_FAIL,
      payload: { msg: err.response.data.msg, status: err.response.status },
    }); */
  }
};
