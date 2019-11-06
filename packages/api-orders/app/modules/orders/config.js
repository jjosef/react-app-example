
const config = {
  module_name: 'Orders',
  data_space: 'orders',
  route_space: '/orders',
  version: '1.0.0',
  api: {
    get: {
      enabled: true,
      authentication: true,
      organization: true
      // authentication: true,
      // owner: true,
      // organization: true
      // jsapi: false,
      // jsapi_authentication: false,
      // socket: false,
      // beforeConditions: {},
      // afterConditions: {}
    },
    post: {
      enabled: true,
      //authentication: true,
      //organization: true
    },
    put: {
      enabled: true,
      authentication: true,
      organization: true
    },
    del: {
      enabled: true,
      authentication: true,
      organization: true
    }
  }
};

export default config;
