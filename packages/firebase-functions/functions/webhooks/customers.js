const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.webhook = functions.database.ref('/customers/{organizationId}/{customerId}').onWrite(event => {
  let organizationId = event.params.organizationId;
  let eventType = 'create';
  if(event.data.previous.exists()) {
    eventType = 'update';
  }
  if(!event.data.exists()) {
    eventType = 'delete';
  }
  let data = {
    type: eventType,
    payload: event.data.val() || {}
  }
  data.payload.id = event.params.customerId;
  admin.database().ref(`/webhooks/${organizationId}`).once('value').then((snapshot) => {
    let found;
    snapshot.forEach((whs) => {
      wh = whs.val();
      if(wh.event === 'customers') {
        found = wh;
        return true;
      }
    });
    if(found) {
      return request({
        uri: found.endpoint_url,
        method: 'POST',
        json: true,
        body: data,
        resolveWithFullResponse: true
      }).then(response => {
        if (response.statusCode >= 400) {
          throw new Error(`HTTP Error: ${response.statusCode}`);
        }
        console.log('SUCCESS! Posted', event.data.ref);
      });
    }
  });
});
