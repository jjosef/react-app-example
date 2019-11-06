import { routeStates as R } from '~/constants';
import Root from './Root';
import Create from './components/Create';
import Update from './components/Update';
import Permissions from './routes/Permissions';

// Sync route definition
export default {
  path: R.STAFF,
  component: Root,
  childRoutes: [
    Create,
    Update,
    Permissions
  ]
}
