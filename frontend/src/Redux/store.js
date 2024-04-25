import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/User/userSlice";
import postReducer from "../features/Post/postSlice";
import feedReducer from "../features/Feed/feedSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    feed: feedReducer,
  },
});
