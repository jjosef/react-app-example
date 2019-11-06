import { API, Utils } from 'univers-lib';
import { Order } from './order';

/**
 *  Order Post Handler
 *
 */
export class Post {
  /**
   *  Posting an order:
   *
   *  - Users who are logged in and have appropriate access can create orders without a payment.
   *  - A request should be sent with the following:
   *    - products: [{id: string, qty: number, variants: {<key>: value}}]
   *    - shipping_info: submit the billing_info here if shipment is not required
   *    - billing_info: customer information, can vary but minimum should be email, and phone
   *    - payment: {type: <card|bank_account>, source_id: <generated from web/mobile client - would be a source for Stripe, or a paymentMethodNonce for braintree>}
   *    - [shipments]: only required if products require shipment
   *    - discount_code(s):
   *    - gift_card(s):
   *    - order_notes

   *  @method handlePostOrder
   *
   *  @param req.params.products Object[] Array of product objects
   *  @param req.params.products.id String The product ID
   *  @param req.params.products.qty Number The quantity of this product being ordered
   *  @param [req.params.products.variants] Object The product variants, (if any are required)
   *  @param req.params.shipping_info Object The shipping information for the order.
   *  @param req.params.billing_info Object The billing information for the order.
   *  @param req.params.payment Object
   *  @param req.params.shipments Object[]
   *  @param req.params.discount_codes String[]
   *  @param req.params.gift_card_codes String[]
   *  @param [req.params.notes] String Order notes from the customer/staff member.
   */
  static handlePostOrder(req, res, next) {
    const validations = {
      products: 'isArray',
      billing_info: 'isObject',
      shipping_info: 'isObject',
      payments: 'isObject',
      shipments: 'isObject'
    };
    let reqErrors;
    if(reqErrors = Utils.validateParams(req.params, validations)) {
      return API.handleError(res, {code: 404, message: reqErrors});
    }

    let order = new Order(this.univers);
    let organization_id = req.headers['organization-id'];

    this.univers.admin.database().ref(`settings/${organization_id}/organization`).once('value').then((snapshot) => {
      let organization = snapshot.val();
      if(!organization) {
        return API.andleError(res, {code: 404, message: 'Missing organization settings'});
      }

      order.getProductList(organization_id, req.params.products).then((products) => {
        order.getShipments(products, req.params.products, req.params.shipments, req.params.shipping_info, organization.company_address, organization).then((shipments) => {
          order.handlePayments(organization_id, req.params.payments).then((payments) => {
            order.finalizeOrder(organization_id, req.params, products, shipments, payments).then((order) => {
              return res.json({order: order});
            }).catch((err) => {
              return API.handleError(res, err);
            })
          }).catch((err) => {
            return API.handleError(res, err);
          })
        }).catch((err) => {
          return API.handleError(res, err);
        })
      }).catch((err) => {
        return API.handleError(res, err);
      });
    });
  }
}
