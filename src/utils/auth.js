import * as lgetOr from 'lodash/fp/getOr';

function setSession(data) {
  removeSession();
  localStorage.setItem('session', JSON.stringify(data));
}

function removeSession() {
  localStorage.removeItem('session');
}

function getSessionUsername() {
  const getUsername = lgetOr(null)('username');
  return getUsername(JSON.parse(localStorage.getItem('session')));
}

function getSessionToken() {
  const getToken = lgetOr(null)('accesstoken');
  return getToken(JSON.parse(localStorage.getItem('session')));
}

function getSession() {
  return JSON.parse(localStorage.getItem('session'));
}

export {
  setSession,
  getSession,
  removeSession,
  getSessionUsername,
  getSessionToken
};
