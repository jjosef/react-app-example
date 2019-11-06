import { API } from 'univers-lib';
import stripe from 'stripe';

/**
 *  Stripe API Handler
 *
 */
export class StripeAPI {
  constructor(key) {
    this.stripe = stripe(key);
  }

  /**
   *  Get gateway settings from the db
   *
   *  @method getGateway
   */
  static getGateway(app, organization_id) {
    let _this = this;
    return new Promise((resolve, reject) => {
      app.admin.database().ref(`/settings/${organization_id}/payment`).once('value').then((snapshot) => {
        let payment_settings = snapshot.val();
        if(!payment_settings) {
          return reject({code: 404, message: 'Payment settings missing for organization'});
        }

        let key = payment_settings.stripe.options.test_mode === true ? payment_settings.stripe.options.test_api_key : payment_settings.stripe.options.live_api_key;

        return resolve(stripe(key));
      })
    })
  }

  /**
   *  Set the gateway manually
   */
  setGateway(key) {
    this.stripe = stripe(key);
  }

  /**
   *  Create a Stripe Charge. See full documentation for parameters at https://stripe.com/docs/api/node#create_charge
   *
   *  @method createCharge
   *  @param data Object the charge data to submit.
   *  @param data.amount Integter A positive integer representing the number in cents for the charge
   *  @param data.currency String 3 character currency code
   *  @param data.source String The source token for the charge. This should be generated from Stripe.js or similar client-side library.
   *  @param data.application_fee Integer The application fee to take out of the charge in cents.
   *  @param data.destination Object The destination Stripe Connect account.
   *  @param data.destination.account String ID of the Stripe account to make the transfer to.
   */
  createCharge(data) {
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.stripe.charges.create(data, function(err, charge) {
        if(err) {
          return reject(err);
        }

        return resolve(charge);
      });
    });
  }

  /**
   *  Create a Stripe Refund. See full documentation for parameters at https://stripe.com/docs/api/node#create_refund
   *
   *  @method createRefund
   *  @param data Object the charge data to submit.
   *  @param data.charge String The charge ID to refund
   *  @param [data.amount] Integer Amount in cents to refund. If not specified will refund the whole charge.
   *  @param [data.refund_application_fee] Boolean Whether to refund the application fee.
   *  @param data.source String The source token for the charge. This should be generated from Stripe.js or similar client-side library.
   *  @param data.application_fee Integer The application fee to take out of the charge in cents.
   *  @param data.destination Object The destination Stripe Connect account.
   *  @param data.destination.account String ID of the Stripe account to make the transfer to.
   */
  createRefund(data) {
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.stripe.refunds.create(data, function(err, refund) {
        if(err) {
          return reject(err);
        }

        return resolve(refund);
      });
    });
  }
}
