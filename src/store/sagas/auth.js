import axios from "axios";
import { delay, put, call } from "redux-saga/effects";
import {
  logoutSucceed,
  logout,
  authStart,
  authSuccess,
  checkAuthTimeout,
  authFail,
} from "../actions/index";

export function* logoutSaga(action) {
  yield call([localStorage, "removeItem"], "token")
  yield call([localStorage, "removeItem"], "expirationTime")
  yield call([localStorage, "removeItem"], "userId")
  yield put(logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
  yield delay(action.expirationTime * 1000);
  yield put(logout());
}

export function* authUserSaga(action) {
  yield put(authStart());

  const authData = {
    email: action.email,
    password: action.password,
    returnSecureToken: true,
  };

  let url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBnfNI5D_TLTKfaYWqEQ-h8Em8Cv_CiMVU";
  if (!action.isSignup) {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBnfNI5D_TLTKfaYWqEQ-h8Em8Cv_CiMVU";
  }

  try {
    const response = yield axios.post(url, authData);

    const expirationTime = yield new Date(
      new Date().getTime() + response.data.expiresIn * 1000
    );
    yield localStorage.setItem("token", response.data.idToken);
    yield localStorage.setItem("expirationTime", expirationTime);
    yield localStorage.setItem("userId", response.data.localId);
    yield put(authSuccess(response.data.idToken, response.data.localId));
    yield put(checkAuthTimeout(response.data.expiresIn));
  } catch (error) {
    yield put(authFail(error.response.data.error));
  }
}

export function* authCheckStateSaga(action) {
  const token = yield localStorage.getItem("token");
  if (!token) {
    yield put(logout());
  } else {
    const expirationTime = yield new Date(
      localStorage.getItem("expirationTime")
    );
    if (expirationTime <= new Date()) {
      yield put(logout());
    } else {
      const userId = yield localStorage.getItem("userId");
      yield put(authSuccess(token, userId));
      yield put(
        checkAuthTimeout(
          (expirationTime.getTime() - new Date().getTime()) / 1000
        )
      );
    }
  }
}
