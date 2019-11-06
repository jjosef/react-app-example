import React from 'react';
import { FormView } from './Form.jsx';
import { routeStates as R } from '~/constants/';

export class New extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FormView currentAction="create" />
    )
  }
}

export default {
  path: R.INTEGRATIONS_WEBHOOKS_NEW,
  component: New
}
