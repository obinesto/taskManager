import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import taskReducer from './reducers/taskReducer';
import activityMiddleware from '../middleware/activityMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(activityMiddleware),
});

export default store;