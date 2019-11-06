import React from 'react'
import { Link } from 'react-router';
import './ConsoleView.scss'
import { connect } from 'react-redux';
import { logoutUser, constants } from 'react-univers-auth';
import { routeStates as R } from '~/constants/';
import ConsoleHeader from './ConsoleHeader/ConsoleHeader'
import ConsoleMenu from './ConsoleMenu/ConsoleMenu'
import ConsoleDashboard from './ConsoleDashboard/ConsoleDashboard'

const A = constants.auth;

export class ConsoleView extends React.Component {
  constructor(props) {
    super(props);

    if(props.auth.loaded && props.auth.status !== A.AUTH_LOGGED_IN) {
      props.router.replace(R.HOME);
    }
    this.state = {
      mql: null,
      sidebarOpen: true
    }

    this.handleToggleMenu = this.handleToggleMenu.bind(this);
  }

  ifLoggedIn(props) {
    if(!props.auth.loaded) return;
    if(props.auth.status !== A.AUTH_LOGGED_IN) {
      props.router.replace(R.HOME);
    }
  }

  handleToggleMenu(open) {
    this.setState({sidebarOpen: !this.state.sidebarOpen});
  }

  componentWillMount() {
    this.ifLoggedIn(this.props);
    let mql = window.matchMedia(`(min-width: 800px)`);
    mql.addListener(this.mediaQueryChanged);
    this.setState({mql: mql, sidebarOpen: mql.matches});
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }

  mediaQueryChanged() {
    this.setState({sidebarOpen: this.state.mql.matches});
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.ifLoggedIn(nextProps);
  }

  render() {
    if(!this.props.auth.profile) {
      return <div className="loading"><span className="loader"></span></div>;
    }
    return (
      <div className={'console ' + (this.state.sidebarOpen ? 'menu-open' : 'menu-closed')}>
        <ConsoleHeader logoutUser={this.props.logoutUser} auth={this.props.auth} />
        <ConsoleMenu auth={this.props.auth} sidebarOpen={this.state.sidebarOpen} toggleMenu={this.handleToggleMenu} />
        <div className="console-content">
          {this.props.children || <ConsoleDashboard />}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
	return { auth: state.auth };
};

const mapDispatchToProps = {
  logoutUser
};

export default connect(mapStateToProps, mapDispatchToProps)(ConsoleView)
