import React from 'react'
import { Link } from 'react-router';
import { routeStates as R } from '~/constants/';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Crud from 'react-univers-crud';
import { dbActions, constants } from 'react-univers-database';
import { CrudHeader } from 'react-univers-crud';
import { FormView, CRUD } from './components/Form';

const D = constants.database;

export class Root extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="console-module">
        <CrudHeader {...CRUD} {...this.props} />
        <FormView params={this.props.params} currentAction="static" database={this.props.database} auth={this.props.auth} dbActions={this.props.dbActions} router={this.props.router} />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
	return {
    auth: state.auth,
    database: state.database
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dbActions: bindActionCreators(dbActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
