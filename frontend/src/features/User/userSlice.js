import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    posts: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        localStorage.setItem("user", JSON.stringify(action.payload));
        window.location.href = "/";
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(registerAsync.fulfilled, (state) => {
        window.location.href = "/";
        state.error = null;
      })

      .addCase(registerAsync.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(createPost.fulfilled, (state, action) => {
        state.posts = [...state.posts, action.payload];
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteUserPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      });
  },
});

export const loginAsync = createAsyncThunk(
  "user/loginAsync",
  async (formData) => {
    const response = await fetch("http://localhost:8000/api/v1/token", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.user.user;
  }
);

export const registerAsync = createAsyncThunk(
  "user/registerAscync",
  async ({ username, email, password }) => {
    await fetch("http://localhost:8000/api/v1/users", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });
  }
);

export const createPost = createAsyncThunk("user/createPost", async (data) => {
  const response = await fetch("http://localhost:8000/api/v1/post", {
    method: "POST",
    credentials: "include",
    body: data,
  });
  const payloadData = await response.json();
  return payloadData;
});

export const fetchUserPosts = createAsyncThunk(
  "user/fetchUserPosts",
  async (user_id) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/users/post/${user_id}`
    );
    const data = await response.json();
    return data;
  }
);

export const deleteUserPost = createAsyncThunk(
  "user/deleteUserPost",
  async (post_id) => {
    fetch(`http://localhost:8000/api/v1/post/${post_id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return post_id;
  }
);

export const {} = userSlice.actions;

export default userSlice.reducer;
