const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const favicon = require('serve-favicon');
const fs = require('fs');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const gm = require('gm').subClass({imageMagick: true});
const passport = require('passport');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let froalaRouter = require('./routes/froala');
let novelRouter = require('./routes/novel');


let app = express();
let address = require('address');

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("X-Powered-By", ' 3.2.1')
    console.log(req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]);
    if (req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
    else next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'czyBlog',//cookie的name
    cookie: {user: "default", maxAge: 14 * 24 * 60 * 60 * 1000},//过期时间 ms
    resave: false,
    saveUninitialized: true
}));

app.use(logger('dev'));
/*app.use(express.json());*/
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json({limit: "1050mb"}));
app.use(bodyParser.urlencoded({limit: "1050mb", extended: true}));
/*app.use(express.urlencoded({ extended: false }));*/
app.use(express.static(path.join(__dirname, 'public')));
// passport 初始化
app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/froala', froalaRouter);
app.use('/novel', novelRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
