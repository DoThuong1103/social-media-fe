import { createSlice } from '@reduxjs/toolkit'

export const userReducer = createSlice({
  name: "User",
  initialState: {
    user: null,
    isFetching: false,
    error: false,
    allUser: null,
    online: [],
    accessToken: null,
    verified: null
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true
      state.error = false
    },
    loginSuccess: (state, action) => {
      const { accessToken, ...user } = action.payload.other;
      state.isFetching = false;
      state.user = user
      state.accessToken = action.payload.accessToken
      state.verified = action.payload.other.verified
      state.error = false
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true
    },
    logout: (state) => {
      state.verified = null
      state.user = null
      state.accessToken = null
      state.isFetching = false
    },
    returnLogin: (state) => {
      state.error = false
    },
    allUser: (state, action) => {
      state.allUser = action.payload
    },
    getOnline: (state, action) => {
      state.online = action.payload
    },
    getProfile: (state, action) => {
      state.user = action.payload
    }
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, returnLogin, allUser, getOnline, getProfile } = userReducer.actions;

export default userReducer.reducer;
