import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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
      state.posts_ids = action.payload.post_ids;
      state.error = null;
    });
    builder.addCase(globalFeed.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(fetchPostsGlobal.fulfilled, (state, action) => {
      state.posts = action.payload;
    });
    builder.addCase(fetchPostsGlobal.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export const globalFeed = createAsyncThunk("feed/globalFeed", async (type) => {
  const response = await fetch(
    `http://localhost:8000/api/v1/feed/type/${type}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail);
  }
  return data;
});

export const fetchPostsGlobal = createAsyncThunk(
  "feed/fetchPostsGlobal",
  async (post_ids) => {
    let returnArr = [];
    for (let i = post_ids.length - 1; i >= 0; i--) {
      const res = await fetch(
        `http://localhost:8000/api/v1/post/${post_ids[i]}`
      );
      if (res.status === 200) {
        const post = await res.json();
        returnArr.push(post);
      }
    }
    return returnArr;
  }
);

export default feedSlice.reducer;
