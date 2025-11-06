import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseApi } from "@/api/api";
import { EndpointEnum } from "@/enum/endpoints.enum";

type UserProfileState = {
  data: any | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: UserProfileState = {
  data: null,
  status: "idle",
  error: null,
};

export const fetchUserProfile = createAsyncThunk("user/fetchProfile", async () => {
  const response = await baseApi.get(EndpointEnum.profile);
  return response.data;
});

const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.error?.message as string) || "Request failed";
      });
  },
});

export default userProfileSlice.reducer;


