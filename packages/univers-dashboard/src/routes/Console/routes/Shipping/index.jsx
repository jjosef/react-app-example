import { routeStates as R } from '~/constants';
import Root from './Root';
import Carriers from './routes/Carriers';

// Sync route definition
export default {
  path: R.SHIPPING,
  component: Root,
  childRoutes: [
    Carriers
  ]
}
