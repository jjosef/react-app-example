const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const webhooks = require('./webhooks');
const Taxes = require('./taxes').taxes;
exports.webhookCustomers = webhooks.customers;
exports.webhookDiscounts = webhooks.discounts;
exports.webhookGiftCards = webhooks.gift_cards;
exports.webhookOrders = webhooks.orders;
exports.webhookProducts = webhooks.products;
exports.organizationSettings = require('./organization/settings').default;
exports.organizationApps = require('./organization/apps').default;
exports.oAuthProviders = {
  medium: require('./oAuthProviders/medium').authorizeMedium
}
exports.connector = require('./connector').authorizeApps;
exports.utilities = {
  imager: require('./utilities/imager').default,
  notifier: require('./utilities/notifier').default,
  notificationTemplates: require('./utilities/notification-templates')
};
exports.shipping = require('./shipping').shipping;
exports.taxes = new Taxes().init();

admin.initializeApp(functions.config().firebase);

exports.giftcardLookup = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      res.status(403).json({error: 'Forbidden!'});
    }

    const organization = req.body.organization;
    const code = req.body.code;

    if(!organization) {
      return res.status(404).json({error: 'Missing organization parameter'});
    }

    if(!code) {
      return res.status(404).json({error: 'Missing code parameter'});
    }

    admin.database().ref(`/gift_cards/${organization}`).once('value').then((snapshot) => {
      let found;
      snapshot.forEach((gcs) => {
        gc = gcs.val();
        if(gc.code === code) {
          found = gc;
          return true;
        }
      });
      if(found) {
        return res.status(200).json(found);
      } else {
        return res.status(404).json({error: 'Could not find gift card'});
      }
    });
  })

});

exports.discountLookup = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== 'POST') {
      res.status(403).json({error: 'Forbidden!'});
    }

    const organization = req.body.organization;
    const code = req.body.code;

    if(!organization) {
      return res.status(404).json({error: 'Missing organization parameter'});
    }

    if(!code) {
      return res.status(404).json({error: 'Missing code parameter'});
    }

    admin.database().ref(`/discounts/${organization}`).once('value').then((snapshot) => {
      let found;
      snapshot.forEach((gcs) => {
        gc = gcs.val();
        if(gc.code === code) {
          found = gc;
          return true;
        }
      });

      if(found) {
        return res.status(200).json(found);
      } else {
        return res.status(404).json({error: 'Could not find discount code'});
      }
    });
  })

});
