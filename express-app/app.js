var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const { check, validationResult } = require('express-validator');


var usersRouter = require('./routes/users');
var commonRouter = require('./routes/common');
var loginRouter = require('./routes/login');
var editRouter = require('./routes/edit');
var newAccountRouter = require('./routes/newAccount');
var addRouter = require('./routes/add');
var personalRouter = require('./routes/personal');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '10mb' })); //trueにするとreq.body.textが配列になる
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let ses_opt = {
  secret: 'my secret',
  resave: false,
  saveUninitialazed: false,
  cookie: { maxAge: 60 * 60 * 1000 }
};
app.use(session(ses_opt));



app.use('/', commonRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/newAccount', newAccountRouter);
app.use('/add', addRouter);
app.use('/personal', personalRouter);
app.use('/edit', editRouter);

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
