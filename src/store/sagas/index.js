import { takeEvery, all, takeLatest } from "redux-saga/effects";
import {
  AUTH_INITIATE_LOGOUT,
  AUTH_CHECK_TIMEOUT,
  AUTH_USER,
  AUTH_CHECK_STATE,
  ORDER_BURGER,
  FETCH_ORDERS,
  FETCH_INGREDIENTS,
} from "../actions/actionsTypes";
import {
  logoutSaga,
  checkAuthTimeoutSaga,
  authUserSaga,
  authCheckStateSaga,
} from "./auth";
import { purchaseBurgerSaga, fetchOrdersSaga } from "./order";
import { initIngredientsSaga } from "./burgerBuilder";

export function* watchAuth() {
  yield all([
    takeEvery(AUTH_INITIATE_LOGOUT, logoutSaga),
    takeEvery(AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
    takeEvery(AUTH_USER, authUserSaga),
    takeEvery(AUTH_CHECK_STATE, authCheckStateSaga),
  ]);
}

export function* watchBurgerBuilder() {
  yield takeEvery(FETCH_INGREDIENTS, initIngredientsSaga);
}

export function* watchOrders() {
  yield takeLatest(ORDER_BURGER, purchaseBurgerSaga);
  yield takeEvery(FETCH_ORDERS, fetchOrdersSaga);
}
