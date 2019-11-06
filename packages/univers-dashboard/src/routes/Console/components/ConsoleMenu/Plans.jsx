import React from 'react';
import './Plans.scss';

export class Plans extends React.Component {
  constructor(props) {
    super(props);

    this.elm = null;
  }

  handleScroll($evt) {
    $evt.preventDefault();
    $evt.stopPropagation();
  }

  enableScroll($evt) {
    $evt.stopPropagation();
  }

  /*
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('wheel', this.handleScroll);
    this.elm = document.querySelector('.plan-options-modal');
    if(!this.elm) {
      console.log('Can\'t find modal window');
      return;
    }
    this.elm.addEventListener('scroll', this.enableScroll);
    this.elm.addEventListener('wheel', this.enableScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('wheel', this.handleScroll);
    if(this.elm) {
      this.elm.removeEventListener('scroll', this.enableScroll);
      this.elm.removeEventListener('wheel', this.enableScroll);
    }
  }
  */

  handleClose($evt) {
    if($evt.currentTarget.className.indexOf('plan-options-modal-wrapper') > -1) {
      $evt.stopPropagation();
      if($evt.target.className.indexOf('plan-options-modal-wrapper') === -1) {
        return;
      }
      this.props.closePortal($evt);
    }
  }

  render() {
    return (
      <div className="option-modal-wrapper plan-options-modal-wrapper" onClick={this.handleClose.bind(this)}>
        <div className="option-modal plan-options-modal">
          <div className="plan-top"></div>
          <div className="plans">
            <div className="plan-wrapper">
              <div className="plan">
                <div className="name-price">
                  <h3>Spark</h3>
                  <h2>Free $0/month</h2>
                </div>
                <div className="options">
                  <ul>
                    <li className="enabled"><i className="mdi mdi-file-presentation-box" /><span>Usage quotas for Database, Storage, Hosting, and Test Lab</span></li>
                    <li className="disabled"><i className="mdi mdi-close" /><span>Ability to extend your project with Google Cloud Platform</span></li>
                  </ul>
                </div>
                <div className="features">
                  <ul>
                    <li className="bonus"><i className="mdi mdi-check" /><span>Included in all plans</span></li>
                    <li><i /><span>Analytics, Notifications, Crash Reporting, support, and more</span></li>
                  </ul>
                </div>
                <div className="more-info">
                  <a href>See full plan details <i className="mdi mdi-open-in-new"></i></a>
                </div>
                <div className="plan-selection">
                  <button className="btn btn-default disabled">Current Plan</button>
                </div>
              </div>
            </div>

            <div className="plan-wrapper">
              <div className="plan">
                <div className="name-price">
                  <h3>Flame</h3>
                  <h2>Fixed $25/month</h2>
                </div>
                <div className="options">
                  <ul>
                    <li className="enabled"><i className="mdi mdi-file-presentation-box" /><span>Double the Database, Storage, and Hosting space of Spark</span></li>
                    <li className="disabled"><i className="mdi mdi-close" /><span>Ability to extend your project with Google Cloud Platform</span></li>
                  </ul>
                </div>
                <div className="features">
                  <ul>
                    <li className="bonus"><i className="mdi mdi-check" /><span>Included in all plans</span></li>
                    <li><i /><span>Analytics, Notifications, Crash Reporting, support, and more</span></li>
                  </ul>
                </div>
                <div className="more-info">
                  <a href>See full plan details <i className="mdi mdi-open-in-new"></i></a>
                </div>
                <div className="plan-selection">
                  <button className="btn btn-primary">Select Plan</button>
                </div>
              </div>
            </div>

            <div className="plan-wrapper">
              <div className="plan">
                <div className="name-price">
                  <h3>Blaze</h3>
                  <h2>Pay as you go</h2>
                </div>
                <div className="options">
                  <ul>
                    <li className="enabled"><i className="mdi mdi-file-presentation-box" /><span>No quotas for Database, Storage, Hosting, and Test Lab</span></li>
                    <li className="enabled"><i className="mdi mdi-close" /><span>Ability to extend your project with Google Cloud Platform</span></li>
                  </ul>
                </div>
                <div className="features">
                  <ul>
                    <li className="bonus"><i className="mdi mdi-check" /><span>Included in all plans</span></li>
                    <li><i /><span>Analytics, Notifications, Crash Reporting, support, and more</span></li>
                  </ul>
                </div>
                <div className="more-info">
                  <a href>See full plan details <i className="mdi mdi-open-in-new"></i></a>
                </div>
                <div className="plan-selection">
                  <button className="btn btn-primary">Select Plan</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
