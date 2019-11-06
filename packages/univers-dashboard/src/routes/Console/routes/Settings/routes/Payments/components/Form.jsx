import React from 'react';
import { routeStates as R } from '~/constants/';
import Crud from 'react-univers-crud';
import { CrudLayout } from 'react-univers-crud';
import StripeImg from '~/../public/assets/stripe.png';
import BraintreeImg from '~/../public/assets/braintree.png';
import PaypalImg from '~/../public/assets/paypal.png';
import AmazonImg from '~/../public/assets/amazon.png';
import SageImg from '~/../public/assets/sage.png';
import FuturePayImg from '~/../public/assets/futurepay.png';

export const Form = {
  gatewayChoice: {type: 'group', children: {
    gateway: {type: 'hidden', default: 'dummy'},
    $dummy: {label: 'Demo', type: 'app-toggle', icon: 'mdi-crop-square', truth: {compare: 'gateway', value: 'dummy'}},
    $stripe: {label: 'Stripe', type: 'app-toggle', image: StripeImg, truth: {compare: 'gateway', value: 'stripe'}, optionName: 'stripe', options: {
      test_mode: {label: 'Use Test Mode', type: 'checkbox', default: true},
      test_public_key: {label: 'Test Public Key', type: 'input'},
      test_api_key: {label: 'Test API Key', type: 'input'},
      live_public_key: {label: 'Live Public Key', type: 'input'},
      live_api_key: {label: 'Live API Key', type: 'input'}
    }},
    $braintree: {label: 'Braintree', type: 'app-toggle', image: BraintreeImg, truth: {compare: 'gateway', value: 'braintree'}, optionName: 'braintree', options: {
      test_mode: {label: 'Use Sandbox', type: 'checkbox', default: true},
      submit_for_settlement: {label: 'Auto-submit Transactions for Settlement', type: 'checkbox', default: true},
      sandbox_merchant_id: {label: 'Sandbox Merchant ID', type: 'input'},
      sandbox_public_key: {label: 'Sandbox Public Key', type: 'input'},
      sandbox_private_key: {label: 'Sandbox Private Key', type: 'input'},
      production_merchant_id: {label: 'Production Merchant ID', type: 'input'},
      production_public_key: {label: 'Production Public Key', type: 'input'},
      production_private_key: {label: 'Production Private Key', type: 'input'}
    }},
    $sage: {disabled: true, disabledText: 'Coming Soon', label: 'Sage', type: 'app-toggle', image: SageImg, truth: {compare: 'gateway', value: 'sage'}, optionName: 'sage'}
  }},
  expressCheckouts: {type: 'group', children: {
    paypal_express: {label: 'PayPal', type: 'app-toggle', image: PaypalImg, options: {
      sandbox_client_id: {label: 'Sandbox Client ID', type: 'input'},
      production_client_id: {label: 'Production Client ID', type: 'input'}
    }},
    amazon_express: {label: 'Amazon Pay', type: 'app-toggle', image: AmazonImg, options: {
      sandbox_merchant_id: {label: 'Sandbox Merchant ID', type: 'input'},
      sandbox_access_key: {label: 'Sandbox Access Key', type: 'input'},
      sandbox_secret_key: {label: 'Sandbox Secret Key', type: 'input'},
      sandbox_client_id: {label: 'Sandbox Client ID', type: 'input'},
      sandbox_client_secret: {label: 'Sandbox Client Secret', type: 'input'},
      production_merchant_id: {label: 'Production Merchant ID', type: 'input'},
      production_access_key: {label: 'Production Access Key', type: 'input'},
      production_secret_key: {label: 'Production Secret Key', type: 'input'},
      production_client_id: {label: 'Production Client ID', type: 'input'},
      production_client_secret: {label: 'Production Client Secret', type: 'input'}
    }}
  }},
  financingOptions: {type: 'group', children: {
    future_pay: {label: 'Future Pay', type: 'app-toggle', image: FuturePayImg, options: {
      sandbox_client_id: {label: 'Sandbox Client ID', type: 'input'},
      production_client_id: {label: 'Production Client ID', type: 'input'}
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
              <div className="panel-header">Gateway</div>
              <CrudLayout context={context} inputs={Form.gatewayChoice} keyName="gateways" />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="panel">
              <div className="panel-header">Checkout</div>
              <CrudLayout context={context} inputs={Form.expressCheckouts} keyName="express" />
            </div>
            <div className="panel">
              <div className="panel-header">Financing</div>
              <CrudLayout context={context} inputs={Form.financingOptions} keyName="financing" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export const CRUD = {
  db: 'settings/${organization}/payment',
  name: 'Payments',
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
