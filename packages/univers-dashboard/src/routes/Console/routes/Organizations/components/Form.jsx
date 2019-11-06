import React from 'react';
import { auth as A, routeStates as R } from '~/constants/';
import firebase from 'firebase';
import Crud from 'react-univers-crud';

class CurrentOrganization extends React.Component {
  constructor(props) {
    super(props);
    // props.rowData should have the info on this table row in CRUD
    this.handleSwitchOrganization = this.handleSwitchOrganization.bind(this);
  }

  handleSwitchOrganization(evt) {
    evt.stopPropagation();
    this.props.authActions.switchOrganization(evt.target.dataset.organizationId);
  }

  render() {
    return (
      <p>{this.props.id === this.props.auth.organization ? 'Active' : <button className="btn btn-primary" data-organization-id={this.props.id} onClick={this.handleSwitchOrganization}>Switch</button>}</p>
    )
  }
}

export const Form = {
  name: {label: 'Name', type: 'input', required: true},
  description: {label: 'Description', type: 'wysiwyg'}
}

export const Table = {
  name: {label: 'Name', type: 'text'},
  current: {label: 'Currently Active', type: 'custom', component: CurrentOrganization}
}

export const CRUD = {
  db: 'organizations',
  name: 'organizations',
  permissions: [],
  actions: {create: R.ORGANIZATIONS_NEW, update: R.ORGANIZATIONS_EDIT, list: R.ORGANIZATIONS, remove: null},
  editParam: 'organization_id',
  currentAction: 'list',
  form: Form,
  table: Table,
  afterCreate: (result) => {
    firebase.database().ref(`/organization_users/${firebase.auth().currentUser.uid}`).set(result.id);
    firebase.database().ref(`/user_permissions/${firebase.auth().currentUser.uid}/${result.id}`)
      .set(A.OWNER_PERMISSIONS).then((result) => {
    });
  },
  afterList: (result, auth) => {
    let newObj = {};
    result.forEach((item) => {
      if(auth.permissions[item.key] || auth.admin) {
        newObj[item.key] = item.val();
      }
    });
    return newObj;
  }
};

export class FormView extends React.Component {
  constructor(props) {
    super(props);

    if(props.values) {
      for(key in props.values) {
        Form[key].value = props.values[key];
      }
    }
  }

  render() {
    return (
      <Crud {...this.props} />
    )
  }
}

FormView.defaultProps = CRUD;
