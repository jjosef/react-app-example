import { routeStates as R } from '~/constants';
import Root from './Root';
import Create from './components/Create';
import Update from './components/Update';

// Sync route definition
export default {
  path: R.PRODUCT_CATEGORIES,
  component: Root,
  childRoutes: [
    Create,
    Update
  ]
}
