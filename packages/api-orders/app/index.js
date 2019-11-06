import univers from 'univers-lib';
import config from './config';

let app = new univers(config).then(function(univers) {
  // Perform actions here that need to occur after
  // modules have loaded.
});
