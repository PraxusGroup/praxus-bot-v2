const loopback = require('loopback');
const boot     = require('loopback-boot');
const path     = require('path');
const raygun   = require('raygun');
const monitor  = require('express-status-monitor');
const env      = process.env.NODE_ENV || 'development';

const app = module.exports = loopback();

app.start = function() {
  
  // start the web server
  return app.listen(function() {
    var baseUrl = app.get('url').replace(/\/$/, '');
    var explorerPath;
    var angularPath = '../client/dist/';
    
    app.emit('started');
    
    console.log('Web server listening at: %s', baseUrl);
    
    if (env !== 'production' && 
      app.get('loopback-component-explorer')) {

      angularPath = '../client/src/';
        
      explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log(`Browse your REST API at ${baseUrl}${explorerPath}`);
    }
    
    mountAngular(angularPath);
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
  

function mountAngular(mountPath) {
  const staticPath = path.resolve(__dirname, mountPath);
  const raygunClient = new raygun.Client().init({
    apiKey: app.datasources.raygun.settings.token
  });

  app.use(monitor());
  
  app.use(loopback.static(staticPath));

  // any other routes:
  app.use('/*', function(req, res, next) {
    
    if (req.originalUrl.includes('api')) {
      return next();
    } 
    if (req.originalUrl.includes('js.map')) {
      return next();
    }
    
    res.sendFile(staticPath + '/index.html');
  });

  app.get('remoting').errorHandler = {
    handler: function(error, req, res, next) {
      raygunClient.send(error);
      next();
    },
    disableStackTrace: env !== 'production'
  };

}