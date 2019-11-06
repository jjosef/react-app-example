import React from 'react';
import _isEqual from 'lodash/lang/isEqual';
import axios from 'axios';
import { Form } from './Form';
import { OrderEmitter } from '../'
import { CrudLayout } from 'react-univers-crud';
import { services as S } from '~/constants/';
import firebase from 'firebase';

let orderAddSub;
let orderUpdateSub;
let orderRemoveSub;

export class Layout extends React.Component {
  constructor(props) {
    super(props);

    this._settings = null
  }

  componentWillMount() {
    firebase.database().ref(`settings/${this.props.context.props.auth.organization}/organization`).once('value').then((snapshot) => {
      this._settings = snapshot.val();
    });
  }

  getTaxAmount(productTotal, shippingTotal, nextProps) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let form = nextProps.context.state.form;
      if(Number(productTotal) === 0 || !form.shipping_info.address.postal_code) {
        return resolve('0.00');
      }
      let params = {
        amount: Number(productTotal) + Number(shippingTotal),
        postal_code: form.shipping_info.address.postal_code
      }
      return axios.get(S.url('functions', '/taxes/rate'), {params: params}, {headers: {organization_id: nextProps.context.props.auth.organization}})
        .then((result) => {
          return resolve(result.data.tax);
        }).catch((err) => {
          console.log(err);
          return reject(err);
        });
    })
  }

  calculateTotals(nextProps) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let form = nextProps.context.state.form;
      let productTotal = 0, shippingTotal = 0;
      let i;
      for(i in form.products) {
        productTotal += form.products[i].price * form.products[i].qty;
      }

      for(i in form.shipments) {
        console.log(form.shipments[i]);
        shippingTotal += form.shipments[i].rate ? form.shipments[i].rate.shipmentCost : form.shipments[i].shipmentCost;
      }

      return _this.getTaxAmount(productTotal, shippingTotal, nextProps).then((tax_amount) => {
        let totals = {
          product_amount: productTotal.toFixed(2),
          shipping_amount: shippingTotal.toFixed(2),
          tax_amount: tax_amount,
          discount_amount: '0.00'
        };
        totals.amount = (Number(totals.product_amount) + Number(totals.shipping_amount) + Number(totals.tax_amount) - Number(totals.discount_amount)).toFixed(2);
        return resolve(totals);
      })
    });
  }

  componentWillUpdate(nextProps) {
    this.calculateTotals(nextProps).then((totals) => {
      if(!_isEqual(this.props.context.state.form.totals, totals)) {
        this.props.context.handleChange({
          target: {
            name: 'totals',
            value: totals
          }
        })
      }
    });
  }

  copyShippingAddress() {
    let form = this.props.context.state.form;
    let newBilling = {
      name: form.shipping_info.name,
      company: form.shipping_info.company,
      address: form.shipping_info.address
    }

    this.props.context.handleChange({
      target: {
        name: 'billing_info',
        value: newBilling
      }
    })
  }

  render() {
    let {context, ...props} = this.props;

    return (
      <div>
        <div className="row">
          <div className="col">
            <div className="panel">
              <div className="panel-header">Customer</div>
              <CrudLayout context={context} inputs={Form.customerSelect.children.customerInfo} keyName="products" />
            </div>
          </div>
        </div>
        <div className="row top-margin">
          <div className="col-12 col-md-6">
            <div className="panel">
              <div className="panel-header">Shipping Details</div>
              <CrudLayout context={context} inputs={Form.customerSelect.children.shippingInfo} keyName="shipping" />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="panel">
              <div className="panel-header">Billing Details <button className="btn btn-primary btn-sm" onClick={this.copyShippingAddress.bind(this)}>Copy Shipping</button></div>
              <CrudLayout context={context} inputs={Form.customerSelect.children.billingInfo} keyName="billing" />
            </div>
          </div>
        </div>
        <div className="row top-margin">
          <div className="col">
            <div className="panel">
              <div className="panel-header">Products</div>
              <CrudLayout context={context} inputs={Form.orderProducts} keyName="products" />
            </div>
          </div>
        </div>
        <div className="row top-margin">
          <div className="col">
            <div className="panel">
              <div className="panel-header">Shipments</div>
              <CrudLayout context={context} inputs={Form.orderShipments} keyName="shipments" />
            </div>
          </div>
        </div>
        <div className="row top-margin">
          <div className="col-12 col-md-6">
            <div className="panel">
              <div className="panel-header">Totals</div>
              <CrudLayout context={context} inputs={Form.orderAmounts} keyName="amounts" />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="panel">
              <div className="panel-header">Payment</div>
              <CrudLayout context={context} inputs={Form.orderPayments} keyName="payments" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
