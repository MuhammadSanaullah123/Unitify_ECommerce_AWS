import {
  CREATE_CART,
  CREATE_CART_FAIL,
  UPDATE_CART,
  CLEAR_CART,
} from "../actions/types";

const initialState = {
  cart: null,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case CREATE_CART:
    case UPDATE_CART:
      return {
        ...state,
        cart: payload,
        loading: false,
      };

    case CREATE_CART_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
        cart: null,
      };
    case CLEAR_CART:
      return {
        ...state,
        cart: null,
        loading: false,
      };
    default:
      return state;
  }
}
