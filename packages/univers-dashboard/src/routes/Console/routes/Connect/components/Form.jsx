import React from 'react';
import axios from 'axios';
import * as qs from 'query-string';
import { services as S, database as D, routeStates as R } from '~/constants/';
import Crud from 'react-univers-crud';
import firebase from 'firebase';

export const Form = {

}

export const CRUD = {
  db: 'organization_apps',
  name: 'Univers Connect',
  permissions: [],
  requiresOrganization: true,
  form: Form
};

export class FormView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      working: true,
      error: null,
      message: null,
      app: null
    };

    this._app = props.params.app;
    this._query = qs.parse(location.search);
    console.log(this._app, this._query);
  }

  checkApplication() {
    if(!firebase.auth().currentUser) return;
    firebase.auth().currentUser.getIdToken().then((token) => {
      axios.post(S.url('functions', `/connector/authorize_app`),
      {
        app: this._app,
        key: this._query.key
      },
      {headers: {
        'Authorization': 'Bearer ' + token
      }}).then((res) => {
        return this.setState({
          working: false,
          error: null,
          app: res.data
        });
      }).catch((err) => {
        console.log(err.response || err.message);
        if(err.response) {
          return this.setState({
            working: false,
            error: err.response.data.error
          });
        } else {
          return this.setState({
            working: false,
            error: err.message
          });
        }
      });
    });
  }

  componentWillMount() {
    this.checkApplication();
  }

  componentWillReceiveProps() {
    this.checkApplication();
  }

  confirmApp() {
    firebase.database().ref(`${CRUD.db}/${this.props.auth.organization}/${this._app}/`).update({
      active: true,
      options: {
        api_key: this.state.app.api_key
      },
      permissions: this.state.app.permissions
    });
    window.location.href = this._query.redirect;
  }

  render() {

    let workingDom;
    if(this.state.working) {
      workingDom = (
        <div className="alert alert-info"><b>Hold up!</b> We're verifying the application</div>
      )
    } else if(this.state.error) {
      workingDom = (
        <div className="alert alert-danger"><strong>An error occurred: </strong>{this.state.error}</div>
      )
    } else {
      workingDom = (
        <div>
          <div className="alert alert-success"><strong>{this.state.app.name}</strong> is ready to be connected</div>
          <button className="btn btn-primary" onClick={this.confirmApp.bind(this)}>Confirm</button>
          <a href={R.CONSOLE} className="btn btn-cancel">Cancel</a>
        </div>
      )
    }

    return (
      <div className="crud-container oauth">
        <div className="crud-form-content">
          <div className="row">
            <div className="col">
              <div className="panel">
                {workingDom}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

FormView.defaultProps = CRUD;
