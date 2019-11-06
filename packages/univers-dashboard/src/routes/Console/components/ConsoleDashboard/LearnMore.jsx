import React from 'react';
import './LearnMore.scss';

export class LearnMore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {name: props.name || 'Section'};

    this.elm = null;
  }

  handleScroll($evt) {
    $evt.preventDefault();
    $evt.stopPropagation();
  }

  enableScroll($evt) {
    $evt.stopPropagation();
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('wheel', this.handleScroll);
    this.elm = document.querySelector('.learn-more-modal');
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

  handleClose($evt) {
    if($evt.currentTarget.className.indexOf('learn-more-modal-wrapper') > -1) {
      $evt.stopPropagation();
      this.props.closePortal($evt);
    }
  }

  render() {
    return (
      <div className="option-modal-wrapper learn-more-modal-wrapper" onClick={this.handleClose.bind(this)}>
        <div className="option-modal learn-more-modal">
          <div className="learn-more-top"></div>
          <div className="learn-more">
            <div className="learn-wrapper">

              <div className="learn">
                <div className="name-price">
                  <h3>Documentation</h3>
                  <h2>{this.state.name}</h2>
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
                  <a href>See full documentation details <i className="mdi mdi-open-in-new"></i></a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
