import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        window.location.href = "/";
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(registerAsync.fulfilled, (state, action) => {
        window.location.href = "/";
        state.error = null;
      })

      .addCase(registerAsync.rejected, (state, action) => {
        state.error = action.error.message;
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
    return;
  }
);

export const { setName } = userSlice.actions;

export default userSlice.reducer;
