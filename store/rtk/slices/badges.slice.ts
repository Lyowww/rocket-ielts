import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { baseApi } from "@/api/api"
import { EndpointEnum } from "@/enum/endpoints.enum"

type BadgesState = {
  items: PredefinedBadge[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

export type PredefinedBadge = {
  id: number
  name: string
  description: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

const initialState: BadgesState = {
  items: [],
  status: "idle",
  error: null,
}

export const fetchBadges = createAsyncThunk("badges/fetchAll", async () => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("predefined_badges")
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (Array.isArray(parsed)) return parsed as PredefinedBadge[]
      } catch {}
    }
  }

  const response = await baseApi.get(EndpointEnum.badges)
  const items = Array.isArray(response.data) ? (response.data as PredefinedBadge[]) : []

  if (typeof window !== "undefined") {
    localStorage.setItem("predefined_badges", JSON.stringify(items))
  }

  return items
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
        state.items = action.payload
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.status = "failed"
        state.error = (action.error?.message as string) || "Request failed"
      })
  },
})

export default badgesSlice.reducer


