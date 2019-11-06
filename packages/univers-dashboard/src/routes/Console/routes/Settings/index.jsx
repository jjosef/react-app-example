import { routeStates as R } from '~/constants';
import Root from './Root';
import NotificationTemplates from './routes/NotificationTemplates';
import Organization from './routes/Organization';
import Payments from './routes/Payments';
import Sonar from './routes/Sonar';

// Sync route definition
export default {
  path: R.SETTINGS,
  component: Root,
  childRoutes: [
    NotificationTemplates,
    Organization,
    Payments,
    Sonar
  ]
}
