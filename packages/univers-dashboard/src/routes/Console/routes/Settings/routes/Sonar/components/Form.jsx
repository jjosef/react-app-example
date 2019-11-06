import React from 'react';
import { routeStates as R } from '~/constants/';
import Crud from 'react-univers-crud';
import { CrudLayout } from 'react-univers-crud';
import ClearsaleImg from '~/../public/assets/clearsale.png';

export const Form = {
  sonarApps: {type: 'group', children: {
    clearsale: {label: 'Clearsale', type: 'app-toggle', image: ClearsaleImg}
  }},
  rmaApps: {type: 'group', children: {
    rma: {label: 'RMA Handler', type: 'app-toggle', icon: 'mdi-playlist-check'}
  }},
  abandonCart: {type: 'group', children: {
    abandon: {label: 'Abandon Cart', type: 'app-toggle', icon: 'mdi-cart'}
  }}
}

export class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {context, ...props} = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="panel">
              <div className="panel-header">Fraud Control</div>
              <CrudLayout context={context} inputs={Form.sonarApps} keyName="sonarApps" />
            </div>
            <div className="panel">
              <div className="panel-header">Returns / RMA</div>
              <CrudLayout context={context} inputs={Form.rmaApps} keyName="rmaApps" />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="panel">
              <div className="panel-header">Abandoned Cart</div>
              <CrudLayout context={context} inputs={Form.abandonCart} keyName="abandonCart" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export const CRUD = {
  db: 'settings/${organization}/sonar',
  name: 'Sonar',
  permissions: [],
  requiresOrganization: false,
  form: Form,
  formLayout: Layout,
  autoSave: true
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
