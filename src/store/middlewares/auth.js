import { LOGIN_SUCCESS, LOGIN, LOGOUT } from '../constants/actions';
import { setSession, removeSession } from '../../utils/auth';
import { initAuth } from '../../services/arcgis';

const auth = store => next => action => {
  next(action);

  switch (action.type) {
    case LOGIN:
      initAuth();
      return;

    case LOGIN_SUCCESS:
      const authData = action.payload.split('&').reduce((a, c) => {
        const [key, value] = c.split('=');

        return { ...a, ...{ [key.replace(/[\W_]+/g, '')]: value } };
      }, {});

      setSession(authData);
      return;

    case LOGOUT:
      removeSession();
      return;

    default:
      return;
  }
};

export default auth;
