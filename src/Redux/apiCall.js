
import axios from "axios"
import { getProfile, loginFailure, loginStart, loginSuccess, allUser, allGroup, signUp } from "./userReducer"
import { Endpoints } from "../constants/endpoint"

export const login = async (dispatch, user) => {
  dispatch(loginStart())
  try {
    const res = await axios.post(`${process.env.REACT_APP_BACK_END_URL}${Endpoints.Login}`, user)
    dispatch(loginSuccess(res.data))
  } catch (error) {
    dispatch(loginFailure())
  }
}

export const getUserProfile = async (dispatch, id) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/user/profile/${id}`, {},
    );
    dispatch(getProfile(res.data));
  } catch (error) {
  }
}

export const VerifyEmail = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/user/verify/email`, user);
    dispatch(signUp(res.data));
  } catch (error) {
    dispatch(loginFailure());
  }
}


export const signup = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${process.env.REACT_APP_BACK_END_URL}/user/create/user`, user);
    dispatch(signUp(res.data));
  } catch (error) {
    dispatch(loginFailure());
  }
}

export const getAllUser = async (dispatch, accessToken) => {
  try {
    if (!accessToken) return
    const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/user/allUser`,
      {
        headers: {
          token: accessToken,
        },
      });
    dispatch(allUser(res.data));
  } catch (error) {
  }
}

export const getAllGroup = async (dispatch, accessToken) => {
  try {
    if (!accessToken) return
    const res = await axios.get(`${process.env.REACT_APP_BACK_END_URL}/group/allGroup`,
      {
        headers: {
          token: accessToken,
        },
      });
    dispatch(allGroup(res.data));
  } catch (error) {
  }
}
