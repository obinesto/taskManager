import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './reducers/authReducer';
import taskReducer from './reducers/taskReducer';
import activityMiddleware from '../middleware/activityMiddleware';

const authPersistConfig = {
  key: 'root',
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = {
  auth: persistedAuthReducer,
  task: taskReducer,
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(activityMiddleware),
});

const persistor = persistStore(store);

export { store, persistor };