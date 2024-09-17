import { configureStore } from "@reduxjs/toolkit";

import reducer from "./reducer.js";
import userReducer from "./userReducer.js";

const store = configureStore({
  reducer: {
    root: reducer,
    user: userReducer,
  },
});

export default store;
