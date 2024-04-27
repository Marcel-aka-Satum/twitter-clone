import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    authenticated: false,
    posts: [],
    error: null,
    reposted: false,
    scheduled: false,
    scheduledError: false,
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
      });

    builder
      .addCase(registerAsync.fulfilled, (state, action) => {
        window.location.href = "/login";
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(createPost.fulfilled, (state, action) => {
        if (action.payload.published == true) {
          state.posts = [...state.posts, action.payload];
          state.scheduled = false;
        } else {
          state.scheduled = true;
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.error = action.error.message;
        state.scheduledError = true;
      });

    builder
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(deleteUserPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      .addCase(deleteUserPost.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(patchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(patchUser.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(validateUser.fulfilled, (state, action) => {
        state.authenticated = true;
      })
      .addCase(validateUser.rejected, (state, action) => {
        state.authenticated = false;
        localStorage.removeItem("user");
      });

    builder
      .addCase(fetchUserByUserName.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserByUserName.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(fetchUserPostsByUsername.fulfilled, (state, action) => {
        state.posts = action.payload.posts;
      })
      .addCase(fetchUserPostsByUsername.rejected, (state, action) => {
        state.error = "User not found";
      });
    builder
      .addCase(repostPost.fulfilled, (state, action) => {
        state.reposted = true;
      })
      .addCase(repostPost.rejected, (state, action) => {
        state.error = action.error.message;
        state.reposted = false;
      });
  },
});

export const fetchUserById = createAsyncThunk(
  "user/fetchUser",
  async (user_id) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/user/${user_id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  }
);

export const fetchUserByUserName = createAsyncThunk(
  "user/fetchUserByUsernName",
  async (username) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/user/username/${username}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data;
  }
);

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
    await fetch("http://localhost:8000/api/v1/user", {
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
      `http://localhost:8000/api/v1/user/post/${user_id}`
    );
    const data = await response.json();
    return data;
  }
);

export const fetchUserPostsByUsername = createAsyncThunk(
  "user/fetchUserPostsByUsername",
  async (username) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/user/post/username/${username}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return data;
  }
);

export const deleteUserPost = createAsyncThunk(
  "user/deleteUserPost",
  async (post_id) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/post/${post_id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return post_id;
  }
);

export const patchUser = createAsyncThunk(
  "user/patchUser",
  async ({ user_id, data }) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/user/${user_id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const payloadData = await response.json();
    return payloadData;
  }
);

export const validateUser = createAsyncThunk("user/validateUser", async () => {
  const response = await fetch("http://localhost:8000/api/v1/validate", {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: document.cookie,
    },
  });
  if (!response.ok) {
    throw new Error("Unauthorized");
  }

  const data = await response.json();
  return data;
});

export const repostPost = createAsyncThunk(
  "user/repostPost",
  async ({ username, post_id }) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/repost/${username}/${post_id}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return { post_id: post_id };
  }
);

export const {} = userSlice.actions;

export default userSlice.reducer;
