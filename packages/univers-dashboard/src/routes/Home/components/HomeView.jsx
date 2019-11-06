import React from 'react'
import { Link } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  listenToAuth,
  openFacebookAuth,
  openGoogleAuth,
  loginWithEmail,
  createWithEmail,
  logoutUser,
  constants
} from 'react-univers-auth';
import { routeStates as R, services as S } from '~/constants/';
import './HomeView.scss'
import firebase from 'firebase';

const A = constants.auth;

export class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loggingInWithEmail: false, email: '', password: ''};

    console.log(this.props.params);

    this.handleChange = this.handleChange.bind(this);
    this.handleEmailLogin = this.handleEmailLogin.bind(this);
    this.handleSubmitEmailLogin = this.handleSubmitEmailLogin.bind(this);
    this.cancelEmailLogin = this.cancelEmailLogin.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
  }

  ifLoggedIn(props) {
    if(props.auth.status === A.AUTH_LOGGED_IN) {
      if(props.params.invite_code && firebase.auth().currentUser) {
        firebase.auth().currentUser.getIdToken().then((token) => {
          axios.post(S.url('functions', '/users/join-organization'),
            {
              organization_id: props.params.organization_id,
              invite_code: props.params.invite_code
            },
            {
              headers: {
                'ID-Token': token
              }
            }).then((user) => {
              props.router.replace(R.CONSOLE);
            }).catch((err) => {
              console.log(err);
            });
        });
      } else {
        props.router.replace(R.CONSOLE);
      }
    }
  }

  // these two methods check if we're already logged in and move
  // to the console.
  componentDidMount() {
    this.ifLoggedIn(this.props);
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.ifLoggedIn(nextProps);
  }

  handleEmailLogin(evt) {
    evt.preventDefault();
    this.setState({['loggingInWithEmail']: true});
  }

  cancelEmailLogin(evt) {
    this.setState({['loggingInWithEmail']: false});
  }

  handleSubmitEmailLogin(evt) {
    evt.preventDefault();
    this.props.loginWithEmail(this.state.email, this.state.password);
  }

  handleGoogleLogin(evt) {
    this.props.openGoogleAuth();
  }

  handleFacebookLogin(evt) {
    this.props.openFacebookAuth();
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  render() {
    let partial;
    if(this.state.loggingInWithEmail) {
      partial = (
        <div className="card">
          <div className="card-block">
            <h2 className="card-title">Univers</h2>
            <p className="card-text">Signing In As:</p>
          </div>
          <div className="card-block sign-in-options">
            <form onSubmit={this.handleSubmitEmailLogin}>
              <div className="form-group">
                <input className="form-control" disabled value={this.state.email} />
              </div>
              <div className="form-group">
                <input className="form-control" name="password" type="password" value={this.state.password} placeholder="Enter your password" onChange={this.handleChange} />
              </div>
              <button className="btn btn-primary btn-block" type="submit">Sign in with Email</button>
            </form>
          </div>
          <div className="card-block">
            <a className='btn btn-secondary cancel' onClick={this.cancelEmailLogin}>Cancel</a>
          </div>
        </div>
      )
    } else {
      partial = (
        <div className="card">
          <div className="card-block">
            <h2 className="card-title">Univers</h2>
            <p className="card-text">Sign In</p>
          </div>
          <ul className="list-group list-group-flush sign-in-options">
            <li className="list-group-item">
              <button type="button" className="btn btn-block btn-secondary" onClick={this.handleGoogleLogin}>Sign in with Google</button>
            </li>
            <li className="list-group-item">
              <button type="button" className="btn btn-block btn-primary" onClick={this.handleFacebookLogin}>Sign in with Facebook</button>
            </li>
          </ul>
          <div className="card-block">
            <form onSubmit={this.handleEmailLogin}>
              <div className="form-group">
                <input className="form-control" name="email" type="text" value={this.state.email} placeholder="Enter your email address" onChange={this.handleChange} />
              </div>
              <button className="btn btn-block btn-primary" type="submit">Sign in with Email</button>
            </form>
          </div>
          <div className="card-block">
            <p>No Account? <Link to={this.props.params.invite_code ? R.parse(R.SIGNUP_ORGANIZATION, {organization_id: this.props.params.organization_id, invite_code: this.props.params.invite_code}) : R.SIGNUP} className='card-link sign-up-link'>Sign Up</Link></p>
          </div>
        </div>
      )
    }

    return (
      <div className="container">
        <div className="home">
          {partial}
        </div>
      </div>
    )
  }
};

const mapStateToProps = (state) => {
	return { auth: state.auth };
};

const mapDispatchToProps = {
  listenToAuth,
  openFacebookAuth,
  openGoogleAuth,
  loginWithEmail,
  createWithEmail,
  logoutUser
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
