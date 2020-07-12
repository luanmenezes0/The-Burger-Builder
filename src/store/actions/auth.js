import axios from "axios";
import {
  AUTH_START,
  AUTH_SUCCESS,
  AUTH_FAIL,
  AUTH_LOGOUT,
  SET_AUTH_REDIRECT_PATH,
} from "./actionsTypes";

export const authStart = () => {
  return {
    type: AUTH_START,
  };
};

export const authFail = (error) => {
  return {
    type: AUTH_FAIL,
    error: error,
  };
};

export const authSuccess = (token, userId) => {
  return {
    type: AUTH_SUCCESS,
    idToken: token,
    userId: userId,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationTime");
  localStorage.removeItem("userId");
  return {
    type: AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignup) => {
  return (dispatch) => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true,
    };
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBnfNI5D_TLTKfaYWqEQ-h8Em8Cv_CiMVU";
    if (!isSignup) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBnfNI5D_TLTKfaYWqEQ-h8Em8Cv_CiMVU";
    }
    axios
      .post(url, authData)
      .then((response) => {
        const expirationTime = new Date(
          new Date().getTime() + response.data.expiresIn * 1000
        );
        localStorage.setItem("token", response.data.idToken);
        localStorage.setItem("expirationTime", expirationTime);
        localStorage.setItem("userId", response.data.localId);
        dispatch(authSuccess(response.data.idToken, response.data.localId));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch((err) => {
        dispatch(authFail(err.response.data.error));
      });
  };
};

export const setAuthRedirectPath = (path) => {
  return {
    type: SET_AUTH_REDIRECT_PATH,
    path: path,
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout());
    } else {
      const expirationTime = new Date(localStorage.getItem("expirationTime"));
      if (expirationTime <= new Date()) {
        dispatch(logout());
      } else {
        const userId = localStorage.getItem('userId')
        dispatch(authSuccess(token, userId));
        dispatch(checkAuthTimeout((expirationTime.getTime() - new Date().getTime()) / 1000))
      }
    }
  };
};
