import axios from "axios";
import { ADMIN_LOADED, AUTH_ERROR } from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadAdmin = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/admin");

    dispatch({
      type: ADMIN_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};
