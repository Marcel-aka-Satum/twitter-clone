import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchCommentsByPostId } from "../Post/postSlice";
import { useDispatch } from "react-redux";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    posts_ids: [],
    posts: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(globalFeed.fulfilled, (state, action) => {
      state.posts = action.payload;
      state.error = null;
    });
  },
});

export const globalFeed = createAsyncThunk("feed/globalFeed", async (type) => {
  const response = await fetch(
    `http://localhost:8000/api/v1/feed/type/${type}`
  );
  const data = await response.json();
  const returnArr = [];
  if (!response.ok) {
    throw new Error(data.detail);
  }
  for (let i = data.post_ids.length - 1; i >= 0; i--) {
    const res = await fetch(
      `http://localhost:8000/api/v1/post/${data.post_ids[i]}`
    );
    if (res.status === 200) {
      const post = await res.json();
      returnArr.push(post);
    }
  }
  return returnArr;
});

export default feedSlice.reducer;
