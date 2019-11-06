/**
 *  This script is intended to run all the deployments for all packages
 *
 */

const exec = require('child_process').exec;
const path = require('path');

const executions = {
  'api-orders': 'gcloud config set project univers-api-orders && gcloud app deploy ./app.yaml',
  'api-shipping': 'gcloud config set project univers-api-shipping && gcloud app deploy ./app.yaml',
  'api-utilities': 'gcloud config set project univers-api-utilities && gcloud app deploy ./app.yaml',
  'firebase-functions': 'firebase deploy',
  'univers-dashboard': 'NODE_ENV=production yarn run deploy && firebase deploy'
}

let execDeploy = (e) => {
  return new Promise((resolve, reject) => {
    let s = exec(executions[e], {
      cwd: path.join(__dirname, '..', 'packages', e),
      shell: true,
      uid: process.getuid(),
      gid: process.getgid()
    }, (error, stdout, stderr) => {
      if(error) {
        return reject(`${e} failed! ${error}`);
      }

      console.log(stderr);
      console.log(stdout);
      return resolve(`${e} completed!`);
    });
  });
}

let dProcesses = [];
for(let e in executions) {
  dProcesses.push(execDeploy(e));
}

Promise.all(dProcesses).then((result) => {
  console.log(result);
  process.exit();
}).catch((err) => {
  console.log(err);
  process.exit();
})
