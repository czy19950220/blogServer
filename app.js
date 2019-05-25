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

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name:'czyBlog',//cookie的name
    cookie: {user: "default", maxAge: 14 * 24 * 60 * 60 * 1000},//过期时间 ms
    resave: false,
    saveUninitialized: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
/*app.use(express.urlencoded({ extended: false }));*/
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/froala', froalaRouter);

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
