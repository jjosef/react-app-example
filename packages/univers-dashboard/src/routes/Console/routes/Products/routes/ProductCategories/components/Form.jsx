import React from 'react';
import { routeStates as R } from '~/constants/';
import Crud from 'react-univers-crud';

export const Form = {
  nameAndTitle: {type: 'group', children: {
    name: {label: 'Name', type: 'input', required: true},
    description: {label: 'Description', type: 'wysiwyg'}
  }},
  imaging: {type: 'group', children: {
    images: {label: 'Images', type: 'images'}
  }}
}

export const Table = {
  images: {label: '', type: 'images', display: 0},
  name: {label: 'Name', type: 'text'}
}

export const CRUD = {
  db: 'product_categories',
  name: 'product_categories',
  permissions: [],
  actions: {create: R.PRODUCT_CATEGORIES_NEW, update: R.PRODUCT_CATEGORIES_EDIT, list: R.PRODUCT_CATEGORIES, remove: null},
  editParam: 'category_id',
  currentAction: 'list',
  requiresOrganization: true,
  enableSearch: true,
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
