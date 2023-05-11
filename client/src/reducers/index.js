import { combineReducers } from "redux";
import alert from "./alert";
import auth from "./auth";
import profile from "./profile";
import cart from "./cart";
import product from "./product";
import admin from "./admin";

export default combineReducers({
  alert,
  auth,
  admin,
  profile,
  cart,
  product,
});
