import axios from "axios";
import { setAlert } from "./alert";
import {
  ACCOUNT_DELETED,
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  CLEAR_CART,
} from "./types";

// Get current users profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.status },
    });
  }
};

// Create or update profile
export const createProfile =
  (formData, edit = false) =>
  async (dispatch) => {
    try {
      const res = await axios.post("/api/profile", formData);

      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
      dispatch(
        setAlert(edit ? "Profile Updated" : "Profile Created", "success", 5000)
      );
    } catch (err) {
      const errors = err.response.data.errors;

      if (errors) {
        errors.forEach((error) =>
          dispatch(setAlert(error.msg, "danger"), 5000)
        );
      }

      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.data.msg, status: err.response.status },
      });
    }
  };

// Add History
export const addHistory = (formData) => async (dispatch) => {
  try {
    const res = await axios.put("/api/profile/history", formData);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });
    dispatch(setAlert("Checkout Successful", "success", 5000));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger", 5000)));
    }

    /*     dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.status },
    }); */
  }
};

// Delete account & Profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure you want to delete your accont? ")) {
    try {
      await axios.put("/api/profile");

      dispatch({
        type: CLEAR_PROFILE,
      });
      dispatch({
        type: ACCOUNT_DELETED,
      });
      dispatch(setAlert("Your account has been permanently deleted!", 5000));
    } catch (err) {
      dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.data.msg, status: err.response.status },
      });
    }
  }
};

//Sending email to customer & user

export const sendEmail = (formData) => async (dispatch) => {
  try {
    await axios.post("/api/profile/sendmail", formData);

    /*   dispatch({
      type: CLEAR_CART,
    }); */
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger", 5000)));
    }
    /*   dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.data.msg, status: err.response.status },
    }); */
  }
};

//Making Stripe Gateway Payment

export const makePayment = (formData) => async (dispatch) => {
  try {
    const res = await axios.post("/api/stripe/payment", formData);
    console.log("INSIDE ACTION");
    console.log(res);

    if (res.data.url) {
      // window.location.href = res.data.url;
      window.open(res.data.url, "_blank");
    }
  } catch (err) {
    console.log(err.message);
  }
};

/* const makeRequest = async () => {
  try {
    const res = await userRequest.post("/checkout/payment", {
      tokenId: stripeToken.id,
      amount: 500,
    });
    history.push("/success", {
      stripeData: res.data,
      products: cart, });
  } catch {}
}; */
