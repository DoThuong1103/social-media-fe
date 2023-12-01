import { createSlice } from '@reduxjs/toolkit'

export const userReducer = createSlice({
  name: "User",
  initialState: {
    user: null,
    isFetching: false,
    error: false,
    allUser: null,
    online: []
  },
  reducers: {
    loginStart: (state) => {
      state.isFetching = true
      state.error = false
    },
    loginSuccess: (state, action) => {
      state.isFetching = false;
      state.user = action.payload
      state.error = false
    },
    loginFailure: (state) => {
      state.isFetching = false;
      state.error = true
    },
    logout: (state) => {
      state.user = null
      state.isFetching = false
    },
    returnLogin: (state) => {
      state.error = false
    },
    getAllUser: (state, action) => {
      state.allUser = action.payload
    },
    getOnline: (state, action) => {
      state.online = action.payload
    }
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, returnLogin, getAllUser, getOnline } = userReducer.actions;

export default userReducer.reducer;
