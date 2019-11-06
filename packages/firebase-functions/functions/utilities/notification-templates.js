const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});

const defaultTemplates = [
  {
    name: 'Staff Invitation',
    type: 'email',
    content: '<p>Hey {{staff.name}}, <br /><br />You have been invited to {{organization.name}}. <a href="{{url}}">Click here to join!</a></p>'
  }
]

// set up initial notification templates when an organization is created.
exports.setupDefaults = functions.database.ref('/organizations/{organizationId}').onWrite(event => {
  if(event.data.previous.exists()) {
    // we only want to do this once
    return;
  }

  defaultTemplates.forEach((tpl) => {
    let ntRef = admin.database().ref(`/notification_templates/${event.params.organizationId}`).push();
    ntRef.set(tpl)
  })
});
