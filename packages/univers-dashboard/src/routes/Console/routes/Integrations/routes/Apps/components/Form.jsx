import React from 'react';
import { routeStates as R, services as S } from '~/constants/';
import Crud, {CrudLayout} from 'react-univers-crud';
import SlackImg from '~/../public/assets/slack.png';
import SageImg from '~/../public/assets/sage.png';
import QuickbooksImg from '~/../public/assets/quickbooks.png';
import MediumImg from '~/../public/assets/medium.png';
import GhostImg from '~/../public/assets/ghost.png';
import IntercomImg from '~/../public/assets/intercom.png';
import TypeformImg from '~/../public/assets/typeform.png';
import HotJarImg from '~/../public/assets/hotjar.png';
import TaxJarImg from '~/../public/assets/taxjar.png';

export const Form = {
  appsCommuniction: {type: 'group', children: {
    slack: {label: 'Slack', type: 'app-toggle', image: SlackImg, options: {
      webhook_uri: {label: 'Webhook URI', type: 'input'},
      events: {label: 'Events', type: 'checkboxes', choices: [
        {name: 'Orders', value: 'orders'},
        {name: 'Items/Inventory', value: 'items'},
        {name: 'Categories', value: 'categories'},
        {name: 'Gift Cards', value: 'gift-cards'},
        {name: 'Settings', value: 'settings'},
        {name: 'Apps', value: 'apps'},
        {name: 'Customers', value: 'customers'},
        {name: 'Discounts', value: 'discounts'}
      ]}
    }},
    intercom: {
      label: 'Intercom', type: 'app-toggle', image: IntercomImg,
      options: {
        app_id: {label: 'App ID', type: 'input'},
        access_token: {label: 'Access Token', type: 'input'}
      },
      jsapi_options: ['app_id']
    },
  }},
  appsMarketing: {type: 'group', children: {
    medium: {label: 'Medium', type: 'app-toggle', image: MediumImg, oauth: true, oAuthProvider: 'medium', opens: 'marketing.medium',
      options: {
        access_token: {label: 'OAuth Token', type: 'input'},
        refresh_token: {label: 'OAuth Refresh Token', type: 'input'},
        user_id: {label: 'Medium User ID', type: 'input'}
      },
      fbfOAuthUrl: S.url('functions', `/oAuthProviders-medium/authorization_url`)
    },
    ghost: {label: 'Ghost', type: 'app-toggle', image: GhostImg},
  }},
  universApps: {type: 'group', children: {
    typeform: {label: 'Typeform', type: 'app-toggle', image: TypeformImg, options: {
      api_key: {label: 'API Key', type: 'input'},
      uid: {label: 'UID', type: 'input'},
    }},
    laika: {label: 'Laika', type: 'app-toggle', icon: 'mdi-umbrella', options: {
      api_key: {label: 'API Key', type: 'input'}
    }},
  }},
  accountingApps: {type: 'group', children: {
    quickbooks: {label: 'Quickbooks', type: 'app-toggle', image: QuickbooksImg},
    sage: {label: 'Sage', type: 'app-toggle', image: SageImg},
    taxjar: {label: 'TaxJar', type: 'app-toggle', image: TaxJarImg, options: {
      api_key: {label: 'API Key', type: 'input'}
    }},
  }},
  analyticsApps: {type: 'group', children: {
    hotjar: {label: 'Hotjar', type: 'app-toggle', image: HotJarImg, options: {
      api_key: {Label: 'API Key', type: 'input'}
    }}
  }}
  //$amazon: {label: 'Stripe', type: 'app-toggle', icon: 'crop-square'},
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
              <div className="panel-header">Communication</div>
              <CrudLayout context={context} inputs={Form.appsCommuniction} keyName="gateways" />
            </div>
            <div className="panel">
              <div className="panel-header">Content</div>
              <CrudLayout context={context} inputs={Form.universApps} keyName="content" />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="panel">
              <div className="panel-header">Marketing</div>
              <CrudLayout context={context} inputs={Form.appsMarketing} keyName="marketing" />
            </div>
            <div className="panel">
              <div className="panel-header">Accounting</div>
              <CrudLayout context={context} inputs={Form.accountingApps} keyName="accounting" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export const CRUD = {
  db: 'organization_apps',
  name: 'Apps',
  permissions: [],
  requiresOrganization: true,
  form: Form,
  formLayout: Layout,
  enableSearch: true,
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
