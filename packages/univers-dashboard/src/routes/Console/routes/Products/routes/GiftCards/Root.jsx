import React from 'react'
import { Link } from 'react-router';
import './styles.scss'
import { database as D, routeStates as R } from '~/constants/';
import { connect } from 'react-redux';
import Crud from 'react-univers-crud';
import { FormView, CRUD } from './components/Form';

export class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="console-module">
        {this.props.children || <FormView {...this.props} />}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
	return { auth: state.auth, database: state.database };
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Root)
