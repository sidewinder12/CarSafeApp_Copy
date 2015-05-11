var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var flash = require('connect-flash');
var config = require('./config');
var mongoose = require('mongoose');
var app = express();
var appRoot = require('app-root-path');


//console.log(path.dirname(require.main.filename));


// user session setup
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

app.use(session({
    secret: config.cookieSecret,
    url:config.uri,
    cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
    store: new MongoStore({
        url: config.uri
    }),
    resave: true,
    saveUninitialized: true
}));

// only do this ONCE in the app to intiate DB connection, if the environment is not testing.
if (process.env.NODE_ENV != 'testing') {
    console.log('not testing env');
    mongoose.connect(config.uri);
}


// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection ' +
        '' +
        'disconnected through app termination');
        process.exit(0);
    });
});

// set favicon
app.use(favicon(appRoot+"/public/img/favicon.ico"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(flash());


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
