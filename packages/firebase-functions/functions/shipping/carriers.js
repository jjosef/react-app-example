const Request = require('./shipstation/ssrequest').Request;

class Carriers {
  handleListCarriers(req, res) {
    let carriers = [];
    if(req.carrier_settings.free_rate && req.carrier_settings.free_rate.active) {
      carriers.push({
        name: "Free",
        code: 'univers_free_rate',
        shipmentCost: 0.0,
        minimum_order: req.carrier_settings.free_rate.options.minimum_order
      });
    }
    if(req.carrier_settings.flat_rate && req.carrier_settings.flat_rate.active) {
      carriers.push({
        name: req.carrier_settings.flat_rate.options.description || 'Flat Rate',
        code: 'univers_flat_rate',
        shipmentCost: req.carrier_settings.flat_rate.options.amount || 1.0
      });
    }
    if(req.carrier_settings.shipstation && req.carrier_settings.shipstation.active) {
      Request.get(Request.endpoints.CARRIERS_LIST, req.query, {user: req.carrier_settings.shipstation.options.api_key, pass: req.carrier_settings.shipstation.options.api_secret}).then((ssCarriers) => {
        ssCarriers.map((carrier) => {
          carrier.integration = 'shipstation';
        });
        carriers = carriers.concat(ssCarriers);
        res.json(carriers);
      }).catch((err) => {
        return res.status(err.code).json({code: err.code, message: err.message});
      });
    } else {
      res.json(carriers);
    }
  };

  handleListCarrierServices(req, res) {
    let services = [];
    if(req.carrier_settings.shipstation && req.carrier_settings.shipstation.active) {
      Request.get(Request.endpoints.CARRIERS_SERVICES, req.query, {user: req.carrier_settings.shipstation.options.api_key, pass: req.carrier_settings.shipstation.options.api_secret}).then((ssServices) => {
        ssServices.map((service) => {
          service.integration = 'shipstation';
        });
        services = services.concat(ssServices);
        res.json(services);
      }).catch((err) => {
        return res.status(err.code).json({code: err.code, message: err.message});
      });
    } else {
      res.json(services);
    }
  };

  handleListCarrierPackages(req, res) {
    let packages = [];
    if(req.carrier_settings.shipstation && req.carrier_settings.shipstation.active) {
      Request.get(Request.endpoints.CARRIERS_PACKAGES, req.query, {user: req.carrier_settings.shipstation.options.api_key, pass: req.carrier_settings.shipstation.options.api_secret}).then((ssPackages) => {
        ssPackages.map((pkg) => {
          pkg.integration = 'shipstation';
        });
        packages = packages.concat(ssPackages);
        res.json(packages);
      }).catch((err) => {
        return res.status(err.code).json({code: err.code, message: err.message});
      });
    } else {
      res.json(packages);
    }
  };
}

exports.Carriers = new Carriers();
