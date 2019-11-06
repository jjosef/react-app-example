import { routeStates as R } from '~/constants';
import ConsoleView from './components/ConsoleView'
import Settings from './routes/Settings';
import Products from './routes/Products';
import Organizations from './routes/Organizations';
import Customers from './routes/Customers';
import Connect from './routes/Connect';
import OAuth from './routes/OAuth';
import Orders from './routes/Orders';
import Discounts from './routes/Discounts';
import Staff from './routes/Staff';
import Shipping from './routes/Shipping';
import Integrations from './routes/Integrations';

export default {
  path: R.CONSOLE,
  component: ConsoleView,
  childRoutes: [
    Settings,
    Products,
    Organizations,
    Staff,
    Customers,
    Connect,
    OAuth,
    Orders,
    Discounts,
    Shipping,
    Integrations
  ]
  /*
  getChildRoutes(partialNextState, cb) {
    require.ensure([], (require) => {
      cb(null, [
        // put child routes here
      ])
    })
  },
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/ConsoleView'))
    }, 'console')
  }
  */
}
