import React from 'react';
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router';
import Portal from 'react-portal';
import { connect } from 'react-redux';
import { logoutUser } from 'react-univers-auth';
import { routeStates as R } from '~/constants/';
import { Plans } from './Plans';
import './ConsoleMenu.scss';

class MenuLinkPre extends React.Component {
  render() {
    const {children, router, to, name, indexOnly = false, activeClassName = "active", icon = " mdi mdi-home", className = '', permissions = {}, ...props} = this.props;

    if(Object.keys(permissions).length) {
      if(!props.auth.permissions) return null;

      if(!props.auth.permissions.admin) {
        for(let i in permissions) {
          if(i === 'admin') {
            if(!props.auth.permissions.admin) {
              return null;
            }
          }

          // if i is 'owner' check org ownership
          if(!props.auth.permissinos[props.auth.organization].owner) {
            return null;
          }

          // if user permissions for i does not have read permission return null
          if(!props.auth.permissions[props.auth.organization][i].r) {
            return null;
          }
        }
      }
    }

    let active;
    if(indexOnly) {
      active = (router.location.pathname === to);
    } else {
      active = !(to === R.CONSOLE) && (router.location.pathname.indexOf(to) > -1);
    }

    return (
      <li className={active ? 'active ' + className : className}>
        <Link to={to} onlyActiveOnIndex={indexOnly} activeClassName={activeClassName}><i className={icon}></i><span>{name}</span></Link>
        {children}
      </li>
    );
  }
}

MenuLinkPre.propTypes = {
  router: PropTypes.object
}

const mapStateToProps = (state) => {
	return { auth: state.auth };
};

const mapDispatchToProps = {
  logoutUser
};

MenuLinkPre = connect(mapStateToProps, mapDispatchToProps)(MenuLinkPre);

export const MenuLink = withRouter(MenuLinkPre);

export class ConsoleMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsOpen: false
    };

    this.toggleSettings = this.toggleSettings.bind(this);
  }

  toggleSettings(evt) {
    let state = this.state;
    state.settingsOpen = !this.state.settingsOpen;

    this.setState(state);
  }

  render() {
    let {router, ...props} = this.props;
    let upgradeButton = <Link to={R.ORGANIZATIONS} className="change-plan btn btn-secondary">Upgrade</Link>;

    let sidebarContent = (
      <div className={'menu-container'}>
        <ul className="menu">
          <MenuLink to={R.CONSOLE} indexOnly={true} name="Overview" className="console-link"></MenuLink>
          <MenuLink to={R.parse(R.ORDERS, {type: 'pending'})} name="Sales" icon="mdi mdi-coin">
            {/*
            <ul className={(router.location.pathname.indexOf(R.ORDERS) > -1) ? 'active' : ''}>
              <MenuLink to={R.parse(R.ORDERS_TYPE, {type: 'pending'})} indexOnly={true} name="Pending" />
              <MenuLink to={R.parse(R.ORDERS_TYPE, {type: 'fulfilled'})} indexOnly={true} name="Fulfilled" />
              <MenuLink to={R.parse(R.ORDERS_TYPE, {type: 'archived'})} indexOnly={true} name="Archived" />
              <MenuLink to={R.parse(R.ORDERS_TYPE, {type: 'cancelled'})} indexOnly={true} name="Cancelled" />
            </ul>
            */}
          </MenuLink>
          <MenuLink to={R.PRODUCTS} name="Items" icon="mdi mdi-cube-outline">
            {/*
            <ul className={(router.location.pathname.indexOf(R.PRODUCTS) > -1) ? 'active' : ''}>
              <MenuLink to={R.PRODUCTS} indexOnly={true} name="Item List" />
              <MenuLink to={R.PRODUCT_CATEGORIES} name="Categories" />
              <MenuLink to={R.PRODUCT_INVENTORY} name="Inventory" />
            </ul>
            */}
          </MenuLink>
          <MenuLink to={R.STAFF} name="Staff" icon="mdi mdi-clipboard-account" />
          <MenuLink to={R.CUSTOMERS} name="Customers" icon="mdi mdi-account" />
          <MenuLink to={R.DISCOUNTS} name="Discounts" icon="mdi mdi-tag-outline" />

          <li className="break"><span>Settings</span></li>

          <MenuLink to={R.NOTIFICATION_TEMPLATES} name="Notification Templates" icon="mdi mdi-message-bulleted" />
          <MenuLink to={R.SETTINGS_ORGANIZATION} name="Organization" icon="mdi mdi-domain" />
          <MenuLink to={R.SETTINGS_PAYMENTS} name="Payments" icon="mdi mdi-bank" />
          <MenuLink to={R.SETTINGS_SONAR} name="Sonar" icon="mdi mdi-radar" />

          <li className="break"><span>Shipping</span></li>

          <MenuLink to={R.SHIPPING_CARRIERS} indexOnly={true} name="Carriers" icon="mdi mdi-plane-shield" />

          <li className="break"><span>Integrations</span></li>

          <MenuLink to={R.INTEGRATIONS_APPS} indexOnly={true} name="Apps" icon="mdi mdi-cellphone-link" />
          <MenuLink to={R.INTEGRATIONS_DESIGN} name="Design" icon="mdi mdi-format-color-fill" />
          <MenuLink to={R.INTEGRATIONS_SCRIPTS} name="Scripts" icon="mdi mdi-script" />
          <MenuLink to={R.INTEGRATIONS_WEBHOOKS} name="Webhooks" icon="mdi mdi-wrap" />

          <li className="break"></li>

        </ul>
        <div className="promo">
          <div className="current-plan row">
            <div className="col">
              <div className="plan-wrapper">
                <div className="plan-name">Spark</div>
                <div className="plan-rates">Free $0/month</div>
              </div>
            </div>
            <div className="col">
              <div className="text-right upgrade">
                <Portal closeOnEsc closeOnOutsideClick openByClickOn={upgradeButton}>
                  <Plans></Plans>
                </Portal>
              </div>
            </div>
          </div>
          <div className="menu-slide">
            <a onClick={this.props.toggleMenu}><i className={'mdi ' + (this.props.sidebarOpen ? 'mdi-chevron-left' : 'mdi-chevron-right')} /></a>
          </div>
        </div>
      </div>
    )

    /**
    <MenuLink to={R.CAPITAL} name="Capital" />
    <MenuLink to={R.LOCAL_DELIVERY} name="Local Delivery" />
    <MenuLink to={R.MARKETING} name="Marketing" />
    <MenuLink to={R.PAYROLL} name="Payroll" />
    <MenuLink to={R.PORTALS} name="Portals" />
    <MenuLink to={R.REPORTING} name="Reporting" />
    <MenuLink to={R.SCHEDULING} name="Scheduling" />
    <MenuLink to={R.TIMECARDS} name="Timecards" />
    **/

    let children = [];

    return (
      <div className="console-menu">
        <div className="options-holder">
          <div className={'dropdown' + (this.state.settingsOpen ? ' show' : '')}>
            <a className="settings-select dropdown-toggle" id="dropdownSettingsButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded={this.state.settingsOpen} onClick={this.toggleSettings}><i className="mdi mdi-settings"></i></a>
            <div className="dropdown-menu" aria-labelledby="dropdownSettingsButton">
              <Link to={R.ORGANIZATIONS} className="dropdown-item" onClick={this.toggleSettings}> Settings</Link>
            </div>
          </div>
        </div>
        {sidebarContent}
      </div>
    )
  }
}

export default withRouter(ConsoleMenu)
