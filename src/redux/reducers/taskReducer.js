import {
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
} from '../actions/taskActions';

const initialState = {
  user: null,
  tasks: [],
  users: [],
  loading: false,
  error: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS_REQUEST:
    case FETCH_USERS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_TASKS_SUCCESS:
      return { ...state, loading: false, tasks: action.payload };
    case FETCH_USERS_SUCCESS:
      return { ...state, loading: false, users: action.payload };
    case FETCH_TASKS_FAILURE:
    case FETCH_USERS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default taskReducer;

