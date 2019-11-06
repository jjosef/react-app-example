import config from './config.js';
import { API } from 'univers-lib';
import validator from 'validator';
import { Post } from './components/post';
import { Payments } from './components/payments';
import { BraintreeAPI } from './gateways/braintree';

class OrdersModule extends API {
  /**
   * OrdersModule controls API endpoints for `/orders`
   * @constructor
   * @param {Object} app The application is passed to this module so it can be accessed.
   */
  constructor(app) {
    super(app, config);

    this.univers = app;

    this.handlers.post = Post.handlePostOrder.bind(this);

    this.config.routes = {
      '/braintree/client-token': {
        method: 'get',
        authentication: true,
        organization: true,
        controller: BraintreeAPI.handleGenerateClientToken.bind(this)
      }
    }

    this.loadAPI();
  }
}

module.exports = OrdersModule;
