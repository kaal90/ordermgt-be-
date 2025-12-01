require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const dbtestRouter = require('./routes/test');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");


app.use('/test', dbtestRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.options("*", cors());

app.use(cors({
  origin: "https://ordermgt-fe.vercel.app/",
  methods: ["GET","POST","PUT","DELETE"],
}));

app.use(helmet());

app.use(rateLimit({ windowMs: 15*60*1000, max: 100 }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/order', orderRoutes);
app.use('/product', productRoutes);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
