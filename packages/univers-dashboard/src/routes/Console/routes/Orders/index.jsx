import { EventEmitter } from 'fbemitter'
import { routeStates as R } from '~/constants';
import Root from './Root';
import Create from './components/Create';
import Update from './components/Update';

// Sync route definition
export default {
  path: R.ORDERS_TYPE,
  component: Root,
  childRoutes: [
    Create,
    Update
  ]
};

// We use this around the app to utilize order events
export const OrderEmitter = new EventEmitter()
