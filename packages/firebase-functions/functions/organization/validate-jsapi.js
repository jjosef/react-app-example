const admin = require('firebase-admin');

/**
 *  This method validates a JSAPI request by checking the key and hostnames for validity.
 */
exports.validateJSAPI = (host, organization, jsapi_key) => {
  return new Promise((resolve, reject) => {
    admin.database().ref(`/organization_scripts/${organization}/${jsapi_key}`).once('value').then((snapshot) => {
      let hostnames = snapshot.val();
      if(!hostnames || !hostnames.hostname || !hostnames.hostname.length) {
        return reject({message: 'Invalid JSAPI Key'});
      }

      if(hostnames.hostname === '*') {
        return resolve(true);
      }

      if(hostnames.hostname.indexOf(host) > 0) {
        return resolve(true);
      } else {
        return reject({message: 'Invalid JSAPI Key'});
      }
    });
  });
}
