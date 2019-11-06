import React from 'react';
import { routeStates as R } from '~/constants/';
import Crud from 'react-univers-crud';
import { Layout } from './Layout';

export const Form = {
  nameAndTitle: {type: 'group', children: {
    name: {label: 'Name', type: 'input', required: true},
    code: {label: 'Discount Code', type: 'input', required: true},
    value_type: {label: 'Type', type: 'select', choices: [{name: 'Percent', value: 'percent'}, {name: 'Fixed Amount', value: 'fixed'}], default: 'percent'},
    value: {label: 'Amount', type: 'input', inputType: 'number'},
    used: {label: 'Used', type: 'input', inputType: 'number', tooltip: 'The number of times this has been used'},
    uses: {label: 'Uses', type: 'input', inputType: 'number', tooltip: 'Type in a number which will represent how many times you think your customers should get to use a discount code. If you think the savings should never end, enter -1, and your customers can use the discount indefinitely'}
  }},
  options: {type: 'group', children: {
    active: {label: 'Active', type: 'checkbox', default: true},
    free_shipping: {label: 'Enable Free Shipping', type: 'checkbox', default: false},
    require_spend_amount: {label: 'Minimum Total Required', type: 'currency', tooltip: 'By typing in a numerical amount in the space provided, you will ensure a discount can only be applied if a customer\'s total reaches a set minimum at checkout.'},
    tags: {label: 'Tags', type: 'tags', tooltip:"Use tags to create specialized use-cases in your theme, examples: 'featured' or 'homepage_promotion'"},
    starts: {label: 'Starts', type: 'datetime'},
    expires: {label: 'Expires', type: 'datetime'}
  }}
}

export const Table = {
  code: {label: 'Details', type: 'text'},
  used: {label: 'Code', type: 'text'},
  starts: {label: 'Starts', type: 'date', format: 'calendar'},
  expires: {label: 'Expires', type: 'date', format: 'calendar'}
}

export const CRUD = {
  db: 'discounts',
  name: 'discounts',
  permissions: [],
  actions: {create: R.DISCOUNTS_NEW, update: R.DISCOUNTS_EDIT, list: R.DISCOUNTS, remove: null},
  editParam: 'discount_id',
  currentAction: 'list',
  requiresOrganization: true,
  form: Form,
  table: Table,
  formLayout: Layout,
  subMenu: [
    {name: 'Discounts', route: R.DISCOUNTS, indexOnly: true}
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
