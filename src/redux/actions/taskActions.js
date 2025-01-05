import { createAction } from "@reduxjs/toolkit";

export const FETCH_TASKS_REQUEST = 'FETCH_TASKS_REQUEST';
export const FETCH_TASKS_SUCCESS = 'FETCH_TASKS_SUCCESS';
export const FETCH_TASKS_FAILURE = 'FETCH_TASKS_FAILURE';
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const fetchTasksRequest = createAction(FETCH_TASKS_REQUEST);
export const fetchTasksSuccess = createAction(FETCH_TASKS_SUCCESS);
export const fetchTasksFailure = createAction(FETCH_TASKS_FAILURE);
export const fetchUsersRequest = createAction(FETCH_USERS_REQUEST);
export const fetchUsersSuccess = createAction(FETCH_USERS_SUCCESS);
export const fetchUsersFailure = createAction(FETCH_USERS_FAILURE);
export const fetchUserRequest = createAction(FETCH_USER_REQUEST);
export const fetchUserSuccess = createAction(FETCH_USER_SUCCESS);
export const fetchUserFailure = createAction(FETCH_USER_FAILURE);