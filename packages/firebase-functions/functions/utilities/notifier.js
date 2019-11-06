const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const MailgunAPI = require('mailgun-js');
const nodemailer = require('nodemailer');
const fbUser = require('../user/validate');

const handleGmailSendEmail = (req) => {
  let config = req.body;

  const mailTransport = nodemailer.createTransport(
    `smtps://${functions.config().gmail.email}:${functions.config().gmail.password}@smtp.gmail.com`);

  return new Promise((resolve, reject) => {
    let data = {
      from: functions.config().gmail.email,
      to: config.to,
      replyTo: config.replyTo,
      subject: config.subject,
      html: config.htmlMessage,
      text: config.textMessage,
      attachments: [config.attachment]
    };

    return mailTransport.sendMail(data).then((err) => {
      if (err) {
        return reject(err);
      }

      // use firebase database
      let childRef = univers.admin.database().ref(`/notifications/${req.user.uid}/`).push();
      let id = childRef.key;
      let notification = {type: 'email', content: body, timestamp: new Date().getTime()};
      childRef.set(notification).then(() => {
        return resolve(notification);
      }).catch((err) => {
        return reject(err);
      });
    }).catch((err) => {
      return reject(err);
    });
  });
};

const handleMailgunSendEmail = (req) => {
  let config = req.body;

  var mailgun = new MailgunAPI({
    apiKey: functions.config().mailgun.api_key,
    domain: functions.config().mailgun.domain
  });
  return new Promise((resolve, reject) => {
    let data = {
      from: functions.config().mailgun.email_from,
      to: config.to,
      replyTo: config.replyTo,
      subject: config.subject,
      html: config.htmlMessage,
      text: config.textMessage,
      attachment: config.attachment
    };

    mailgun.messages().send(data, function (err, body) {
      if (err) {
        return reject(err);
      }

      // use firebase database
      let childRef = univers.admin.database().ref(`/notifications/${req.user.uid}/`).push();
      let id = childRef.key;
      let notification = {type: 'email', content: data, timestamp: new Date().getTime(), mailgun_id: body.id};
      childRef.set(notification).then(() => {
        return resolve(notification);
      }).catch((err) => {
        return reject(err);
      });
    });
  });
};

exports.default = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    fbUser.validateFirebaseIdToken(req).then((user) => {
      if(!validator.isEmail(req.body.organization)) {
        return res.status(404).json({code: 404, message: 'Missing organization parameter'});
      }
      if(!validator.isEmail(req.body.to)) {
        return res.status(404).json({code: 404, message: 'Missing to field'});
      }
      if(validator.isEmpty(req.body.subject || '')) {
        return res.status(404).json({code: 404, message: 'Missing subject field'});
      }
      if(validator.isEmpty(req.body.htmlMessage || '') && validator.isEmpty(req.body.textMessage || '')) {
        return res.status(404).json({code: 404, message: 'Missing htmlMessage or textMessage field'});
      }

      let method;
      if(functions.config().notifer.provider === 'gmail') {
        method = 'handleGmailSendEmail';
      } else if(functions.config().notifier.provider === 'mailgun') {
        method = 'handleMailgunSendEmail';
      } else {
        return res.status(404).json({code: 404, message: 'Invalid notifier provider'});
      }

      method(req).then((result) => {
        return res.json(result);
      }).catch((err) => {
        return res.status(500).json({code: 500, message: err.message});
      });
    });
  });
});
