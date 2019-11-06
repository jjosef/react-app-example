export default {
	// ACTIONS
  AUTH_CREATE: 'AUTH_CREATE',
	AUTH_OPEN: 'AUTH_OPEN',
	AUTH_LOGIN: 'AUTH_LOGIN',
	AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_UPDATE: 'AUTH_UPDATE',
  AUTH_SWITCHING_ORGANIZATION: 'AUTH_SWITCHING_ORGANIZATION',

	// STATES
	AUTH_ANONYMOUS: 'AUTH_ANONYMOUS',
	AUTH_AWAITING_RESPONSE: 'AUTH_AWAITING_RESPONSE',
	AUTH_LOGGED_IN: 'AUTH_LOGGED_IN',

  // ERRORS
  FEEDBACK_DISPLAY_ERROR: 'FEEDBACK_DISPLAY_ERROR',
  // PERMISSIONS
  OWNER_PERMISSIONS: {
    owner: true,
    orders: {r: true, w: true},
    products: {r: true, w: true},
    customers: {r: true, w: true},
    settings: {r: true, w: true},
    discounts: {r: true, w: true},
    integrations: {r: true, w: true}
  }
};
