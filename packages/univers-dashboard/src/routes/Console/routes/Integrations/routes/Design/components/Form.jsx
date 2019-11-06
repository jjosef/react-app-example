import React from 'react';
import { routeStates as R } from '~/constants/';
import Crud from 'react-univers-crud';

export const Form = {

}

export const CRUD = {
  db: 'organization_design',
  name: 'Design',
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
  }

  render() {
    return (
      <Crud {...this.props} />
    )
  }
}

FormView.defaultProps = CRUD;
