import { routeStates as R } from '~/constants';
import HomeView from '../../Home/components/HomeView';
import SignUpView from '../SignUp/components/SignUpView';

// Sync route definition
export const JoinOrganization = {
  path: R.JOIN_ORGANIZATION,
  component: HomeView
}

export const SignupOrganization = {
  path: R.SIGNUP_ORGANIZATION,
  component: SignUpView
}
