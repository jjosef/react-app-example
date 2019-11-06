import React from 'react'
import axios from 'axios'
import Autosuggest from 'react-autosuggest'
import immutable from 'object-path-immutable'
import {client, hostedFields} from 'braintree-web'
import Portal from 'react-portal'
import CurrencyInput from 'react-currency-masked-input'
import { services as S, routeStates as R } from '~/constants/'
import { OrderEmitter } from '../'
import firebase from 'firebase';

let orderAddSub;
let orderUpdateSub;
let orderRemoveSub;

export class OrderPayments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      payment_settings: {},
      newPayment: {
        type: 'cash',
        status: 'pending',
        amount: '0.00',
        discount_code: '',
        gift_card: '',
        purchase_order: ''
      },
      payments: {}
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if(newProps.state && newProps.state.payments && Object.keys(this.state.payments).length === 0) {
      this.setState({payments: immutable.set(this.state, 'payments', newProps.state.payments)})
    }
  }

  componentWillMount() {
    firebase.database().ref(`settings/${this.props.auth.organization}/payment`).once('value').then((snapshot) => {
      this.setState(immutable.set(this.state, 'payment_settings', snapshot.val()));
    });
  }

  componentDidUpdate() {
    // this is where we utilize the checkout methods for payment gateways
    let np = this.state.newPayment;
    if(np.type !== 'credit-card') return;
    switch(this.state.payment_settings.gateway) {
      case 'stripe':
        console.log('mounting stripe elements form');
        if(!this._cardField) {
          let key;
          if(this.state.payment_settings.stripe.options.test_mode) {
            key = this.state.payment_settings.stripe.options.test_public_key;
          } else {
            key = this.state.payment_settings.stripe.options.live_public_key;
          }
          this._stripe = Stripe(key);
          let style = {
            base: {
              color: '#32325d',
              lineHeight: '24px',
              fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                color: '#aab7c4'
              }
            },
            invalid: {
              color: '#fa755a',
              iconColor: '#fa755a'
            }
          };
          this._cardField = this._stripe.elements().create('card', {style: style});
        }
        this._cardField.mount('#credit-card-form');
      break;

      case 'braintree':
        if(this._hostedFields) return;

        let user = JSON.parse(localStorage.getItem('user'));
        firebase.auth().currentUser.getIdToken().then((token) => {
          axios.get(S.url('orders', '/braintree/client-token'),
          {headers: {
            'ID-Token': token,
            'organization-id': user.organization
          }}).then((res) => {
            client.create({
              authorization: res.data.token
            }, (clientErr, clientInstance) => {
              if (clientErr) {
                // Handle error in client creation
                console.log(clientErr);
                return;
              }

              hostedFields.create({
                client: clientInstance,
                styles: {
                  'input': {
                    'font-size': '1rem'
                  },
                  'input.invalid': {
                    'color': 'red'
                  },
                  'input.valid': {
                    'color': 'green'
                  }
                },
                fields: {
                  number: {
                    selector: '#card-number',
                    placeholder: '4111 1111 1111 1111'
                  },
                  cvv: {
                    selector: '#cvv',
                    placeholder: '123'
                  },
                  expirationDate: {
                    selector: '#expiration-date',
                    placeholder: '10/2019'
                  }
                }
              }, (hostedFieldsErr, hostedFieldsInstance) => {
                if (hostedFieldsErr) {
                  // Handle error in Hosted Fields creation
                  return;
                }

                this._hostedFields = hostedFieldsInstance
              });
            });
          }).catch((err) => {
            console.log(err);
          })
        });
      break;
    }
  }

  handleOptionChange($evt) {
    this.setState(immutable.set(this.state, $evt.target.name, $evt.target.value));
  }

  handleChange() {
    let newEvt = {
      target: {
        name: this.props.name,
        value: this.state.payments
      }
    };
    this.props.onChange(newEvt);
  }

  handleCreatePayment() {
    let d = new Date();
    let payments = this.state.payments;
    let newPayment = this.state.newPayment;
    //payments[d.getTime()] = newPayment;
    if(newPayment.type === 'credit-card') {
      switch(this.state.payment_settings.gateway) {
        case 'stripe':
          this._stripe.createToken(this._cardField).then((result) => {
            if (result.error) {
              // Inform the user if there was an error
              console.log(result.error);
            } else {
              // Send the token to your server
              newPayment.nonce = result.token;
              payments[d.getTime()] = newPayment;
              let newState = immutable.set(this.state, 'payments', payments);
              newState = immutable.set(newState, 'newPayment', {
                type: 'cash',
                status: 'pending',
                amount: '0.00',
                discount_code: '',
                gift_card: '',
                purchase_order: ''
              });
              this.setState(newState);
              this.handleChange();
            }
          });
        break;
        case 'braintree':
          this._hostedFields.tokenize((tokenizeErr, payload) => {
            if (tokenizeErr) {
              // Handle error in Hosted Fields tokenization
              console.log(tokenizeErr);
              return;
            }

            newPayment.nonce = payload.nonce;
            payments[d.getTime()] = newPayment;
            let newState = immutable.set(this.state, 'payments', payments);
            newState = immutable.set(newState, 'newPayment', {
              type: 'cash',
              status: 'pending',
              amount: '0.00',
              discount_code: '',
              gift_card: '',
              purchase_order: ''
            });
            this.setState(newState);
            this.handleChange();
          });
        break;
      }
    } else if(newPayment.type === 'gift-card') {
      // we need to check the amount on the card.
      payments[d.getTime()] = newPayment;
      let newState = immutable.set(this.state, 'payments', payments);
      newState = immutable.set(newState, 'newPayment', {
        type: 'cash',
        status: 'pending',
        amount: '0.00',
        discount_code: '',
        gift_card: '',
        purchase_order: ''
      });
      this.setState(newState);
      this.handleChange();
    } else if(newPayment.type === 'discount-code') {
      // we need to check the value for the discount
      payments[d.getTime()] = newPayment;
      let newState = immutable.set(this.state, 'payments', payments);
      newState = immutable.set(newState, 'newPayment', {
        type: 'cash',
        status: 'pending',
        amount: '0.00',
        discount_code: '',
        gift_card: '',
        purchase_order: ''
      });
      this.setState(newState);
      this.handleChange();
    } else {
      payments[d.getTime()] = newPayment;
      let newState = immutable.set(this.state, 'payments', payments);
      newState = immutable.set(newState, 'newPayment', {
        type: 'cash',
        status: 'pending',
        amount: '0.00',
        discount_code: '',
        gift_card: '',
        purchase_order: ''
      });
      this.setState(newState);
      this.handleChange();
    }
  }

  handleDeletePayment(index) {
    if(this.state.payments[index].status !== 'pending') return;

    let {[index]: deleted, ...newPayments} = this.state.payments;
    let newState = immutable.set(this.state, 'payments', newPayments);
    this.setState(newState);
    this.handleChange();
  }

  render() {
    let {context, name, ...props} = this.props;
    let paymentHistory = []

    let paymentForm = null;
    console.log(this.state.newPayment.type);
    switch(this.state.newPayment.type) {
      case 'cash':
        paymentForm = (
          <div className="payment-form">
            <div className="row">
              <div className="col text-right">
                <button className="btn btn-primary" onClick={this.handleCreatePayment.bind(this)}>Add Payment</button>
              </div>
            </div>
          </div>
        )
      break;
      case 'discount-code':
        paymentForm = (
          <div className="payment-form">
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>Discount Code</label>
                  <input type="text" className="form-control" name="newPayment.discount_code" value={this.state.newPayment.discount_code} onChange={this.handleOptionChange.bind(this)} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col text-right">
                <button className="btn btn-primary" onClick={this.handleCreatePayment.bind(this)}>Add Payment</button>
              </div>
            </div>
          </div>
        )
      break;
      case 'gift-card':
        paymentForm = (
          <div className="payment-form">
            <div className="row">
              <div className="col">
                <div className="form-group">
                  <label>Gift Card Number</label>
                  <input type="text" className="form-control" name="newPayment.gift_card" value={this.state.newPayment.gift_card} onChange={this.handleOptionChange.bind(this)} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col text-right">
                <button className="btn btn-primary" onClick={this.handleCreatePayment.bind(this)}>Add Payment</button>
              </div>
            </div>
          </div>
        )
      break;
      case 'credit-card':
        switch(this.state.payment_settings.gateway) {
          case 'stripe':
            paymentForm = (
              <div className="payment-form">
                <div className="row mb-3">
                  <div className="col">
                    <div id="credit-card-form" />
                  </div>
                </div>
                <div className="row">
                  <div className="col text-right">
                    <button className="btn btn-primary" onClick={this.handleCreatePayment.bind(this)}>Add Payment</button>
                  </div>
                </div>
              </div>
            );
          break;
          // Braintree DOM
          case 'braintree':
            paymentForm = (
              <div className="payment-form">
                <div className="row">
                  <div className="col">
                    <label className="hosted-fields--label" htmlFor="card-number">Card Number</label>
                    <div id="card-number" className="hosted-field" />
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label className="hosted-fields--label" htmlFor="expiration-date">Expiration Date</label>
                    <div id="expiration-date" className="hosted-field"/>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <label className="hosted-fields--label" htmlFor="cvv">CVV</label>
                    <div id="cvv" className="hosted-field"/>
                  </div>
                </div>
                <div className="row">
                  <div className="col text-right">
                    <button className="btn btn-primary" onClick={this.handleCreatePayment.bind(this)}>Add Payment</button>
                  </div>
                </div>
              </div>
            )
          break;
        }
      break;
      case 'purchase-order':
        paymentForm = (
          <div className="payment-form">
            <div className="form-group">
              <label>PO Number</label>
              <input type="text" className="form-control" name="newPayment.purchase_order" value={this.state.newPayment.purchase_order} onChange={this.handleOptionChange.bind(this)} />
            </div>
            <div className="row">
              <div className="col text-right">
                <button className="btn btn-primary" onClick={this.handleCreatePayment.bind(this)}>Add Payment</button>
              </div>
            </div>
          </div>
        )
      break;
    }

    for(let i in this.state.payments) {
      let p = this.state.payments[i];
      paymentHistory.push((
        <div key={i} className="payment-item d-flex justify-content-between">
          <div className="payment-details">
            <div className="payment-type">{p.type}</div>
            <div className="payment-status">{p.status}</div>
            <div className="payment-amount">${p.amount}</div>
          </div>
          <div className="payment-actions">
            {p.status === 'pending' ? <a onClick={this.handleDeletePayment.bind(this, i)}><i className="mdi mdi-delete"></i></a> : ''}
          </div>
        </div>
      ))
    }

    return (
      <div className="order-payments">
        <div className="form-group">
          <label>Type</label>
          <select className="form-control custom-select" value={this.state.newPayment.type} name="newPayment.type" onChange={this.handleOptionChange.bind(this)}>
            <option value="cash">Cash</option>
            <option value="credit-card">Credit Card</option>
            <option value="gift-card">Gift Card</option>
            <option value="discount-code">Discount Code</option>
            <option value="purchase-order">Purchase Order</option>
          </select>
        </div>
        <div className="form-group">
          <label>Amount</label>
          <div className="input-group">
            <span className="input-group-addon">$</span>
            <CurrencyInput className="form-control" value={this.state.newPayment.amount} name="newPayment.amount" onChange={this.handleOptionChange.bind(this)} />
          </div>
        </div>
        {paymentForm}
        <div className="payment-history">
          {paymentHistory}
        </div>
      </div>
    )
  }
}
