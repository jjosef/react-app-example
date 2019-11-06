const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')({origin: true});
const router = new express.Router();
const validator = require('validator');
const Taxjar = require('taxjar');

class Taxes {

  constructor() {}

  init() {
    router.use(cors);
    router.use(this.validateOrganizationSettings.bind(this));
    router.post('/rate', this.handleTaxRating.bind(this));

    return functions.https.onRequest((req, res) => {
      return router(req, res)
    });
  }

  getSettings(organizationId) {
    return new Promise((resolve, reject) => {
      admin.database().ref(`/organization_apps/${organizationId}`).once('value').then((snapshot) => {
        let settings = snapshot.val();
        if(!settings) {
          return reject({code: 404, message: 'App settings not found for organization'})
        }

        return resolve(settings);
      })
    });
  }

  validateOrganizationSettings(req, res, next) {
    if(!req.headers.organization_id) {
      return res.status(404).json({message: 'Missing organization_id header'});
    }

    this.getSettings(req.headers.organization_id).then((settings) => {
      req.app_settings = settings;
      next();
    }).catch((err) => {
      res.status(err.code).json(err);
    })
  }

  handleTaxRating(req, res, next) {
    if(!validator.isFloat(req.body.amount || '')) {
      return res.status(500).json({code: 500, message: 'amount needs to be a number, submitted: ' + req.body.amount});
    }
    if(!validator.isAlphanumeric(req.body.postal_code || '')) {
      return res.status(500).json({code: 500, message: 'postal_code needs to be valid'});
    }

    Taxes.taxjarRating(req.app_settings, req.body.amount, req.body.postal_code, req.body.address).then((amount) => {
      res.json({tax: amount});
    }).catch((err) => {
      return res.status(err.status).json({code: err.status, message: err.detail});
    })
  }

  /**
   *  Get TaxJar settings from app settings
   *
   *  @method getTaxJarSettings
   */
  static getTaxJarSettings(app_settings) {
    let api_key = (app_settings.taxjar && app_settings.taxjar.active && app_settings.taxjar.options.api_key) ? app_settings.taxjar.options.api_key : null;
    return api_key
  }

  /**
   *  Get a rating amount based on an amount and location from TaxJar
   *
   *  @method taxjarRating
   *  @param amount Number The amount the calculate tax for
   *  @param postal_code String The postal code for the taxation
   *  @param address [Object] The optional address components for the taxation
   *  @param address.city [String] City parameter for address
   *  @param address.street [String] Street parameter for address
   *  @param address.country [String] Country parameter for address (2 letter code)
   *
   */
  static taxjarRating(app_settings, amount, postal_code, address) {
    return new Promise((resolve, reject) => {
      let api_key = Taxes.getTaxJarSettings(app_settings);
      if(!api_key) {
        return reject({code: 404, message: 'Missing app settings for TaxJar'});
      }
      console.log(`TaxJar API: ${api_key}`);
      let client = new Taxjar(api_key);
      return client.ratesForLocation(postal_code, address).then((res) => {
        let tax = (parseFloat(amount) * parseFloat(res.rate.combined_rate)).toFixed(2);
        return resolve(tax);
      }).catch((err) => {
        console.log(err);
        return reject(err);
      });
    });
  }
}

exports.taxes = Taxes;
