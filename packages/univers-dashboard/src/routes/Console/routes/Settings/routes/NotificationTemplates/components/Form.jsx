import React from 'react';
import { routeStates as R } from '~/constants/';
import Crud from 'react-univers-crud';
import { Layout } from './Layout';

export const Form = {
  nameAndType: {type: 'group', children: {
    name: {label: 'Name', type: 'input', required: true},
    type: {label: 'Type', type: 'select', choices: [
      {value: 'email', name: 'Email'},
      {value: 'internal', name: 'Internal'}
    ]}
  }},
  contentHolder: {type: 'group', children: {
    content: {label: 'Content', type: 'textarea', options: {rows: 8}}
  }}
}

export const Table = {
  name: {label: 'Name', type: 'text'},
  type: {label: 'Type', type: 'text'}
}

export const CRUD = {
  db: 'notification_templates',
  name: 'Notification Templates',
  permissions: [],
  actions: {create: R.NOTIFICATION_TEMPLATES_NEW, update: R.NOTIFICATION_TEMPLATES_EDIT, list: R.NOTIFICATION_TEMPLATES, remove: null},
  editParam: 'notification_template_id',
  currentAction: 'list',
  requiresOrganization: true,
  enableSearch: true,
  form: Form,
  formLayout: Layout,
  table: Table
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
