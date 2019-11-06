import React from 'react';
import axios from 'axios';
import { services as S, routeStates as R } from '~/constants/';
import Crud from 'react-univers-crud';
import firebase from 'firebase';
import { Permissions } from './Permissions';

export const Form = {
  nameAndEmail: {label: 'Invite a User', type: 'group', children: {
    name: {label: 'Name', type: 'input', required: true},
    email: {label: 'Email', type: 'input', inputType: 'email', required: true},
    firebase_uid: {label: 'Firebase UID', type: 'input'}
  }},
  permissions: {label: 'Permissions', type: 'custom', component: Permissions, options: {
    owner: {default: false, singular: true},
    orders: {
      r: {default: false},
      w: {default: false},
    },
    products: {
      r: {default: false},
      w: {default: false},
    },
    customers: {
      r: {default: false},
      w: {default: false},
    },
    settings: {
      r: {default: false},
      w: {default: false},
    },
    discounts: {
      r: {default: false},
      w: {default: false},
    },
    integrations: {
      r: {default: false},
      w: {default: false},
    }
  }}
}

export const Table = {
  name: {label: 'Name', type: 'text'},
  email: {label: 'Email', type: 'text'},
  invited: {label: 'Status', type: 'custom', component: ({data, ...props}) => (
    <span>{data.invited ? 'Pending Invite' : 'Accepted'}</span>
  )}
}

export const CRUD = {
  db: 'staff',
  name: 'staff',
  permissions: [],
  actions: {create: R.STAFF_NEW, update: R.STAFF_EDIT, list: R.STAFF, remove: null},
  editParam: 'staff_id',
  currentAction: 'list',
  requiresOrganization: true,
  enableSearch: true,
  form: Form,
  table: Table,
  beforeCreate: (ref, data) => {
    return new Promise((resolve, reject) => {
      data.invited = true;
      return resolve({ref, data});
    });
  },
  afterCreate: (result, authDetails) => {
    // send notification to invited user
    firebase.auth().currentUser.getIdToken().then((token) => {

      let data = {
        organization: authDetails.organization,
        to: result.email,
        subject: 'You are invited to ' + authDetails.organization_details.name,
        htmlMessage: '<html><head></head><body>Hey ' + result.name + ', <br /><br />You have been invited to ' + authDetails.organization_details.name + '. <a href="' + window.location.protocol + '//' + window.location.host + R.parse(R.JOIN_ORGANIZATION, {organization_id: authDetails.organization, invite_code: result.id}) + '">Click here to join!</a></body></html>'
      };

      axios.post(S.url('functions', '/utilities-notifier'),
                 data,
                 {headers: {
                   'Authorization': 'Bearer ' + token
                 }});
    }).catch((err) => {
      console.log(err);
    });
  },
  afterUpdate: (result, authDetails) => {
    if(!result.firebase_uid) return;
    // set the user's permissions if we have them.
    firebase.database().ref(`/user_permissions/${result.firebase_uid}/${authDetails.organization}`).set(result.permissions);
  },
  subMenu: [
    {name: 'Members', route: R.STAFF, indexOnly: true},
    //{name: 'Permissions', route: R.PERMISSIONS}
  ]
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
