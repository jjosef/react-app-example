import { formatPattern } from 'react-router';

export default {
  // we can use this to quickly generate complex variable paths
  parse: formatPattern,
  // base paths
  HOME: '/',
  CONSOLE: '/console',
  SIGNUP: '/signup',
  JOIN_ORGANIZATION: '/join/organization/:organization_id/:invite_code',
  SIGNUP_ORGANIZATION: '/signup/organization/:organization_id/:invite_code',
  // Admin
  ADMIN: '/console/admin',
  // Account
  ACCOUNT_NOTIFICATIONS: '/console/account/notifications',
  // Organizations
  ORGANIZATIONS: '/console/organizations',
  ORGANIZATIONS_NEW: '/console/organizations/new',
  ORGANIZATIONS_EDIT: '/console/organizations/edit/:organization_id',
  // Staff
  STAFF: '/console/staff',
  STAFF_NEW: '/console/staff/new',
  STAFF_EDIT: '/console/staff/edit/:staff_id',
  // Permissions
  PERMISSIONS: '/console/staff/permissions',
  // Products
  PRODUCTS: '/console/products',
  PRODUCTS_NEW: '/console/products/items/new',
  PRODUCTS_EDIT: '/console/products/items/edit/:product_id',
  // Product Categories
  PRODUCT_CATEGORIES: '/console/products/categories',
  PRODUCT_CATEGORIES_NEW: '/console/products/categories/new',
  PRODUCT_CATEGORIES_EDIT: '/console/products/categories/edit/:category_id',
  // Product Inventory
  PRODUCT_INVENTORY: '/console/products/inventory',
  // Gift Cards
  GIFT_CARDS: '/console/products/gift-cards',
  GIFT_CARDS_NEW: '/console/products/gift-cards/new',
  GIFT_CARDS_EDIT: '/console/products/gift-cards/edit/:discount_id',
  // Customers
  CUSTOMERS: '/console/customers',
  CUSTOMERS_TYPE: '/console/customers/query/:type',
  CUSTOMERS_NEW: '/console/customers/new',
  CUSTOMERS_EDIT: '/console/customers/edit/:customer_id',
  // Discounts
  DISCOUNTS: '/console/discounts',
  DISCOUNTS_NEW: '/console/discounts/specials/new',
  DISCOUNTS_EDIT: '/console/discounts/specials/edit/:discount_id',
  // Orders
  ORDERS: '/console/orders',
  ORDERS_NEW: '/console/orders/new',
  ORDERS_TYPE: '/console/orders/query/:type',
  ORDERS_EDIT: '/console/orders/edit/:order_id',
  // Settings
  SETTINGS_ACCOUNT: '/console/settings/account',
  SETTINGS_ORGANIZATION: '/console/settings/organization',
  SETTINGS_SECURITY: '/console/settings/security',
  SETTINGS_PAYMENTS: '/console/settings/payments',
  SETTINGS_SONAR: '/console/settings/sonar',
  NOTIFICATION_TEMPLATES: '/console/settings/notification_templates',
  NOTIFICATION_TEMPLATES_NEW: '/console/settings/notification_templates/new',
  NOTIFICATION_TEMPLATES_EDIT: '/console/settings/notification_templates/edit/:notification_template_id',
  // Shipping
  SHIPPING: '/console/shipping',
  SHIPPING_CARRIERS: '/console/shipping/carriers',
  // Social - We don't really need this anymore since auth is done via Firebase
  //        - However, we might want to use this section in the future for other things
  //        - like marketing.
  SOCIAL: '/console/social',
  // Integrations
  INTEGRATIONS_APPS: '/console/integrations/apps',
  INTEGRATIONS_ACCOUNTING: '/console/integrations/accounting',
  INTEGRATIONS_ANALYTICS: '/console/integrations/analytics',
  INTEGRATIONS_SCRIPTS: '/console/integrations/scripts',
  INTEGRATIONS_WEBHOOKS: '/console/integrations/webhooks',
  INTEGRATIONS_WEBHOOKS_NEW: '/console/integrations/webhooks/new',
  INTEGRATIONS_WEBHOOKS_EDIT: '/console/integrations/webhooks/edit/:webhook_id',
  INTEGRATIONS_DESIGN: '/console/integrations/design',
  // OAuth
  OAUTH: '/console/oauth/:provider',
  // connect
  CONNECT: '/console/connect/:app',
  // Capital
  CAPITAL: '/console/capital',
  //Local Delivery
  LOCAL_DELIVERY: '/console/local-delivery',
  // Loyalty
  LOYALTY: '/console/loyalty',
  // Marketing
  MARKETING: '/console/marketing',
  // Payroll
  PAYROLL: '/console/payroll',
  // Portals
  PORTALS: '/console/portals',
  // Reporting
  REPORTING: '/console/reporting',
  // Scheduling
  SCHEDULING: '/console/scheduling',
  // Timecards
  TIMECARDS: '/console/timecards',
}
