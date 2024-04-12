import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/User/userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
