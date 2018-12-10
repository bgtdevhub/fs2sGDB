import React, { Component } from 'react';
// import style from './Login.scss';
import { connect } from 'react-redux';
import { login, logout } from '../../store/actions/auth';

class Login extends Component {
  initLogin = () => {
    this.props.login();
  };

  componentDidMount() {
    this.props.logout();
  }

  render() {
    return (
      <div className='login'>
        <div className='login-container'>
          <div className='login-title'>fs2fGDB</div>
          <div className='login-panel'>
            <div className='login-panel-title'>LOGIN</div>
            <div className='login-panel-body'>
              <button className='btn' onClick={this.initLogin}>
                Arcgis Online
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  authenticated: state.authState.authenticated
});

const actions = { login, logout };

export default connect(
  mapStateToProps,
  actions
)(Login);
