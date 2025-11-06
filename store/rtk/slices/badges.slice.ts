import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { baseApi } from "@/api/api"
import { EndpointEnum } from "@/enum/endpoints.enum"

type BadgesState = {
  names: string[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: BadgesState = {
  names: [],
  status: "idle",
  error: null,
}

export const fetchBadges = createAsyncThunk("badges/fetchAll", async () => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("badges_names")
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed)) return parsed as string[]
      } catch {}
    }
  }

  const response = await baseApi.get(EndpointEnum.badges)
  const names = Array.isArray(response.data)
    ? (response.data as any[]).map(b => b?.name).filter(Boolean)
    : []

  if (typeof window !== "undefined") {
    localStorage.setItem("badges_names", JSON.stringify(names))
  }

  return names as string[]
})

const badgesSlice = createSlice({
  name: "badges",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchBadges.pending, state => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.names = action.payload
        console.log("Badges names", state.names)
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.status = "failed"
        state.error = (action.error?.message as string) || "Request failed"
      })
  },
})

export default badgesSlice.reducer


