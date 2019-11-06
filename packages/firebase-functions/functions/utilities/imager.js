const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const request = require('request');
const validateJSAPI = require('../organization/validate-jsapi').validateJSAPI;
const gcs = require('@google-cloud/storage')();
const mkdirp = require('mkdirp-promise');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const http = require('http');
const https = require('https');
const im = require('imagemagick');

const renderImage = (config, existing_image = null) => {
  // - do the request
  // - handle the size, crop, effect
  // - save to db
  // - return image data.
  return new Promise((resolve, reject) => {
    let cleanURL = config.original_url.split(/[?#]/)[0];
    let fileParts = cleanURL.split('/');
    let fileName = fileParts.pop();
    const fileNameParts = fileName.split('.');
    const fileExt = fileNameParts.pop();
    const destFileName = `${fileNameParts}-${config.size}${(config.crop ? '-' + config.crop : '')}${(config.effect ? '-' + config.effect : '')}.${fileExt}`;
    const tempLocalFile = path.join(os.tmpdir(), fileName);
    const tempLocalDir = path.dirname(tempLocalFile);
    const destLocalFile = path.join(os.tmpdir(), destFileName);

    request.get(config.original_url)
      .on('error', (err) => {
        return reject(err);
      })
      .pipe(fs.createWriteStream(tempLocalFile))
      .on('finish', () => {
        let imConfig = [tempLocalFile, '-resize', config.size];
        if(config.crop) {
          imConfig.push('-gravity');
          imConfig.push('Center');
          imConfig.push('-crop');
          imConfig.push(config.crop);
        }
        if(config.effect) {
          imConfig.push(config.effect);
        }
        imConfig.push(destLocalFile);

        im.convert(imConfig, (err, stdout) => {

          if(err) {
            console.log('File contents: ' + fs.readFileSync(tempLocalFile, 'utf8'));
            fs.unlinkSync(tempLocalFile);
            return reject(err);
          }

          const bucket = gcs.bucket(functions.config().firebase.storageBucket);
          const destLocation = `/imager/${config.organization}/${destFileName}`;

          bucket.upload(destLocalFile, {
            destination: destLocation,
            predefinedAcl: 'publicRead'
          }, (err, file) => {
            if (err && !file) {
              return reject(err);
            }

            let imgRef = admin.database().ref(`/imager/${config.organization}/${config.encoded_url}`);
            let fileData = {
              url: file.metadata.mediaLink,
              original_url: config.original_url,
              size: config.size,
              crop: config.crop || null,
              effect: config.effect || null,
              timestamp: new Date().getTime()
            };
            imgRef.set(fileData).then(() => {
              return resolve(fileData);
            }).catch((err) => {
              return reject(err);
            });
          });
        });
      });
  });
};

exports.default = functions.https.onRequest((req, res) => {
  console.log(functions.config().firebase);
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

    if(!req.query.imageURL) {
      return res.status(404).json({error: 'Missing imageURL parameter'});
    }

    if(!req.query.size) {
      return res.status(404).json({error: 'Missing size parameter'});
    }

    // optional parameters:
    // - force
    // - crop
    // - effect

    const organization = req.query.organization;
    const jsapi_key = req.query.jsapi_key;
    const encoded_url = new Buffer(req.query.imageURL).toString('base64');
    validateJSAPI(req.headers.host, organization, jsapi_key)
      .then(admin.database().ref(`/imager/${organization}/${encoded_url}`).once('value')
      .then((snapshot) => {
        let img = snapshot.val();
        console.log(img);
        if(!img) {
          // let's check if the original URL exists
          return renderImage({original_url: req.query.imageURL, size: req.query.size, crop: req.query.crop, effect: req.query.effect, organization: organization, encoded_url: encoded_url}).then((newImage) => {
            res.header('Location', newImage.url);
            res.send(302);
          });
        } else {
          // let's verify the other components like size and crop and effect
          if(!req.query.force && req.query.size === img.size && req.query.crop === img.crop && req.query.effect === img.effect) {
            res.header('Location', img.url);
            return res.send(302);
          }

          return renderImage({original_url: req.query.imageURL, size: req.query.size, crop: req.query.crop, effect: req.query.effect, organization: organization, encoded_url: encoded_url}, img).then((newImage) => {
            res.header('Location', newImage.url);
            res.send(302);
          })
        }
      }).catch((err) => {
        console.error(err);
        res.status(500).json(err);
      })
    ).catch((err) => {
      console.error(err);
      res.status(500).json(err);
    })
  });
});
