import React from 'react'
import { Link } from 'react-router';
import Portal from 'react-portal';
import { routeStates as R } from '~/constants/';
import './ConsoleDashboard.scss'
import { LearnMore } from './LearnMore';

export class ConsoleDashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let children = [];

    let learnMoreButton = <button href className="btn btn-link learn-more">Learn More</button>;

    return (
      <div className="console-dashboard">
        <div className="dashboard-header">
          <div className="row">
            <div className="col">
              <h3>Overview</h3>
            </div>
            <div className="col text-right">
              <a href className="help">
                <i className="mdi mdi-help-circle"></i>
                <i className="mdi mdi-menu-down"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="dashboard-intro">
          <h2>Welcome to Univers! Get started here.</h2>
          <div className="u-badges">
            <div className="u-badge-wrapper one">
              <div className="u-badge"><i className="mdi mdi-apple-ios" /></div>
              <div className="u-badge-text">Add Univers to your iOS app</div>
            </div>
            <div className="u-badge-wrapper two">
              <div className="u-badge"><i className="mdi mdi-android-debug-bridge" /></div>
              <div className="u-badge-text">Add Univers to your Android app</div>
            </div>
            <div className="u-badge-wrapper three">
              <div className="u-badge"><i className="mdi mdi-application" /></div>
              <div className="u-badge-text">Add Univers to your Web app</div>
            </div>
            <div className="u-badge-wrapper four">
              <div className="u-badge"><i className="mdi mdi-access-point-network" /></div>
              <div className="u-badge-text">Add Univers to your API</div>
            </div>
          </div>
        </div>

        <div className="dashboard-tiles">
          <div className="tile-container container">
            <div className="row">
              <div className="col">
                <div className="feature-heading">
                  Discover Univers
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-4">

                <div className="card">
                  <img className="card-img-top" src="https://www.gstatic.com/mobilesdk/160505_mobilesdk/discoverycards/2x/analytics.png" alt="Sales" />
                  <div className="card-block">
                    <h4 className="card-title">Sales</h4>
                    <p className="card-text">Get detailed analytics to measure and analyze how users engage with your app</p>
                  </div>
                  <div className="card-block links">
                    <Portal closeOnEsc closeOnOutsideClick openByClickOn={learnMoreButton}>
                      <LearnMore name="Sales"></LearnMore>
                    </Portal>
                    <Link to={R.ORDERS} className="btn btn-secondary get-started">Get Started</Link>
                  </div>
                </div>

              </div>
              <div className="col-4">

                <div className="card">
                  <img className="card-img-top" src="https://www.gstatic.com/mobilesdk/160505_mobilesdk/discoverycards/2x/auth.png" alt="Staff" />
                  <div className="card-block">
                    <h4 className="card-title">Staff</h4>
                    <p className="card-text">Get detailed analytics to measure and analyze how users engage with your app</p>
                  </div>
                  <div className="card-block links">
                    <Portal closeOnEsc closeOnOutsideClick openByClickOn={learnMoreButton}>
                      <LearnMore name="Staff"></LearnMore>
                    </Portal>
                    <Link to={R.STAFF} className="btn btn-secondary get-started">Get Started</Link>
                  </div>
                </div>

              </div>
              <div className="col-4">

                <div className="card">
                  <img className="card-img-top" src="https://www.gstatic.com/mobilesdk/160505_mobilesdk/discoverycards/2x/config.png" alt="Apps" />
                  <div className="card-block">
                    <h4 className="card-title">Apps</h4>
                    <p className="card-text">Get detailed analytics to measure and analyze how users engage with your app</p>
                  </div>
                  <div className="card-block links">
                    <Portal closeOnEsc closeOnOutsideClick openByClickOn={learnMoreButton}>
                      <LearnMore name="Apps"></LearnMore>
                    </Portal>
                    <Link to={R.INTEGRATIONS_APPS} className="btn btn-secondary get-started">Get Started</Link>
                  </div>
                </div>

              </div>

              <div className="col-4">

                <div className="card">
                  <img className="card-img-top" src="https://www.gstatic.com/mobilesdk/160921_mobilesdk/discoverycards/2x/appindexing.png" alt="Reporting" />
                  <div className="card-block">
                    <h4 className="card-title">Reporting</h4>
                    <p className="card-text">Get detailed analytics to measure and analyze how users engage with your app</p>
                  </div>
                  <div className="card-block links">
                    <Portal closeOnEsc closeOnOutsideClick openByClickOn={learnMoreButton}>
                      <LearnMore name="Reporting"></LearnMore>
                    </Portal>
                    <Link to={R.INTEGRATIONS_APPS} className="btn btn-secondary get-started">Coming Soon</Link>
                  </div>
                </div>

              </div>
              <div className="col-4">

                <div className="card">
                  <img className="card-img-top" src="https://www.gstatic.com/mobilesdk/160921_mobilesdk/discoverycards/2x/awrds.png" alt="Analytics" />
                  <div className="card-block">
                    <h4 className="card-title">Analytics</h4>
                    <p className="card-text">Get detailed analytics to measure and analyze how users engage with your app</p>
                  </div>
                  <div className="card-block links">
                    <Portal closeOnEsc closeOnOutsideClick openByClickOn={learnMoreButton}>
                      <LearnMore name="Analytics"></LearnMore>
                    </Portal>
                    <Link to={R.INTEGRATIONS_APPS} className="btn btn-secondary get-started">Coming Soon</Link>
                  </div>
                </div>

              </div>
              <div className="col-4">

                <div className="card">
                  <img className="card-img-top" src="https://www.gstatic.com/mobilesdk/160921_mobilesdk/discoverycards/2x/cloudmessaging.png" alt="Notifications" />
                  <div className="card-block">
                    <h4 className="card-title">Notifications</h4>
                    <p className="card-text">Get detailed analytics to measure and analyze how users engage with your app</p>
                  </div>
                  <div className="card-block links">
                    <Portal closeOnEsc closeOnOutsideClick openByClickOn={learnMoreButton}>
                      <LearnMore name="Notifications"></LearnMore>
                    </Portal>
                    <Link to={R.ACCOUNT_NOTIFICATIONS} className="btn btn-secondary get-started">Get Started</Link>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default ConsoleDashboard
