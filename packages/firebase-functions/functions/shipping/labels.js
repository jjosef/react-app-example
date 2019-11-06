const Request = require('./shipstation/ssrequest').Request;
const admin = require('firebase-admin');
const fbfUser = require('../user/validate');

class Labels {
  /**
   *  Try to create a shipment based on the rating information given.
   *
   *  See http://www.shipstation.com/developer-api/#/reference/shipments/create-shipment-label/create-shipment-label for params
   *
   *  @method handleCreateShipment
   *  @param req.params.shipment Object The shipment object with all pertinent information
   *  @param req.params.shipment.carrierCode String The shipment carrier code
   *  @param req.params.shipment.serviceCode String The shipment rate service code
   *  @param [req.params.shipment.packageCode] String Optional, the shipment package type code. Default is 'package' is none is provided.
   *  @param req.params.shipment.weight Number The shipment weight
   *  @param req.params.shipFrom Object The address object to ship from
   *  @param req.params.shipTo Object The address object to ship
   *  @param req.params.test Boolean Whether to run as a test label or not
   */
  handleCreateLabel(req, res) {
    fbUser.validateFirebaseIdToken(req).then((user) => {
      if(!req.carrier_settings.shipstation || !req.carrier_settings.shipstation.active) {
        return res.status(404).json({code: 404, message: 'Label creation requires ShipStation integration'})
      }
      if(!req.params.shipment || !(typeof req.params.shipment === 'object')) {
        return res.status(404).json({code: 404, message: 'Missing shipment object'});
      }
      let params = {
        carrierCode: req.params.shipment.carrierCode,
        serviceCode: req.params.shipment.serviceCode,
        packageCode: req.params.shipment.packageCode || 'package',
        weight: req.params.shipment.weight,
        shipTo: {
          name: req.params.shipTo.name || req.params.shipTo.company,
          company: req.params.shipTo.company,
          street1: req.params.shipTo.address.address_1,
          street2: req.params.shipTo.address.address_2,
          street3: req.params.shipTo.address.address_3,
          city: req.params.shipTo.address.city,
          state: req.params.shipTo.address.state_code,
          country: req.params.shipTo.address.country_code,
          postalCode: req.params.shipTo.address.postal_code,
          residential: req.params.shipTo.residential
        },
        shipFrom: {
          name: req.params.shipFrom.name || req.params.shipFrom.company,
          company: req.params.shipFrom.company,
          street1: req.params.shipFrom.address.address_1,
          street2: req.params.shipFrom.address.address_2,
          street3: req.params.shipFrom.address.address_3,
          city: req.params.shipFrom.address.city,
          state: req.params.shipFrom.address.state_code,
          country: req.params.shipFrom.address.country_code,
          postalCode: req.params.shipFrom.address.postal_code,
        },
        testLabel: req.params.testLabel
      };

      Request.post(Request.endpoints.LABELS_CREATE, params, {user: req.carrier_settings.shipstation.options.api_key, pass: req.carrier_settings.shipstation.options.api_secret}).then((label) => {
        let labelRef = admin.database().ref(`/shipping_labels/${req.headers.organization_id}`).push();
        labelRef.set(label);
        return res.json(label);
      }).catch((err) => {
        return res.code(err.code).json({code: err.code, message: err.message});
      });
    }).catch((err) => {
      return res.code(err.code).json({code: err.code, message: err.message});
    })
  };

  handleListLabels(req, res) {
    Request.get(Label.endpoints.LIST, req.params, {user: req.carrier_settings.shipstation.options.api_key, pass: req.carrier_settings.shipstation.options.api_secret}).then((labels) => {
      return res.json(labels);
    }).catch((err) => {
      return res.code(err.code).json({code: err.code, message: err.message});
    });
  };
}

exports.Labels = new Labels();
