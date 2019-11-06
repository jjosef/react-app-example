const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')({origin: true});
const router = new express.Router();
const request = require('request');
const Rates = require('./rates').Rates;
const Labels = require('./labels').Labels;
const Carriers = require('./carriers').Carriers;

const getSettings = (organizationId) => {
  return new Promise((resolve, reject) => {
    admin.database().ref(`/shipping_carriers/${organizationId}`).once('value').then((snapshot) => {
      let settings = snapshot.val();
      if(!settings) {
        return reject({code: 404, message: 'Shipping carriers not found for organization'})
      }

      return resolve(settings);
    })
  });
}
exports.getSettings = getSettings;

const validateOrganizationSettings = (req, res, next) => {
  if(!req.headers.organization_id) {
    return res.status(404).json({message: 'Missing organization_id header'});
  }

  getSettings(req.headers.organization_id).then((settings) => {
    req.carrier_settings = settings;
    next();
  }).catch((err) => {
    res.status(err.code).json(err);
  })
}

router.use(cors);
router.use(validateOrganizationSettings);
router.post('/rates', Rates.handleQuote);
router.post('/label/create', Labels.handleCreateLabel);
router.get('/label/list', Labels.handleListLabels);
router.get('/carriers', Carriers.handleListCarriers);
router.get('/carriers/services', Carriers.handleListCarrierServices);
router.get('/carriers/packages', Carriers.handleListCarrierPackages);

exports.shipping = functions.https.onRequest((req, res) => {
  return router(req, res)
});
