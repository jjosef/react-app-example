import { API, Utils } from 'univers-lib';
import request from 'request';
import { Payments } from './payments';
import apiConfig from '../../../apis.config.json';

/**
 *  Order Model Methods
 *
 */
export class Order {
  constructor(univers) {
    this.univers = univers;
    this.database = univers.admin.database;
    this.config = this.univers.config;
    // we need to use shippingAPIConfig[env]
    this.shipping_host = process.NODE_ENV === 'production' ? apiConfig.shipping_api.production : apiConfig.shipping_api.dev;
    this.utility_host = process.NODE_ENV === 'production' ? apiConfig.utility_api.production : apiConfig.utility_api.dev;
  }

  processVariants(product, pRef) {
    return new Promise((resolve, reject) => {
      product.weight = pRef.weight;
      product.price = pRef.price;
      product.sku = pRef.sku;

      if(!pRef.variants || !pRef.variants.list || !pRef.variants.list.length) {
        return resolve(product);
      }

      pRef.variants.list.map((v) => {
        if(v.required && !product.variants[v.name]) {
          return reject({code: 404, message: 'Missing required variant ' + v.name});
        }

        v.options.map((o) => {
          if(o.name === product.variants[v.name]) {
            if(o.weight) product.weight += o.weight;
            if(o.price) product.price += o.price;
            if(o.sku) product.sku = o.sku;
          }
        })
      });

      return resolve(product);
    });
  }

