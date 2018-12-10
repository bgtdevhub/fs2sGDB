import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './index.scss';
import store from './store';
import { Provider } from 'react-redux';

import { App, Login } from './pages/';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path='/' component={Login} />
        <Route path='/app' component={App} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
