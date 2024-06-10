import { createSlice } from '@reduxjs/toolkit'

import fetchUserData from '../thunks/user'

const initialState = {
  data: null,
  loading: true,
  error: null,
}

const userData = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: () => initialState,
    setUserData: (state, action) => {
      state.data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.data = action.payload
        state.loading = false
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.error = 'Could not get user data'
        state.loading = false
      })
  },
})

export const { reset, setUserData } = userData.actions

export default userData.reducer
