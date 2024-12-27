import { createAction } from '@reduxjs/toolkit';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const RESET_TIMER = 'RESET_TIMER';

export const loginSuccess = createAction(LOGIN_SUCCESS, (token) => ({
  payload: token,
}));

export const logoutSuccess = createAction(LOGOUT_SUCCESS);

export const resetTimer = createAction(RESET_TIMER);

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('tm-cd-token');
  dispatch(logoutSuccess());
};

