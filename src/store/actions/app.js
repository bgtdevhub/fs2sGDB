import { INIT_APP, SET_APP_SETTINGS, EXPORT_ITEM } from '../constants/actions';

const initApp = payload => ({
  type: INIT_APP,
  payload
});

const updateSettings = payload => ({
  type: SET_APP_SETTINGS,
  payload
});

const exportItem = payload => ({
  type: EXPORT_ITEM,
  payload
});

export { initApp, updateSettings, exportItem };
