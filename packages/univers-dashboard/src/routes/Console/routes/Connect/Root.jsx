import React from 'react'
import { Link } from 'react-router';
import { database as D, routeStates as R } from '~/constants/';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import Crud, { CrudHeader } from 'react-univers-crud';
import { dbActions } from 'react-univers-database';
import { FormView, CRUD } from './components/Form';

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
