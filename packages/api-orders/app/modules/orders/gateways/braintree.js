import { API } from 'univers-lib';
import braintree from 'braintree';

/**
 *  Braintree API Handler
 *
 */
export class BraintreeAPI {
  /**
   *  Example details:
   *  {
        environment: braintree.Environment.Sandbox,
        merchantId: "useYourMerchantId",
        publicKey: "useYourPublicKey",
        privateKey: "useYourPrivateKey"
      }
   */
  constructor(details) {
    this.gateway = braintree.connect(details);
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

        let bts = {
          environment: payment_settings.braintree.options.test_mode === true ? braintree.Environment.Sandbox : braintree.Environment.Production
        };
        let prefix = "sandbox_";
        if(!payment_settings.braintree.options.test_mode) {
          prefix = "production_";
        }
        bts.merchantId = payment_settings.braintree.options[prefix + 'merchant_id'];
        bts.publicKey = payment_settings.braintree.options[prefix + 'public_key'];
        bts.privateKey = payment_settings.braintree.options[prefix + 'private_key'];
        let gateway = braintree.connect(bts);
        return resolve(gateway);
      })
    })
  }

  /**
   *  Generate a client token. Used for mobile devices, JS API will generate a paymentMethodNonce without requiring this.
   *
   *  @method generateClientToken
   */
  static handleGenerateClientToken(req, res, next) {
    BraintreeAPI.getGateway(this.univers, req.headers['organization-id']).then((gateway) => {
      gateway.clientToken.generate({}, function (err, response) {
        res.json({token: response.clientToken});
      });
    }).catch((err) => {
      return API.handleError(res, err);
    });
  }

  /**
   *  Set the gateway manually
   */
  setGateway(params) {
    this.gateway = braintree.connect(params);
  }

  /**
   *  Create a Braintree Charge. See full documentation for parameters at https://developers.braintreepayments.com/reference/request/transaction/sale/node
   *
   *  @method createCharge
   *  @param data Object the charge data to submit.
   *  @param data.amount Integter A positive integer representing the number in cents for the charge
   *  @param data.paymentMethodNonce String The payment nonce for a transaction
   */
  createCharge(data) {
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.gateway.transaction.sale(data, function (err, result) {
        if(err) {
          return reject(err);
        }

        if(result.success === false) {
          return reject({code: 500, message: result.message});
        }

        return resolve(result);
      });
    });
  }

  /**
   *  Create a Braintree Refund. See full documentation for parameters at https://developers.braintreepayments.com/reference/request/transaction/refund/node
   *
   *  @method createRefund
   *  @param data Object the refund data to submit.
   *  @param data.transactionId String The transaction ID to refund
   *  @param [data.amount] String The amount to refund based on the currency of the transaction. If you do not specify an amount to refund, the entire transaction amount will be refunded.
   *
   */
  createRefund(data) {
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.gateway.transaction.refund(data.transactionId, data.amount, function (err, result) {
        if(err) {
          return reject(err);
        }

        return resolve(result);
      });
    })
  }


  /**
   *  Void a Charge. Useful for doing immediate reversals on transactions. See full documentation for parameters at https://developers.braintreepayments.com/reference/request/transaction/void/node
   *
   *  @method createRefund
   *  @param data Object the refund data to submit.
   *  @param data.transactionId String The transaction ID to refund
   *
   */
  voidCharge(data) {
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.gateway.transaction.void(data.transactionId, function (err, result) {
        if(err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  }
}
