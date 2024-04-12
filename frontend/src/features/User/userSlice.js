import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.user = JSON.stringify(action.payload);
        //window.location.href = "/";
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.user = action.payload;
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

export const { setName } = userSlice.actions;

export default userSlice.reducer;
