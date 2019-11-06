import path from 'path';
import os from 'os';
export default {
  application_name: 'Univers Test API',
  application_host: 'localhost',
  api_port: process.env.PORT || 3459,
  version: '1.0.0',
  firebase: {
    credential: path.join(__dirname, 'firebase.credential.json'),
    databaseURL: 'https://PROJECT-ID.firebaseio.com/'
  },
  module_folder: path.join(__dirname, 'modules')
};
