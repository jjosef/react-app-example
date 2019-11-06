import React from 'react';
import { routeStates as R } from '~/constants/';
import Crud, {CrudLayout} from 'react-univers-crud';
import ShipStationImg from '~/../public/assets/shipstation.png';

export const Form = {
  freeRate: {type: 'group', children: {
    free_rate: {label: 'Free Rate', type: 'app-toggle', icon: 'mdi-crop-square', options: {
      minimum_order: {label: 'Minimum Order', type: 'currency'}
    }}
  }},
  flatRate: {type: 'group', children: {
    flat_rate: {label: 'Flat Rate', type: 'app-toggle', icon: 'mdi-truck', options: {
      amount: {label: 'Amount', type: 'currency'},
      description: {label: 'Description', type: 'input'}
    }}
  }},
  shipStation: {type: 'group', children: {
    shipstation: {label: 'Ship Station', type: 'app-toggle', image: ShipStationImg, options: {
      api_key: {label: 'API Key', type: 'input'},
      api_secret: {label: 'API Secret', type: 'input', inputType: 'password'}
    }}
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
              <div className="panel-header">Services</div>
              <CrudLayout context={context} inputs={Form.shipStation} keyName="shipStation" />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="panel">
              <div className="panel-header">Settings</div>
              <CrudLayout context={context} inputs={Form.flatRate} keyName="flat" />
              <CrudLayout context={context} inputs={Form.freeRate} keyName="free" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export const CRUD = {
  db: 'shipping_carriers',
  name: 'Carriers',
  permissions: [],
  requiresOrganization: true,
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
