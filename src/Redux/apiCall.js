
import axios from "axios"
import { loginFailure, loginStart, loginSuccess } from "./userReducer"
import { Endpoints } from "../constants/endpoint"

export const login = async (dispatch, user) => {
  dispatch(loginStart())
  try {
    const res = await axios.post(`${process.env.REACT_APP_BASE_URL}${Endpoints.Login}`, user)
    dispatch(loginSuccess(res.data))
  } catch (error) {
    dispatch(loginFailure())
  }
}

export const VerifyEmail = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/verify/email`, user);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailure());
  }
}


export const signup = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/create/user`, user);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    dispatch(loginFailure());
  }
}

export const getAllUser = async (dispatch, user) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/allUser`, {},
      { header: { token: user.user.accessToken } });
    console.log(res);
    dispatch(getAllUser(res.data));
  } catch (error) {
  }
}
