import { LOGIN, LOGIN_SUCCESS, LOGOUT } from '../constants/actions';

const login = () => ({
  type: LOGIN
});

const loginSuccess = payload => ({
  type: LOGIN_SUCCESS,
  payload
});

const logout = () => ({
  type: LOGOUT
});

export { login, loginSuccess, logout };
