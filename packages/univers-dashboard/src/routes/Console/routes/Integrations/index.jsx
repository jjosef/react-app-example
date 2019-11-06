import { routeStates as R } from '~/constants';
import Root from './Root';
import Apps from './routes/Apps';
import Scripts from './routes/Scripts';
import Webhooks from './routes/Webhooks';
import Design from './routes/Design';

// Sync route definition
export default {
  path: R.INTEGRATIONS,
  component: Root,
  childRoutes: [
    Apps,
    Scripts,
    Webhooks,
    Design
  ]
}
