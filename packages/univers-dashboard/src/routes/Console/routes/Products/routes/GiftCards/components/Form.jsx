import React from 'react';
import { routeStates as R } from '~/constants/';
import { Layout } from './Layout';
import { tableHeader } from './tableHeader';
import Crud from 'react-univers-crud';

const generateCode = function() {
  var characters = 'ABCDEFGHJKLMNPQRTWXYZ123456789';
  var code = '';
  for(var i = 0; i < 16; i++) {
    var rand = parseInt(Math.random() * (characters.length), 10);
    code += characters.charAt(rand);
  }

  return code;
};

export const Form = {
  nameAndTitle: {type: 'group', children: {
    to_name: {label: 'Recipient', type: 'input', required: true},
    to_email: {label: 'Recipient Email', type: 'input', inputType: 'email', required: true},
    from_name: {label: 'From Name', type: 'input', required: true},
    from_email: {label: 'From Email', type: 'input', inputType: 'email', required: true},
    message: {label: 'Message', type: 'textarea'},
  }},
  options: {type: 'group', children: {
    active: {label: 'Active', type: 'checkbox', default: true},
    code: {label: 'Discount Code', type: 'input', required: true, default: generateCode()},
    value: {label: 'Value', type: 'currency', required: true}
  }}
}

export const Table = {
  to_name: {label: 'To Name', type: 'text'},
  from_name: {label: 'From Name', type: 'text'},
  value: {label: 'Value', type: 'currency'}
}

export const CRUD = {
  db: 'gift_cards',
  name: 'gift_cards',
  permissions: [],
  actions: {create: R.GIFT_CARDS_NEW, update: R.GIFT_CARDS_EDIT, list: R.GIFT_CARDS, remove: null},
  editParam: 'gift_card_id',
  currentAction: 'list',
  requiresOrganization: true,
  enableSearch: true,
  form: Form,
  table: Table,
  formLayout: Layout,
  tableHeader: tableHeader
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