  getProduct(ref, product) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let productRef = _this.database().ref(ref).once('value', function(data) {
        let pRef = data.val();
        if(!pRef) {
          return reject({code: 404, message: 'Product with ID ' + p.id + ' did not exist'});
        }

        if(!pRef.active) {
          return reject({code: 404, message: 'Product with ID ' + p.id + ' is not active'});
        }

        if(pRef.track_qty && product.qty > pRef.qty && !product.sell_when_out_of_stock) {
          return reject({code: 500, message: 'Product ' + p.name + ' does not have enough inventory in stock'});
        }

        _this.processVariants(product, pRef).then((newProduct) => {
          product = newProduct;
          return resolve(pRef);
        });
      });
    });
  }

  /**
  *  Pass an array of product objects to get results or an error if a product does not exist.
  *
  */
  getProductList(organization, products) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let productList = {};
      let productPromises = products.map((p, i) => {
        return _this.getProduct(`/products/${organization}/${p.id}`, p).then(product => {
          productList[p.id] = product;
        });
      });

      Promise.all(productPromises).then((result) => {
        return resolve(productList);
      }).catch((err) => {
        return reject(err);
      })
    });
  }

  getShipment(productRefs, products, shipment, to_address, from_address, test) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let weight = 0;
      let packageCode;
      for(let id in shipment.products) {
        if(shipment.products[id] === false) continue;
        products.map((p) => {
          if(p.id !== id) return;

          weight += p.qty * productRefs[id].weight;
        });
      }

      let params = {
        shipment: {
          carrierCode: shipment.carrier,
          serviceCode: shipment.rate.serviceCode,
          packageCode: packageCode || 'package',
          weight: {
            unit: 'pounds',
            value: weight
          }
        },
        shipTo: to_address,
        shipFrom: from_address,
        testLabel: (shipment.carrier !== 'ups' && shipment.carrier !== 'fedex') ? test : false
      };

      request.post({url: _this.shipping_host + '/shipping/label/create', form: params, json: true}, function(err, res, body) {
        if(err) {
          console.log(err);
          return reject(err);
        }
        if(res.statusCode >= 400) {
          return reject({code: res.statusCode, message: body});
        }
        return resolve(body);
      })
    });
  }

  /**
   *  Validate Shipment information. This will verify against the shipping API
   */
  getShipments(productRefs, products, shipment_info, to_address, from_address, organization_settings) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let shipmentPromises = [];
      let shipmentList = [];
      for(let i in shipment_info) {
        shipmentPromises.push(_this.getShipment(productRefs, products, shipment_info[i], to_address, from_address, organization_settings.test_mode).then((shipment) => {
          shipmentList.push(shipment);
        }));
      }

      Promise.all(shipmentPromises).then((result) => {
        return resolve(shipmentList);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  /**
   *  Validate and process any payments in the order
   *  Logic here:
   *  1. Iterate through payments
   *  2. If any payments have a status that is pending we need to process them in the appropriate gateway.
   */
   handlePayments(organization, payments) {
     let _this = this;
     return new Promise((resolve, reject) => {
       let paymentList = [];
       let paymentPromises = [];
       let payment = new Payments(_this.univers, organization);
       for(let i in payments) {
         paymentPromises.push(payment.handleCreatePayment(payments[i]).then((p) => {
           paymentList.push(p);
         }));
       }

       Promise.all(paymentPromises).then((result) => {
         return resolve(paymentList);
       }).catch((err) => {
         return reject(err);
       })
     });
   }

   /**
    *  Validate and process discounts
    */
   handleDiscounts(organization, discounts) {
     let _this = this;
     return new Promise((resolve, reject) => {
       let discountList = [];
       return resolve(discountList);
     });
   }

   updateProductInventory(organization, products, pRefs) {
     let _this = this;
     return new Promise((resolve, reject) => {
       let pUpdates = {};
       products.map((p, i) => {
         let newQty = pRefs[p.id] - p.qty;
         if(newQty < 0) newQty = 0;
         pUpdates[`/products/${organization}/${p.id}/qty`] = newQty;
       })
       _this.database().ref.update(pUpdates).then(() => {
         return resolve({success: true});
       }).catch((err) => {
         return reject({code: 500, message: err.message});
       })
     })
   }

   handleOrderNotifications(organization, order) {
     let _this = this;
     return new Promise((resolve, reject) => {
       let params = {

       };
       request.post({url: _this.utlity_host + '/notifier/email', form: params, json: true}, function(err, res, body) {
         if(err) {
           console.log(err);
           return reject(err);
         }
         if(res.statusCode >= 400) {
           return reject({code: res.statusCode, message: body});
         }
         return resolve(body);
       })
     });
   }

   /**
    *  Finalize the order:
    *  1. Update inventory
    *  2. Update/create customer if needed
    *  3. Save order to DB
    *  4. Send out emails
    */
   finalizeOrder(organization, params, products, shipments, payments) {
     let _this = this;
     return new Promise((resolve, reject) => {
       let order = {
         date: Date.now(),
         status: 'pending',
         customer: {
           id: params.customer.id || null,
           email: params.customer.email,
           phone: params.customer.phone
         },
         shipping_info: params.shipping_info,
         billing_info: params.billing_info,
         products: params.products,
         payments: payments,
         shipments: shipments,
         totals: {
           product_amount: params.totals.product_amount,
           shipping_amount: params.totals.shipping_amount,
           tax_amount: params.totals.tax_amount,
           discount_amount: params.totals.discount_amount,
           amount: params.totals.amount
         }
       };

       this.database().ref(`/organizations/${organization}/lastOrderId`).once('value').then((snapshot) => {
         let lastOrderId = snapshot.val();
         if(!lastOrderId) {
           lastOrderId = 0;
         }
         lastOrderId++;

         order.order_id = 'ORD' + ("0000000000" + lastOrderId).substr(-10, 10);
         this.database().ref(`/organizations/${organization}/lastOrderId`).set(lastOrderId);
         let childRef = _this.database().ref(`/orders/${organization}`).push();
         let order_id = childRef.key;
         childRef.set(order).then(() => {
           order.id = order_id;
           _this.updateProductInventory(products, params.products).catch((err) => {
             console.log(err);
           });
           _this.handleOrderNotifications(organization, order).catch((err) => {
             console.log(err);
           })
           return resolve(order);
         }).catch((err) => {
           return reject({code: 500, message: err.message});
         });
       });
     })
   }
}
