const proxy = require('http-proxy-middleware');
const frameguard = require('frameguard')

module.exports = function(app) {
  app.use(frameguard({
    action: 'allow-from',
    domain: 'https://artsandculture.google.com/'
  }))
  app.use(proxy('/api', { target: 'http://server:3001' }));
};
