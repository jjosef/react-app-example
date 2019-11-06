import { API, Utils } from 'univers-lib';
import braintree from 'braintree';
import { BraintreeAPI } from '../gateways/braintree';
import { StripeAPI } from '../gateways/stripe';

/**
 *  Payment Methods
 *
 */
export class Payments {
  constructor(univers, organization) {
    this.univers = univers;
    this.database = univers.admin.database;
    this.organization = organization;
  }

  /**
   *
   *  Create a credit card payment nonce to be validated during order completion.
   *  @method doCreditCardPayment
   *
   */
  doCreditCardPayment(payment) {
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.database().ref(`settings/${_this.organization}/payment`).once('value').then((snapshot) => {
        let settings = snapshot.val();
        if(!settings || !settings.gateway) {
          return reject({code: 404, message: 'Missing gateway settings'});
        }

        switch(settings.gateway) {
          case 'stripe':
            let key;
            if(settings.stripe.options.test_mode) {
              key = settings.stripe.options.test_public_key;
            } else {
              key = settings.stripe.options.live_public_key;
            }

            let stripe = new StripeAPI(key);
            stripe.createCharge({
              amount: Math.ceil(Number(payment.amount)*100),
              currency: 'USD',
              source: payment.nonce
            }).then((charge) => {
              let newPayment = {
                amount: payment.amount,
                id: charge.id,
                gateway: 'stripe',
                type: 'credit-card'
              };

              resolve(newPayment);
            }).catch((err) => {
              return reject({code: 500, message: err.message});
            })
          break;

          case 'braintree':
            let bts = {
              environment: settings.braintree.options.test_mode === true ? braintree.Environment.Sandbox : braintree.Environment.Production
            };
            let prefix = "sandbox_";
            if(!settings.braintree.options.test_mode) {
              prefix = "production_";
            }
            bts.merchantId = settings.braintree.options[prefix + 'merchant_id'];
            bts.publicKey = settings.braintree.options[prefix + 'public_key'];
            bts.privateKey = settings.braintree.options[prefix + 'private_key'];

            let gateway = new BraintreeAPI(bts);
            gateway.createCharge({
              amount: payment.amount,
              paymentMethodNonce: payment.nonce,
              options: {
                submitForSettlement: settings.braintree.options.submit_for_settlement ? true : false
              }
            }).then((charge) => {
              let newPayment = {
                amount: payment.amount,
                id: charge.transaction.id,
                gateway: 'braintree',
                type: 'credit-card'
              }

              resolve(newPayment);
            }).catch((err) => {
              return reject({code: 500, message: err.message});
            })
          break;
        }
      });
    });
  }

  /**
   *
   *  @method handleCreatePayment
   *
   *  @param payment Object New payment object
   */
  handleCreatePayment(payment) {
    let _this = this;
    return new Promise((resolve, reject) => {
      if(payment.status !== 'pending') {
        if(!payment.id) {
          return reject({code: '404', message: 'Payment is missing valid ID'});
        }
        return resolve(payment);
      }

      switch(payment.type) {
        case 'cash':
        case 'purchase-order':
          payment.id = Utils.generateKey();
          return resolve(payment);
        break;
        case 'credit-card':
          // validate that there is a payment nonce to be used.
          if(!payment.nonce) {
            return reject({code: 404, message: 'Missing credit card nonce for order'});
          }

          return _this.doCreditCardPayment(payment).then((newPayment) => {
            return resolve(newPayment);
          }).catch((err) => {
            return reject(err);
          });
        break;
        case 'discount-code':
          // validate discount
        break;
        case 'gift-card':
          // validate gift card
        break;
      }
    });
  }
}
