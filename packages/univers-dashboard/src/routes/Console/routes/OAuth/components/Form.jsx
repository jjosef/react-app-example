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
  name: 'OAuth Connector',
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
      message: null
    };

    this._provider = props.params.provider;
    this._query = qs.parse(location.search);
    console.log(this._query);
  }

  componentWillMount() {
    firebase.database().ref(`${CRUD.db}/${this.props.auth.organization}`).once('value').then((snapshot) => {
      this._settings = snapshot.val();
      console.log(this._settings);
      if(!this._settings[this._provider]) {
        return this.setState({
          working: false,
          error: 'Provider does not exist in application settings, try enabling it first and reconnect'
        });
      }

      firebase.auth().currentUser.getIdToken().then((token) => {
        axios.post(S.url('functions', `/oAuthProviders-${this._provider}/authorize_token`),
        {
          code: this._query.code
        },
        {headers: {
          'Authorization': 'Bearer ' + token
        }}).then((res) => {
          // access_token and refresh_token should be in res.data.tokenData
          firebase.database().ref(`${CRUD.db}/${this.props.auth.organization}/${this._provider}/`).update({
            active: true,
            options: {
              access_token: res.data.tokenData.access_token,
              refresh_token: res.data.tokenData.refresh_token
            }
          });
          return this.setState({
            working: false,
            error: null
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
    }).catch((err) => {
      console.log(err);
      this.props.router.replace('/console');
    });
  }

  render() {

    let workingDom;
    if(this.state.working) {
      workingDom = (
        <div className="alert alert-info"><b>Hold up!</b> We're completing setup for this connection</div>
      )
    } else if(this.state.error) {
      workingDom = (
        <div className="alert alert-danger"><strong>An error occurred: </strong>{this.state.error}</div>
      )
    } else {
      workingDom = (
        <div className="alert alert-success"><strong>Success!</strong> You've connected {this._provider}!</div>
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
