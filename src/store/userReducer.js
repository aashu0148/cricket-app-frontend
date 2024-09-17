import actionTypes from "./actionTypes";

const initialState = {};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_LOGIN: {
      return { ...action.user };
    }
    case actionTypes.USER_LOGOUT: {
      return {};
    }
    case actionTypes.USER_UPDATE: {
      return { ...state, ...action.user };
    }

    default:
      return state;
  }
};

export default userReducer;
