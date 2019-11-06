import React from 'react';
import { routeStates as R, services as S, locations as L } from '~/constants/';
import Crud from 'react-univers-crud';
import { Layout } from './Layout';
import { OrderProducts } from './OrderProducts';
import { OrderShipments } from './OrderShipments';
import { OrderPayments } from './OrderPayments';

export const Form = {
  orderOptions: {type: 'group', children: {
    date: {label: 'Date', type: 'datetime'},
    status: {label: 'Status', type: 'select', choices: [
      {name: 'Pending', value: 'pending'},
      {name: 'Fulfilled', value: 'fulfilled'},
      {name: 'Archived', value: 'archived'},
      {name: 'Cancelled', value: 'cancelled'}
    ]},
    customer_id: {label: 'Customer ID', type: 'text'},
  }},
  customerSelect: {type: 'group', children: {
    customerInfo: {type: 'group', children: {
      customer: {
        email: {label: 'Customer Email', type: 'input'},
        phone: {label: 'Customer Phone', type: 'input'}
      }
    }},
    shippingInfo: {type: 'group', children: {
      shipping_info: {
        name: {label: 'Name', type: 'input', required: true},
        company: {label: 'Company', type: 'input'},
        address: {
          address_1: {label: 'Address', type: 'input'},
          address_2: {label: 'Address (cont)', type: 'input'},
          city: {label: 'City', type: 'input'},
          state_code: {label: 'State/Province', type: 'select', choices: L.states},
          postal_code: {label: 'Postal Code', type: 'input'},
          country_code: {label: 'Country', type: 'select', choices: L.countries}
        },
        residential: {label: 'Residential', type: 'checkbox'},
        lift_gate: {label: 'Lift Gate Required', type: 'checkbox'},
        call_before: {label: 'Call Before Delivery', type: 'checkbox'},
        inside_delivery: {label: 'Inside Delivery', type: 'checkbox'}
      }
    }},
    billingInfo: {type: 'group', children: {
      billing_info: {
        name: {label: 'Name', type: 'input', required: true},
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
    }}
  }},
  orderProducts: {type: 'group', children: {
    products: {type: 'custom', component: OrderProducts, default: {}} // {id: {qty, variants}}
  }},
  orderShipments: {type: 'group', children: {
    shipments: {type: 'custom', component: OrderShipments, default: {}} // {rate_code: {carrier, rate_code, products}}
  }},
  orderAmounts: {type: 'group', children: {
    totals: {
      product_amount: {label: 'Product Amount', type: 'currency', required: true},
      shipping_amount: {label: 'Shipping Amount', type: 'currency', required: true},
      tax_amount: {label: 'Tax Amount', type: 'currency', required: true},
      discount_amount: {label: 'Discount Amount', type: 'currency', required: true},
      amount: {label: 'Total', type: 'currency', required: true}
    }
  }},
  orderPayments: {type: 'group', children: {
    payments: {type: 'custom', component: OrderPayments, default: {}}
  }}
}

export const Table = {
  order_id: {label: 'ID', type: 'text'},
  date: {label: 'Date', type: 'date', format: 'calendar'}, // moment().calendar();
  'customer.email': {label: 'Customer', type: 'text'},
  status: {label: 'Status', type: 'text'},
  'totals.amount': {label: 'Total', type: 'currency'},
  'actions': {label: 'Actions', type: 'actions', options: (item, props) => {
    let ret = [];
    if(item.status === 'pending') {
      ret.push({name: 'Fulfill', click: (evt) => {
        console.log(item, props);
      }})
    } else if(item.status === 'fulfilled') {
      ret.push({name: 'Archive', click: (evt) => {

      }})
    }
    ret.push({name: 'Print Shipping Label', click: (evt) => {

    }})
    ret.push({name: 'Refund', click: (evt) => {

    }})
    if(item.status === 'pending') {
      ret.push({name: 'Cancel', click: (evt) => {

      }})
    }

    return ret;
  }}
}

export const CRUD = {
  db: 'orders',
  name: 'Sales',
  createName: 'Create order',
  permissions: [],
  actions: {create: R.ORDERS_NEW, update: R.ORDERS_EDIT, list: R.ORDERS, remove: null},
  urls: {
    post: S.url('orders', '/orders'),
    put: S.url('orders', '/orders/:order_id')
  },
  listFilters: function(props, auth) {
    return [{
      key: 'status', value: props.params.type
    }];
  },
  editParam: 'order_id',
  currentAction: 'list',
  requiresOrganization: true,
  form: Form,
  table: Table,
  formLayout: Layout,
  subMenu: [
    {name: 'Pending', route: R.parse(R.ORDERS_TYPE, {type: 'pending'})},
    {name: 'Fulfilled', route: R.parse(R.ORDERS_TYPE, {type: 'fulfilled'})},
    {name: 'Archived', route: R.parse(R.ORDERS_TYPE, {type: 'archived'})},
    {name: 'Cancelled', route: R.parse(R.ORDERS_TYPE, {type: 'cancelled'})},
  ],
  helpActions: [
    {name: 'Get Help with Sales', to: R.ORDERS},
    {name: 'Hire a sales specialist', to: R.ORDERS}
  ],
  altActions: [
    {name: 'Export', click: function($evt) {
      // open modal or something.
    }}
  ],
  enableSearch: true,
  beforeCreate: function(ref, data) {
    return new Promise((resolve, reject) => {
      return resolve({ref, data})
    })
  }
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
