import {
  GET_CONTENT,
  SELECT_FOLDER,
  SELECT_FILE,
  GET_FEATURE,
  ENABLE_EXTRACT
} from '../constants/actions';

const getUserContent = payload => ({
  type: GET_CONTENT,
  payload
});

const selectFolder = payload => ({
  type: SELECT_FOLDER,
  payload
});

const selectFile = payload => ({
  type: SELECT_FILE,
  payload
});

const getFeature = payload => ({
  type: GET_FEATURE,
  payload
});

const enableExtract = payload => ({
  type: ENABLE_EXTRACT,
  payload
});

export { getUserContent, enableExtract, selectFolder, selectFile, getFeature };
