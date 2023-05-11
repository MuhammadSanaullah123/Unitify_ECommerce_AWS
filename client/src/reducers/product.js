import {
  PRODUCT_ADDED,
  PRODUCT_FAIL,
  GET_PRODUCT,
  GET_SINGLE_PRODUCT,
  PRODUCT_DELETED,
} from "../actions/types";

const initialState = {
  products: null,
  currentProduct: null,
  currentloading: true,
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case PRODUCT_ADDED:
    case PRODUCT_DELETED:
    case GET_PRODUCT:
      return {
        ...state,
        products: payload,
        loading: false,
      };
    case GET_SINGLE_PRODUCT:
      return {
        ...state,

        currentProduct: payload,
        currentloading: false,
      };
    case PRODUCT_FAIL:
      return {
        ...state,
        error: payload,
        loading: false,
        products: null,
      };

    default:
      return state;
  }
}
