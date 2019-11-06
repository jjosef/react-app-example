import React from 'react';
import { database as D, routeStates as R } from '~/constants/';
import Crud from 'react-univers-crud';
import firebase from 'firebase';
import immutable from 'object-path-immutable';

export const Form = {

}

export const CRUD = {
  db: 'organization_scripts',
  name: 'Scripts',
  permissions: [],
  requiresOrganization: true,
  form: Form
};

export class FormView extends React.Component {
  constructor(props) {
    super(props);

    if(props.values) {
      for(key in props.values) {
        Form[key].value = props.values[key];
      }
    }

    this.state = {
      hostname: '',
      hostnames: {}
    }
  }

  componentWillMount() {
    firebase.database().ref(`${CRUD.db}/${this.props.auth.organization}`).once('value', this.handleGetData.bind(this));
  }

  componentWillReceiveProps(newProps, oldProps) {
    console.log(newProps.database.status);
    switch(newProps.database.status) {
      case D.DB_SAVED:
        // update list
        firebase.database().ref(`${CRUD.db}/${this.props.auth.organization}`).once('value', this.handleGetData.bind(this));
      break;
      case D.DB_UPDATED:
        // update list
        firebase.database().ref(`${CRUD.db}/${this.props.auth.organization}`).once('value', this.handleGetData.bind(this));
      break;
    }
  }

  handleGetData(result) {
    this.setState(immutable.set(this.state, 'hostnames', result.val() || {}))
  }

  handleChange($evt) {
    this.setState(immutable.set(this.state, $evt.target.name, $evt.target.value));
  }

  handleSubmit($evt) {
    if($evt.key === 'Enter') {
      let seed = (Math.random()*1e16).toFixed(0);
      let cryptoObj = window.crypto || window.msCrypto;
      let apiKey;
      let hostname = this.state.hostname;
      if(cryptoObj) {
        let rands = new Uint32Array(4);
        window.crypto.getRandomValues(rands);
        apiKey = btoa(rands.join('') + hostname);
      } else {
        apiKey = btoa(unescape(encodeURIComponent(seed + hostname)));
      }

      this.props.dbActions.create(`${CRUD.db}/${this.props.auth.organization}/${apiKey}`, {hostname: hostname}, true);

      this.setState({
        hostname: ''
      });
    }
  }

  handleDelete(index, $evt) {
    firebase.database().ref(`${CRUD.db}/${this.props.auth.organization}/${index}`).remove().then(() => {
      firebase.database().ref(`${CRUD.db}/${this.props.auth.organization}`).once('value', this.handleGetData.bind(this));
    });
  }

  render() {
    let hostnames = [];
    if(Object.keys(this.state.hostnames).length > 0) {
      for(let k in this.state.hostnames) {
        let h = this.state.hostnames[k];
        hostnames.push((
          <tr key={k}>
            <td>{h.hostname}</td>
            <td>{k}</td>
            <td><a onClick={this.handleDelete.bind(this, k)}><i className="mdi mdi-delete"/></a></td>
          </tr>
        ));
      }
    } else {
      hostnames.push((
        <tr key="no-data">
          <td colSpan="3" className="text-center">No Hostnames entered</td>
        </tr>
      ));
    }
    return (
      <div className="crud-container scripts">
        <div className="crud-form-content">
          <div className="row">
            <div className="col">
              <div className="panel">
                <p className="alert alert-info"><b>Note:</b> The JavaScript API allows you to integrate Univers with other websites. Generate Keys for your websites and utilize the scripts below to create custom ecommerce solutions. <a href>Learn more<i className="mdi mdi-open-in-new"></i></a></p>
                <div className="form-group">
                  <input className="form-control" name="hostname" placeholder="Enter hostnames separated by commas" value={this.state.hostname} onChange={this.handleChange.bind(this)} onKeyPress={this.handleSubmit.bind(this)} />
                </div>
                <p>Add code to your website with the following code:</p>
                <p className="alert alert-code">&lt;script src=&quot;https://www.univers.io/jsapi/v1?API_KEY=<i>your_jsapi_key</i>&quot;&gt;&lt;/script&gt;</p>
              </div>
            </div>
          </div>
          <div className="crud-container-content panel">
            <table className="table scripts-table">
              <thead>
                <tr>
                  <th>Hostname(s)</th>
                  <th>JSAPI Key</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {hostnames}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

FormView.defaultProps = CRUD;
