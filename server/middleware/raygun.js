const ray = require('raygun');
const env = process.env.NODE_ENV || 'development';
var raygunKey;

if (env === 'development') {
  raygunKey = require('../datasources.local').raygun.token;
} else {
  raygunKey = process.env.RAYGUN_APIKEY;
}

const client = new ray.Client().init({apiKey: raygunKey});

module.exports = function() {
  return function raygun(err, req, res, next) {
    client.send(err);
    console.log(err);
    next(err);
  };
};