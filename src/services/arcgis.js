import request from '../utils/request';
import { UserSession } from '@esri/arcgis-rest-auth';
import { getSessionToken } from '../utils/auth';

function initAuth() {
  if (!UserSession) {
    throw new Error('UserSession is not available.');
  }

  const authOption = {
    clientId: 'OlOL4En6xeCVOFj3',
    redirectUri: window.location.href + 'app',
    popup: false
  };

  UserSession.beginOAuth2(authOption);
}

function getUserContent({ username, folder = '' }) {
  const url = `https://www.arcgis.com/sharing/rest/content/users/${username}/${folder}`;
  const parameters = {
    token: getSessionToken(),
    f: 'json'
  };

  return request.get(url, parameters);
}

function getFeature(featureServerUrl) {
  const url = `${featureServerUrl}`;
  const parameters = {
    token: getSessionToken(),
    f: 'json'
  };

  return request.get(url, parameters);
}

function enableExtract(featureServerUrl, capabilities) {
  const url = `${featureServerUrl}/updateDefinition`.replace(
    /rest/g,
    '$&/admin'
  );
  const parameters = {
    updateDefinition: JSON.stringify({ capabilities }),
    token: getSessionToken(),
    f: 'json'
  };

  return request.post(url, parameters);
}

function exportItem({ username, options }) {
  const url = `https://www.arcgis.com/sharing/rest/content/users/${username}/export`;

  const parameters = {
    token: getSessionToken(),
    f: 'json',
    ...options
  };

  return request.post(url, parameters);
}

function checkItemStatus(username, id, jobId) {
  const url = `http://www.arcgis.com/sharing/rest/content/users/${username}/items/${id}/status`;
  const parameters = {
    token: getSessionToken(),
    f: 'json',
    jobId,
    jobType: 'export'
  };

  return new Promise((resolve, reject) => {
    const pingForStatus = () => {
      request
        .get(url, parameters)
        .then(res => {
          res.status === 'processing'
            ? setTimeout(() => {
                pingForStatus();
              }, 2000)
            : resolve(res);
        })
        .catch(error => reject(error));
    };

    pingForStatus();
  });
}

function downloadItem(id) {
  const url = `http://www.arcgis.com/sharing/rest/content/items/${id}/data`;

  const a = document.createElement('a');
  a.href = url + '?token=' + getSessionToken();
  document.body.appendChild(a);
  a.click();
}

export {
  initAuth,
  getUserContent,
  getFeature,
  enableExtract,
  exportItem,
  checkItemStatus,
  downloadItem
};
