const Request = require('./shipstation/ssrequest').Request;

class Rates {
  /**
   *  List rates available for this carrier on your ShipStation account
   *
   *  See http://www.shipstation.com/developer-api/#/reference/shipments/get-rates for params
   *
   *  @method handleListCarrierServices
   *  @param [req.body.carrierCode] String The carrier code you want to find services for, if none is provided it will get rates for all available carriers.
   *  @param req.body.fromPostalCode String The postal code the package is coming from, will use the account default if none is provided.
   *  @param req.body.toPostalCode String The postal code the package is going to
   *  @param req.body.toCountry String The two-letter ISO country code the package is going to
   *  @param req.body.value Number The decimal number value of the shipment
   *  @param req.body.weight Object
   *  @param req.body.weight.value Number The numerical value of weight
   *  @param req.body.weight.units String The unit of measure. Allowed units are: "pounds", "ounces", or "grams"
   *
   *  @returns RateList
   *  [
   *    {
   *      "serviceName": "FedEx First Overnight®",
   *      "serviceCode": "fedex_first_overnight",
   *      "shipmentCost": 87.8,
   *      "otherCost": 2.63,
   *      "integration": "shipstation"
   *    },
   *    {
   *      "serviceName": "Flat Rate",
   *      "serviceCode": "univers_flat_rate",
   *      "shipmentCost": 10.0,
   *    },
   *    {
   *      "serviceName": "Free",
   *      "serviceCode": "univers_free_rate",
   *      "shipmentCost": 0.0
   *    }
   *  ]
   */
  handleQuote(req, res) {
    let rates = [];
    if(req.carrier_settings.free_rate && req.carrier_settings.free_rate.active) {
      if(req.body.value && parseFloat(req.body.value) >= parseFloat(req.carrier_settings.free_rate.options.minimum_order)) {
        rates.push({
          serviceName: "Free",
          serviceCode: 'univers_free_rate',
          shipmentCost: 0.0
        });
      }
    }
    if(req.carrier_settings.flat_rate && req.carrier_settings.flat_rate.active) {
      rates.push({
        serviceName: req.carrier_settings.flat_rate.options.description || 'Flat Rate',
        serviceCode: 'univers_flat_rate',
        shipmentCost: req.carrier_settings.flat_rate.options.amount || 1.0
      });
    }
    if(req.carrier_settings.shipstation && req.carrier_settings.shipstation.active) {
      if(req.body.carrierCode) {
        Request.post(Request.endpoints.RATES, req.body, {user: req.carrier_settings.shipstation.options.api_key, pass: req.carrier_settings.shipstation.options.api_secret}).then((ssRates) => {
          ssRates.map((rate) => {
            rate.integration = 'shipstation';
          });
          rates = rates.concat(ssRates);
          res.json(rates);
        }).catch((err) => {
          return res.status(err.code).json(err);
        });
      } else {
        Request.get(Request.endpoints.CARRIERS_LIST, {}, {user: req.carrier_settings.shipstation.options.api_key, pass: req.carrier_settings.shipstation.options.api_secret}).then((ssCarriers) => {
          let requestList = ssCarriers.map((carrier) => {
            return Rates.getShipStationCarrierRates(carrier.code, req).then((ssRates) => {
              rates = rates.concat(ssRates);
            });
          });

          Promise.all(requestList).then((result) => {
            return res.json(rates);
          }).catch((err) => {
            return res.status(err.code).json(err);
          })
        });
      }
    } else {
      res.json(rates);
    }
  }

  static getShipStationCarrierRates(carrier_code, req) {
    return new Promise((resolve, reject) => {
      req.body.carrierCode = carrier_code;
      Request.post(Request.endpoints.RATES, req.body, {user: req.carrier_settings.shipstation.options.api_key, pass: req.carrier_settings.shipstation.options.api_secret}).then((ssRates) => {
        ssRates.map((rate) => {
          rate.integration = 'shipstation';
        });
        return resolve(ssRates);
      }).catch((err) => {
        return reject({code: err.code, message: err.message});
      });
    })
  }
};

exports.Rates = new Rates();
