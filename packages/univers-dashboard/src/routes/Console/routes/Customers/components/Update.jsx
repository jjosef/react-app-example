import React from 'react';
import { FormView } from './Form.jsx';
import { routeStates as R } from '~/constants/';

export class Edit extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormView currentAction="update" />
    )
  }
}

export default {
  path: R.CUSTOMERS_EDIT,
  component: Edit
}
