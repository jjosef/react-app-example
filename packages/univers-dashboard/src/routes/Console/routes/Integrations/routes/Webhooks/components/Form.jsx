import React from 'react';
import { auth as A, routeStates as R } from '~/constants/';
import firebase from 'firebase';
import Crud from 'react-univers-crud';

export const Form = {
  name: {label: 'Name', type: 'input', required: true},
  event: {label: 'Event', type: 'select', choices: [
    {name: 'Orders', value: 'orders'},
    {name: 'Items/Inventory', value: 'items'},
    {name: 'Categories', value: 'categories'},
    {name: 'Gift Cards', value: 'gift-cards'},
    {name: 'Settings', value: 'settings'},
    {name: 'Apps', value: 'apps'},
    {name: 'Customers', value: 'customers'},
    {name: 'Discounts', value: 'discounts'}
  ]},
  endpoint_url: {label: 'URI', type: 'input', required: true},
  headers: {label: 'Headers', type: 'tags', options: {allowNew: true, placeholder: 'Enter key pairs, eg {"Content-Type": "application/json"}'}}
}

export const Table = {
  name: {label: 'Name', type: 'text'},
  event: {label: 'Event', type: 'text'}
}

export const CRUD = {
  db: 'webhooks',
  name: 'Webhooks',
  permissions: [],
  actions: {create: R.INTEGRATIONS_WEBHOOKS_NEW, update: R.INTEGRATIONS_WEBHOOKS_EDIT, list: R.INTEGRATIONS_WEBHOOKS, remove: null},
  editParam: 'webhook_id',
  currentAction: 'list',
  requiresOrganization: true,
  form: Form,
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
