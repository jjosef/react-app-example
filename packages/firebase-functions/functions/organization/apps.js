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
      .then(admin.database().ref(`/organization_apps/${organization}`).once('value')
      .then((snapshot) => {
        let settings = snapshot.val();
        if(!settings) {
          return res.status(404).json({error: 'Missing organization settings'});
        }

        let outSettings = {};
        for(let app in settings) {
          outSettings[app] = {
            active: settings[app].active || false
          };
          outSettings[app].options = {};
          if(settings[app].jsapi_options) {
            settings[app].jsapi_options.map((option) => {
              outSettings[app].options[option] = settings[app].options[option];
            });
          }
        }

        res.status(200).json(outSettings);
      })
    ).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    })
  });
});
