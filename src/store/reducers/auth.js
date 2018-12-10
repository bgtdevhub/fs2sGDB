import { LOGIN_SUCCESS, LOGIN, LOGOUT } from '../constants/actions';

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case LOGIN:
    case LOGOUT:
      return {
        authenticated: false
      };

    case LOGIN_SUCCESS:
      return {
        authenticated: true
      };

    default:
      return state;
  }
};

export default authReducer;
