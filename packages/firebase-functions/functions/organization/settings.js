const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const validateJSAPI = require('./validate-jsapi').validateJSAPI;

exports.default = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if(req.method !== 'GET') {
      res.status(403).json({message: 'Forbidden!'});
    }

    if(!req.query.jsapi_key) {
      res.status(404).json({message: 'Missing Access Token'});
    }

    if(!req.query.organization) {
      return res.status(404).json({error: 'Missing organization parameter'});
    }
    
    const organization = req.query.organization;
    const jsapi_key = req.query.jsapi_key;
    validateJSAPI(req.headers.host, organization, jsapi_key)
      .then(admin.database().ref(`/settings/${organization}`).once('value')
      .then((snapshot) => {
        let settings = snapshot.val();
        if(!settings || !settings.organization || !settings.payment) {
          return res.status(404).json({error: 'Missing organization settings'});
        }

        let outSettings = {
          company_address: settings.organization.company_address,
          test_mode: settings.organization.test_mode,
          support_email: settings.organization.support_email,
          support_phone: settings.organization.support_phone,
          website_url: settings.organization.website_url,
          payment: {
            stripe: {
              active: settings.payment.gateway === 'stripe',
              options: {
                live_public_key: settings.payment.stripe.options.live_public_key,
                test_public_key: settings.payment.stripe.options.test_public_key,
                test_mode: settings.payment.stripe.options.test_mode
              }
            },
            braintree: {
              active: settings.payment.gateway === 'braintree'
            },
            paypal_express: {
              active: settings.payment.paypal_express.active || false
            },
            amazon_express: {
              active: settings.payment.amazon_express.active || false
            }
          }
        };

        res.status(200).json(outSettings);
      })
    ).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    })
  });
});
