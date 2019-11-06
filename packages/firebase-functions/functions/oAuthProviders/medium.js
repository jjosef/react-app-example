'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')({origin: true});
const router = new express.Router();
const crypto = require('crypto');
const medium = require('medium-sdk');

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
router.get('/authorization_url', (req, res) => {
  // return 'url' for user to authorize. this can be used in a button or elsewhere.
  let client = new medium.MediumClient({
    clientId: functions.config().medium.client_id,
    clientSecret: functions.config().medium.client_secret
  })

  const state = crypto.randomBytes(20).toString('hex');
  let url = client.getAuthorizationUrl(state, functions.config().medium.redirect_uri, [
    medium.Scope.BASIC_PROFILE, medium.Scope.PUBLISH_POST, medium.Scope.LIST_PUBLICATIONS
  ]);

  // optional usage here to send user immediately to the oAuth endpoint.
  if(req.query.redirect) {
    return res.redirect(url);
  }
  res.json({url: url});
})

router.post('/authorize_token', (req, res) => {
  // authorize 'code' param submitted from user
  if (req.method !== 'POST') {
    res.status(403).json({error: 'Forbidden!'});
  }
  if(!req.body.code) {
    return res.status(404).json({error: 'Missing code parameter'});
  }

  let client = new medium.MediumClient({
    clientId: functions.config().medium.client_id,
    clientSecret: functions.config().medium.client_secret
  })

  client.exchangeAuthorizationCode(req.body.code, functions.config().medium.redirect_uri, (err, tokenData) => {
    if(err) {
      return res.status(500).json({error: err});
    }
    client.getUser((err, user) => {
      if(err) {
        return res.status(500).json({error: err});
      }

      // The organization admin (or user with credentials) can now submit this information to be used.
      // If we can figure out how to set data on behalf of a user utilizing firebase's database rules that
      // would be a more secure way to handle this.
      res.json({user: user, tokenData: tokenData});
    });
  })
});

exports.authorizeMedium = functions.https.onRequest((req, res) => {
  return router(req, res)
});
