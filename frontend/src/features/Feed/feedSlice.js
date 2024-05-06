import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createPost,
  deleteUserPost,
  likePost,
  repostPost,
} from "../Post/postSlice";

/*
 * The feedSlice is responsible for fetching and creating posts in the global feed(all posts on homepage).
 * It is "inheriting" the createPost, deleteUserPost, likePost, and repostPost actions from the postSlice
 */
const feedSlice = createSlice({
  name: "feed",
  initialState: {
    posts: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPostsGlobal.fulfilled, (state, action) => {
      state.posts = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchPostsGlobal.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.posts = [...state.posts, action.payload];
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(deleteUserPost.fulfilled, (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    });
    builder.addCase(deleteUserPost.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(likePost.fulfilled, (state, action) => {
      state.posts = state.posts.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
    });
    builder.addCase(likePost.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(repostPost.fulfilled, (state, action) => {
      state.posts = state.posts.map((post) =>
        post.id === action.payload.id ? action.payload : post
      );
    });
    builder.addCase(repostPost.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export const fetchPostsGlobal = createAsyncThunk(
  "feed/fetchPostsGlobal",
  async () => {
    const response = await fetch("http://localhost:8000/api/v1/feed/1/posts");
    const data = await response.json();
    return data;
  }
);

export default feedSlice.reducer;
