const loopback = require('loopback');
const boot     = require('loopback-boot');
const path     = require('path');
const raven    = require('raven');

const env = process.env.NODE_ENV || 'development';
const app = module.exports = loopback();

const dsn = process.env.RAVEN_DSN || 
  'https://da7785c75c21461cb03821b4168a20b0@app.getsentry.com/90501';
const ravenClient = new raven.Client(dsn);

ravenClient.patchGlobal();

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
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
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

  //An Error Handler
  app.use(function handleErrors(err, req, res, next) {
    var errorCode;
    if (err) {
      try {
        var code = err.code || err.status || err.statusCode || false;
        if (code) {
          errorCode = parseInt(code);
        }
      } catch (e) {
        errorCode = false;
      }
    }

    ravenClient.captureMessage(err.message || err, {
      extra: {
        error: err,
        code: errorCode,
        method: req.method,
        url: req.originalUrl,
        body: req.body
      }
    });

    next(err);
  });
}