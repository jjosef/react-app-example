import { routeStates as R } from '~/constants';
import Root from './Root';
import Create from './components/Create';
import Update from './components/Update';
import ProductCategories from './routes/ProductCategories';
import ProductInventory from './routes/Inventory';
import GiftCards from './routes/GiftCards';

// Sync route definition
export default {
  path: R.PRODUCTS,
  component: Root,
  childRoutes: [
    Create,
    Update,
    ProductCategories,
    ProductInventory,
    GiftCards
  ]
}
