import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { baseApi } from "@/api/api"
import { EndpointEnum } from "@/enum/endpoints.enum"

type ChallengesState = {
  data: any | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: ChallengesState = {
  data: null,
  status: "idle",
  error: null,
}

export const fetchChallenges = createAsyncThunk("challenges/fetchAll", async () => {
  const response = await baseApi.get(EndpointEnum.challenges)
  return response.data
})

const challengesSlice = createSlice({
  name: "challenges",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchChallenges.pending, state => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.payload
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.status = "failed"
        state.error = (action.error?.message as string) || "Request failed"
      })
  },
})

export default challengesSlice.reducer


