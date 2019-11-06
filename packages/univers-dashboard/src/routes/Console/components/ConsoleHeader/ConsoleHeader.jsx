import React from 'react'
import { Link } from 'react-router';
import AvatarImg from './assets/avatar.png';
import { routeStates as R } from '~/constants/';
import './ConsoleHeader.scss'
import logo from './assets/logo.png'

export class ConsoleHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accountOpen: false,
      orgsOpen: false,
      dotsOpen: false,
      notificationsOpen: false,
      notificationCount: 0,
      notifications: null
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.toggleAccount = this.toggleAccount.bind(this);
    this.toggleOrgs = this.toggleOrgs.bind(this);
    this.toggleDots = this.toggleDots.bind(this);
    this.toggleNotifications = this.toggleNotifications.bind(this);
  }

  handleLogout() {
    this.props.logoutUser();
  }

  toggleAccount(evt) {
    let state = this.state;
    state.accountOpen = !this.state.accountOpen;

    this.setState(state);
  }

  toggleOrgs(evt) {
    let state = this.state;
    state.orgsOpen = !this.state.orgsOpen;

    this.setState(state);
  }

  toggleDots(evt) {
    let state = this.state;
    state.dotsOpen = !this.state.dotsOpen;

    this.setState(state);
  }

  toggleNotifications(evt) {
    let state = this.state;
    state.notificationsOpen = !this.state.notificationsOpen;

    this.setState(state);
  }

  getPhotoUrl(profile) {
    if(profile.photoURL) return profile.photoURL;
    // else we can look through providers to return a photo
    // ...
    for(let provider of profile.providerData) {
      if(provider.photoURL) return provider.photoURL;
    }
    // else we want to show a placeholder
    return AvatarImg;
  }

  render() {
    let notifications;
    if(this.state.notifications) {
      notifications = [];
      this.state.notifications.map((n, i) => {
        <Link key={'n'+i} to={n.to} className="dropdown-item">{n.text}</Link>
      })
    } else {
      notifications = (
        <div className="notifications">
          <p className="no-notifications">You have no new notifications</p>
        </div>
      )
    }
    return (
      <div className="console-header container-fluid">
        <div className="row">
          <div className="col org-bar">
            <img src={logo} />
            <h2>Univers</h2>
            <div className="organization-manager">
              <div className={'dropdown' + (this.state.orgsOpen ? ' show' : '')}>
                <a className="org-select dropdown-toggle" id="dropdownOrganizationButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded={this.state.orgsOpen} onClick={this.toggleOrgs}><span className="org-name">{this.props.auth.organization_details ? this.props.auth.organization_details.name : 'No Organization'}</span> <span className="mdi mdi-menu-down"></span></a>
                <div className="dropdown-menu" aria-labelledby="dropdownOrganizationButton">
                  <Link to={R.ORGANIZATIONS} className="dropdown-item" onClick={this.toggleOrgs}>Manage Organizations</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col right-side">
            <div className={'dropdown' + (this.state.accountOpen ? ' show' : '')}>
              <a className="user-avatar dropdown-toggle" id="dropdownAccountButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded={this.state.accountOpen} onClick={this.toggleAccount}><img src={this.getPhotoUrl(this.props.auth.profile)} /></a>
              <div className="account-menu dropdown-menu dropdown-menu-right" aria-labelledby="dropdownAccountButton">
                <div className="account-info">
                  <div className="user-image-wrapper">
                    <Link to={R.SETTINGS_ACCOUNT} className="user-image">
                      <img src={this.getPhotoUrl(this.props.auth.profile)} />
                    </Link>
                  </div>
                  <div className="user-details-wrapper">
                    <div className="user-name" id={this.props.auth.profile.uid}><b>{this.props.auth.profile.displayName}</b></div>
                    <div className="user-email">{this.props.auth.profile.email}</div>
                    <div className="user-privacy">
                      <Link to={R.TERMS}>Univers Profile</Link>–<Link to={R.PRIVACY}>Privacy</Link>
                    </div>
                    <div className="user-actions"><Link to={R.SETTINGS_ACCOUNT} className="btn btn-sm btn-primary">My Account</Link></div>
                  </div>
                </div>
                <div className="account-actions text-right">
                  <a href onClick={this.handleLogout} className="btn btn-default"><i className="mdi mdi-logout"></i> Logout</a>
                </div>
              </div>
            </div>
            <div className={'dropdown' + (this.state.dotsOpen ? ' show' : '')}>
              <a className="dots" data-toggle="dropdown" aria-haspopup="true" aria-expanded={this.state.dotsOpen} onClick={this.toggleDots}>
                <i className="mdi mdi-dots-vertical"></i>
              </a>
              <div className="dots-menu dropdown-menu dropdown-menu-right">
                <a href="#" className="dropdown-item">Go to docs</a>
              </div>
            </div>
            <div className={'dropdown' + (this.state.notificationsOpen ? ' show' : '')}>
              <a className="notifications" data-toggle="dropdown" aria-haspopup="true" aria-expanded={this.state.notificationsOpen} onClick={this.toggleNotifications}>
                {this.state.notificationCount ? <span>{this.state.notificationCount}</span> : null}
                <i className="mdi mdi-bell"></i>
              </a>
              <div className="notifications-menu dropdown-menu dropdown-menu-right">
                {notifications}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ConsoleHeader
