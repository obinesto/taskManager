import { resetTimer, LOGIN_SUCCESS, logoutUser } from '../redux/actions/authActions';

const activityMiddleware = store => next => action => {
  const result = next(action);
  const state = store.getState();

  if (action.type === LOGIN_SUCCESS || (state.auth.isAuthenticated && action.type !== resetTimer.type)) {
    clearTimeout(window.inactivityTimeout);
    window.inactivityTimeout = setTimeout(() => {
      store.dispatch(logoutUser());
    }, 4 * 60 * 60 * 1000); // 4 hours

    if (action.type !== resetTimer.type) {
      store.dispatch(resetTimer());
    }
  }

  return result;
};

export default activityMiddleware;
