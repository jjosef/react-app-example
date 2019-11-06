'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')({origin: true});
const router = new express.Router();
const crypto = require('crypto');

const validateFirebaseIdToken = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
        'Make sure you authorize your request by providing the following HTTP header:',
        'Authorization: Bearer <Firebase ID Token>');
    res.status(403).json({error: 'Unauthorized'});
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    console.log('ID Token correctly decoded', decodedIdToken);
    admin.auth().getUser(decodedIdToken.uid).then((userRecord) => {
      req.user = userRecord;
      next();
    }).catch(error => {
      console.error('Error while getting Firebase User record:', error);
      res.status(403).json({error: 'Unauthorized'});
    });
  }).catch(error => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).json({error: 'Unauthorized'});
  });
};

router.use(cors);
router.use(validateFirebaseIdToken);

const APPS = {
  laika: {
    name: 'Laika',
    description: '',
    permissions: [
      {orders: {r: true, w: false}},
      {discounts: {r: true, w: true}},
      {products: {r: true, w: true}}
    ],
    image: null,
    icon: 'mdi-umbrella',
    api_key: null
  },
  lingo: {
    name: 'Lingo',
    description: 'EDI through eZCom',
    permissions: [
      {orders: {r: true, w: true}},
      {products: {r: true, w: false}}
    ],
    image: null,
    icon: 'mdi-umbrella',
    api_key: null
  }
}

router.post('/authorize_app', (req, res) => {
  // authorize 'code' param submitted from user
  if (req.method !== 'POST') {
    res.status(403).json({error: 'Forbidden!'});
  }
  if(!req.body.key) {
    return res.status(404).json({error: 'Missing key parameter'});
  }

  if(!req.body.app) {
    return res.status(404).json({error: 'Missing app parameter'});
  }

  if(!APPS[req.body.app]) {
    return res.status(404).json({error: 'App not found'});
  }

  let app = Object.assign({}, APPS[req.body.app]);
  app.api_key = req.body.key;
  res.json(app);
});

exports.authorizeApps = functions.https.onRequest((req, res) => {
  return router(req, res)
});
