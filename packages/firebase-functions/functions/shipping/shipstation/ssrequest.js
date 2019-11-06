const request = require('request')
const admin = require('firebase-admin')

const SS_API_HOST = 'https://ssapi.shipstation.com';

class Request {
  static get(url, data, auth) {
    if(!auth.user || !auth.pass) {
      return Promise.reject({code: 500, message: 'Missing authentication for Shipstation'});
    }
    return new Promise((resolve, reject) => {
      request.get({url: url, qs: data, json: true, auth: auth}, (err, res, body) => {
        if(err) {
          return reject(err);
        }
        if(res.statusCode >= 400) {
          return reject({code: res.statusCode, message: body});
        }
        return resolve(body);
      });
    });
  }

  static post(url, data, auth) {
    if(!auth.user || !auth.pass) {
      return Promise.reject({code: 500, message: 'Missing authentication for Shipstation'});
    }
    return new Promise((resolve, reject) => {
      request.post({url: url, form: data, json: true, auth: auth}, (err, res, body) => {
        if(err) {
          return reject(err);
        }
        if(res.statusCode >= 400) {
          return reject({code: res.statusCode, message: body});
        }
        return resolve(body);
      });
    });
  }

  static put(url, data, auth) {
    if(!auth.user || !auth.pass) {
      return Promise.reject({code: 500, message: 'Missing authentication for Shipstation'});
    }
    return new Promise((resolve, reject) => {
      request.put({url: url, qs: data, json: true, auth: auth}, (err, res, body) => {
        if(err) {
          return reject(err);
        }
        if(res.statusCode >= 400) {
          return reject({code: res.statusCode, message: body});
        }
        return resolve(body);
      });
    });
  }

  static del(url, data, auth) {
    if(!auth.user || !auth.pass) {
      return Promise.reject({code: 500, message: 'Missing authentication for Shipstation'});
    }
    return new Promise((resolve, reject) => {
      request.delete({url: url, qs: data, json: true, auth: auth}, (err, res, body) => {
        if(err) {
          return reject(err);
        }
        if(res.statusCode >= 400) {
          return reject({code: res.statusCode, message: body});
        }
        return resolve(body);
      });
    });
  }
}

Request.endpoints = {
  RATES: SS_API_HOST + '/shipments/getrates',
  CARRIERS_LIST: SS_API_HOST + '/carriers',
  CARRIERS_PACKAGES: SS_API_HOST + '/carriers/listpackages',
  CARRIERS_SERVICES: SS_API_HOST + '/carriers/listservices',
  LABELS_CREATE: SS_API_HOST + '/shipments/createlabel',
  LABELS_LIST: SS_API_HOST + '/shipments'
};

exports.Request = Request;
