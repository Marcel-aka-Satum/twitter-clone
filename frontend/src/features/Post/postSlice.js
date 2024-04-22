import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    post: [],
    comments: [],
    error: null,
    likes: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPostById.fulfilled, (state, action) => {
      state.post = action.payload;
    });
    builder.addCase(fetchPostById.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
      state.comments = action.payload.posts;
    });
    builder.addCase(fetchCommentsByPostId.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      state.comments = [...state.comments, action.payload];
    });
    builder.addCase(createComment.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export const fetchPostById = createAsyncThunk(
  "post/fetchPostById",
  async (post_id) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/post/${post_id}`
    );
    const data = await response.json();
    return data;
  }
);

export const fetchCommentsByPostId = createAsyncThunk(
  "post/fetchCommentsByPostId",
  async (post_id) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/comments/post/${post_id}`
    );
    const data = await response.json();
    return data;
  }
);

export const createComment = createAsyncThunk(
  "user/createComment",
  async (data) => {
    const response = await fetch("http://localhost:8000/api/v1/comment", {
      method: "POST",
      credentials: "include",
      body: data,
    });
    const payloadData = await response.json();
    return payloadData;
  }
);

export default postSlice.reducer;
