import { createAction } from '@reduxjs/toolkit';

export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const RESET_TIMER = 'RESET_TIMER';

export const registerSuccess = createAction(REGISTER_SUCCESS);

export const loginSuccess = createAction(LOGIN_SUCCESS, token => {
  const expirationTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; // 7 days
  return {
    payload: {token, expirationTime}
  };
});

export const logoutSuccess = createAction(LOGOUT_SUCCESS);

export const resetTimer = createAction(RESET_TIMER);

export const logoutUser = () => (dispatch) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('token');
  }
  dispatch(logoutSuccess());
};

