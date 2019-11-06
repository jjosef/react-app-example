import React from 'react'
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {
  listenToAuth,
  openFacebookAuth,
  openGoogleAuth,
  loginWithEmail,
  createWithEmail,
  logoutUser,
  constants
} from 'react-univers-auth';
import { routeStates as R } from '~/constants/';
import './SignUpView.scss'

const A = constants.auth;

export class SignUpView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {email: '', password: '', displayName: ''};

    this.handleCreateAccount = this.handleCreateAccount.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  ifLoggedIn(props) {
    if(props.auth.status === A.AUTH_LOGGED_IN) {
      props.router.replace(R.CONSOLE);
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

  handleCreateAccount(evt) {
    evt.preventDefault();
    this.props.createWithEmail(
      this.state.email,
      this.state.password,
      this.state.displayName
    );
  }

  handleChange(evt) {
    this.setState({[evt.target.name]: evt.target.value});
  }

  render() {
    return (
      <div className="container">
        <div className="sign-up">
          <div className="card">
            <div className="card-block">
              <h2 className="card-title">Sign Up</h2>
              <p className="card-text">Enter the details below</p>
            </div>
            <div className="card-block">
              <form onSubmit={this.handleCreateAccount}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input name="displayName" className="form-control" type="text" value={this.state.displayName} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input name="email" className="form-control" type="email" value={this.state.email} onChange={this.handleChange} />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input name="password" className="form-control" type="password" value={this.state.password} onChange={this.handleChange} />
                </div>
                <button className="btn btn-primary btn-block" type="submit">Complete Sign Up</button>
              </form>
              <div className="card-block">
                <p>Have an Account? <Link to={this.props.params.invite_code ? R.parse(R.JOIN_ORGANIZATION, {organization_id: this.props.params.organization_id, invite_code: this.props.params.invite_code}) : R.HOME} className='card-link sign-up-link'>Sign In</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
	return { auth: state.auth };
};

const mapDispatchToProps = {
  createWithEmail
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpView)
