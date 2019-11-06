import React from 'react';
import { routeStates as R, locations as L } from '~/constants/';
import Crud from 'react-univers-crud';

export const Form = {
  nameAndBasics: {type: 'group', children: {
    type: {label: 'Type', type: 'tags', suggestions: [
      {name: 'Online', id: 'online'},
      {name: 'Manufacturer', id: 'manufacturer'},
      {name: 'Retail', id: 'retail'},
      {name: 'Affiliate', id: 'affiliate'}
    ], options: {placeholder: 'Enter types: \'Online\', \'Manufacturer\', \'Retail\', \'Affiliate\'', minQueryLength: 1}},
    company: {label: 'Company', type: 'input', required: true},
    name: {label: 'Contact Name', type: 'input', required: true},
    email: {label: 'Email', type: 'input', inputType: 'email', required: true},
    phone: {label: 'Phone', type: 'input', inputType: 'tel'},
    address: {
      address_1: {label: 'Address', type: 'input'},
      address_2: {label: 'Address (cont)', type: 'input'},
      city: {label: 'City', type: 'input'},
      state_code: {label: 'State/Province', type: 'select', choices: L.states},
      postal_code: {label: 'Postal Code', type: 'input'},
      country_code: {label: 'Country', type: 'select', choices: L.countries}
    },
    login_uid: {label: 'Firebase Login UID', type: 'input'}
  }},
}

export const Table = {
  company: {label: 'Company', type: 'text'},
  name: {label: 'Contact Name', type: 'text'},
  email: {label: 'Email', type: 'text'},
  phone: {label: 'Phone', type: 'text'}
}

export const CRUD = {
  db: 'customers',
  name: 'customers',
  permissions: [],
  actions: {create: R.CUSTOMERS_NEW, update: R.CUSTOMERS_EDIT, list: R.CUSTOMERS, remove: null},
  editParam: 'customer_id',
  currentAction: 'list',
  requiresOrganization: true,
  form: Form,
  table: Table,
  listFilters: function(props, auth) {
    return [{
      key: 'type', value: props.params.type, operator: 'in', objectKey: 'id'
    }];
  },
  subMenu: [
    {name: 'Online', route: R.parse(R.CUSTOMERS_TYPE, {type: 'online'})},
    {name: 'Manufacturers', route: R.parse(R.CUSTOMERS_TYPE, {type: 'manufacturer'})},
    {name: 'Retailers', route: R.parse(R.CUSTOMERS_TYPE, {type: 'retail'})},
    {name: 'Affiliates', route: R.parse(R.CUSTOMERS_TYPE, {type: 'affiliate'})}
  ],
  enableSearch: true
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
