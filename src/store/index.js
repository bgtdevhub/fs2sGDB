import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducers';
import { initialState } from './init';
import { app, auth, content } from './middlewares';

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

const middlewares = applyMiddleware(app, auth, content);

const enhancer = composeEnhancers(middlewares);

const store = createStore(reducer, initialState, enhancer);

window.store = store;
export default store;
