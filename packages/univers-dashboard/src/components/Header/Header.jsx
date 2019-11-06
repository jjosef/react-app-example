import React from 'react'
import { IndexLink, Link } from 'react-router'
import { connect } from 'react-redux'
import { removeError } from 'react-univers-notifications'
import './Header.scss'

export class Header extends React.Component {
  constructor(props) {
    super(props);

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(evt) {
    this.props.removeError(evt.target.dataset.index);
  }

  render() {
    return (
      <div className="header">
        <div className="error alerts">
          {this.props.notifications.errors.map((err, index) => {
            let indexAttr = {'data-index': index};
            return (<div key={index} className="alert">{err} <a {...indexAttr} className="close" onClick={this.handleClose}>&#10006;</a></div>)
          })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
	return { notifications: state.notifications };
};

const mapDispatchToProps = {
  removeError
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)
