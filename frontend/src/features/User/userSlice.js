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
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const loginAsync = createAsyncThunk(
  "user/loginAsync",
  async (formData) => {
    const response = fetch("http://localhost:8000/api/v1/token", {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("user", JSON.stringify(data.user.user));
        window.location.href = "/";
      })
      .catch((error) => console.error("Error:", error));
    return response.data.user.user;
  }
);

export const { setName } = userSlice.actions;

export default userSlice.reducer;
