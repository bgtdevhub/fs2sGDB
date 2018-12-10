import { combineReducers } from 'redux';
import appReducer from './app';
import authReducer from './auth';
import contentReducer from './content';

const rootReducer = combineReducers({
  appState: appReducer,
  authState: authReducer,
  contentState: contentReducer
});

export default rootReducer;
