import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    authenticated: false,
    error: null,
    reposted: false,
    user_followers: [],
    authenticated_user: null,
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
      .addCase(patchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(patchUser.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.error = action.error.message;
      });

    builder
      .addCase(validateUser.fulfilled, (state, action) => {
        state.authenticated = true;
        state.authenticated_user = action.payload;
      })
      .addCase(validateUser.rejected, (state, action) => {
        state.authenticated = false;
        state.authenticated_user = null;
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
      .addCase(fetchUserLikes.fulfilled, (state, action) => {
        localStorage.setItem("likes", JSON.stringify(action.payload));
      })
      .addCase(fetchUserLikes.rejected, (state, action) => {
        state.error = action.error.message;
      });
    builder
      .addCase(fetchUserReposts.fulfilled, (state, action) => {
        localStorage.setItem("reposts", JSON.stringify(action.payload));
      })
      .addCase(fetchUserReposts.rejected, (state, action) => {
        state.error = action.error.message;
      });
    builder
      .addCase(fetchUserFollowers.fulfilled, (state, action) => {
        state.user_followers = action.payload;
      })
      .addCase(fetchUserFollowers.rejected, (state, action) => {
        state.error = action.error.message;
      });
    builder
      .addCase(followUser.fulfilled, (state, action) => {
        if (
          state.user_followers.some(
            (user) => user.username === action.payload.username
          )
        ) {
          // If the user is already a follower, remove them
          state.user_followers = state.user_followers.filter(
            (user) => user.username !== action.payload.username
          );
        } else {
          // If the user is not a follower, add them
          state.user_followers.push(action.payload);
        }
      })
      .addCase(followUser.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const fetchUser = createAsyncThunk("user/fetchUser", async (user_id) => {
  const response = await fetch(`http://localhost:8000/api/v1/user`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  return data;
});

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

export const followUser = createAsyncThunk(
  "user/followUser",
  async (username) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/user/follow/${username}`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  }
);

export const patchUser = createAsyncThunk(
  "user/patchUser",
  async ({ data }) => {
    const response = await fetch(`http://localhost:8000/api/v1/user`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const payloadData = await response.json();
    return payloadData;
  }
);

export const fetchUserFollowers = createAsyncThunk(
  "user/fetchUserFollowers",
  async () => {
    const response = await fetch("http://localhost:8000/api/v1/followers", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
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

export const fetchUserLikes = createAsyncThunk(
  "user/fetchUserLikes",
  async () => {
    const response = await fetch("http://localhost:8000/api/v1/user/likes", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  }
);

export const fetchUserReposts = createAsyncThunk(
  "user/fetchUserReposts",
  async () => {
    const response = await fetch("http://localhost:8000/api/v1/user/reposts", {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    return data;
  }
);

export const {} = userSlice.actions;

export default userSlice.reducer;
