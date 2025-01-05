import { resetTimer, LOGIN_SUCCESS, logoutUser } from '../redux/actions/authActions';

const activityMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState();

  const now = new Date().getTime();
  const expirationTime = state.auth.expirationTime;

  // Check for token expiration
  if (state.auth.isAuthenticated && now > expirationTime) {
    store.dispatch(logoutUser());
    return result;
  }

  if (action.type === LOGIN_SUCCESS || (state.auth.isAuthenticated && action.type !== resetTimer.type)) {
    clearTimeout(window.inactivityTimeout);
    window.inactivityTimeout = setTimeout(() => {
      store.dispatch(logoutUser());
    }, 6 * 60 * 60 * 1000); // 6 hours

    if (action.type !== resetTimer.type) {
      store.dispatch(resetTimer());
    }
  }

  return result;
};

export default activityMiddleware;
