import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { baseApi } from "@/api/api"
import { EndpointEnum } from "@/enum/endpoints.enum"

type ScoresState = {
  data: any | null
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: ScoresState = {
  data: null,
  status: "idle",
  error: null,
}

export const fetchScores = createAsyncThunk("scores/fetchAll", async () => {
  const response = await baseApi.get(EndpointEnum.scores)
  return response.data
})

const scoresSlice = createSlice({
  name: "scores",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchScores.pending, state => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchScores.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.payload
      })
      .addCase(fetchScores.rejected, (state, action) => {
        state.status = "failed"
        state.error = (action.error?.message as string) || "Request failed"
      })
  },
})

export default scoresSlice.reducer


