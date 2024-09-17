import actionTypes from "./actionTypes";

const initialState = {
  isMobileView: false,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_MOBILE_VIEW: {
      return { ...state, isMobileView: action.isMobileView ? true : false };
    }

    default:
      return state;
  }
};

export default rootReducer;
