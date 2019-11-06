import React from 'react';
import { routeStates as R, locations as L } from '~/constants/';
import Crud from 'react-univers-crud';
import { CrudLayout } from 'react-univers-crud';
import MailgunImg from '~/../public/assets/mailgun.png';

export const Form = {
  support: {type: 'group', children: {
    website_url: {label: 'Website URL', type: 'input'},
    support_email: {label: 'Support Email', type: 'input', inputType: 'email'},
    support_phone: {label: 'Support Phone', type: 'input', inputType: 'tel'},
  }},
  companyAddress: {type: 'group', children: {
    company_address: {
      company: {label: 'Company', type: 'input'},
      address: {
        address_1: {label: 'Address', type: 'input'},
        address_2: {label: 'Address (cont)', type: 'input'},
        city: {label: 'City', type: 'input'},
        state_code: {label: 'State/Province', type: 'select', choices: L.states},
        postal_code: {label: 'Postal Code', type: 'input'},
        country_code: {label: 'Country', type: 'select', choices: L.countries}
      }
    }
  }},
  testMode: {type: 'group', children: {
    test_mode: {label: 'Enabled', type: 'checkbox', default: true}
  }},
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
              <CrudLayout context={context} inputs={Form.companyAddress} keyName="companyAddress" />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="panel">
              <CrudLayout context={context} inputs={Form.support} keyName="support" />
            </div>
            <div className="panel">
              <div className="panel-header">Test Mode</div>
              <CrudLayout context={context} inputs={Form.testMode} keyName="testMode" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export const CRUD = {
  db: 'settings/${organization}/organization',
  name: 'Organization Settings',
  currentAction: 'static',
  permissions: [],
  requiresOrganization: false,
  form: Form,
  formLayout: Layout
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
