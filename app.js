var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connect('localhost:27017/code-connects', function(err) {
    if (err) throw err;
});

mongoose.connection.on('connected', function(){
    console.log("successfully connected!");
})

// import entire SDK
// var AWS = require('aws-sdk');
// // import AWS object without services
// var AWS = require('aws-sdk/global');
// // import individual service
// var S3 = require('aws-sdk/clients/s3');

require('./config/passport')(passport);

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'codeconnectssupersecretsessionpass' }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req, res, next){
    req.db = db;
    next();
})

app.use('/', index);
app.use('/users', users);
var auth = require('./routes/auth')(app, passport);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
