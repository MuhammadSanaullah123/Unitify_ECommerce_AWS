import { ADMIN_LOADED, AUTH_ERROR } from "../actions/types";

//taking token from localstorage
const initialState = {
  admin: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADMIN_LOADED:
      return {
        ...state,

        admin: payload,
      };

    case AUTH_ERROR:
      return {
        ...state,
      };
    default:
      return state;
  }
}
