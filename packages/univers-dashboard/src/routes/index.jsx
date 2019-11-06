// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import SignUp from './Auth/SignUp';
import { JoinOrganization, SignupOrganization } from './Auth/OrgSignUp';
import Console from './Console';
import { routeStates as R } from '../constants/';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */



export const createRoutes = (store) => {
  return [{
    path        : R.HOME,
    component   : CoreLayout,
    indexRoute  : Home,
    childRoutes : [
      SignUp,
      JoinOrganization,
      SignupOrganization,
      Console
    ]
  },
  {
    path: R.ORDERS,
    onEnter: (nextState, replace) => replace(R.parse(R.ORDERS_TYPE, {type: 'pending'}))
  },
  {
    path: R.CUSTOMERS,
    onEnter: (nextState, replace) => replace(R.parse(R.CUSTOMERS_TYPE, {type: 'online'}))
  },
  {
    path: '*',
    onEnter: (nextState, replace) => replace(R.HOME)
  }]
}
/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./Counter').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes
