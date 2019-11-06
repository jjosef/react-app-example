import React from 'react'
import { Link } from 'react-router';
import './styles.scss'
import { database as D, routeStates as R } from '~/constants/';
import { connect } from 'react-redux';

export class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="product-inventory console-module"></div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
	return { database: state.database };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Root)
