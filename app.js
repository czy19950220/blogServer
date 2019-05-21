let createError = require('http-errors');
let express = require('express');
let cors = require('cors');
let path = require('path');
let favicon = require('serve-favicon');
let fs = require('fs');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let session = require('express-session');
let gm = require('gm').subClass({imageMagick: true});

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let froalaRouter = require('./routes/froala')

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'testapp',
    cookie: { maxAge: 80000 },
    resave: false,
    saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/*app.use(express.urlencoded({ extended: false }));*/
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, '../bower_components')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/froala', froalaRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
