import {
  getUserContent,
  enableExtract,
  getFeature
} from '../../services/arcgis';
import {
  GET_CONTENT,
  GET_CONTENT_SUCCESS,
  GET_CONTENT_FAILED,
  SELECT_FOLDER,
  SELECT_FILE,
  ENABLE_EXTRACT,
  GET_FEATURE,
  GET_FEATURE_SUCCESS,
  GET_FEATURE_FAILED,
  ENABLE_EXTRACT_SUCCESS,
  ENABLE_EXTRACT_FAILED
} from '../constants/actions';
import * as lgetOr from 'lodash/fp/getOr';
import * as lisEmpty from 'lodash/fp/isEmpty';

const content = store => next => action => {
  next(action);

  switch (action.type) {
    case GET_CONTENT:
      getUserContent(action.payload)
        .then(content => {
          const payload = { content };
          store.dispatch({
            type: GET_CONTENT_SUCCESS,
            payload
          });
        })
        .catch(error => {
          store.dispatch({ type: GET_CONTENT_FAILED });
        });

      return;

    case GET_CONTENT_SUCCESS:
      const { content = {} } = action.payload;
      const getCurrentFolder = lgetOr(null)('currentFolder');
      const currentFolder = getCurrentFolder(content);

      const getCurrentFolderId = lgetOr('root')('id');
      const payload = getCurrentFolderId(currentFolder);

      store.dispatch({
        type: SELECT_FOLDER,
        payload
      });

      return;

    case SELECT_FILE:
      const { selectedFileId, feature, url } = action.payload;

      if (!selectedFileId || !lisEmpty(feature) || lisEmpty(url)) return;

      store.dispatch({
        type: GET_FEATURE,
        payload: url
      });

      return;

    case GET_FEATURE:
      getFeature(action.payload)
        .then(feature => {
          store.dispatch({ type: GET_FEATURE_SUCCESS, payload: { feature } });
        })
        .catch(error => {
          store.dispatch({ type: GET_FEATURE_FAILED });
        });

      return;

    case ENABLE_EXTRACT:
      const { url: extractUrl, capabilities, id } = action.payload;

      enableExtract(extractUrl, capabilities)
        .then(res => {
          store.dispatch({
            type: ENABLE_EXTRACT_SUCCESS,
            payload: { id, capabilities }
          });
        })
        .catch(error => {
          store.dispatch({ type: ENABLE_EXTRACT_FAILED });
        });

      return;

    default:
      return;
  }
};

export default content;
