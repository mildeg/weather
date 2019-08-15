const fs = require("fs")

let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
global.config = config

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const weather = require('./lib/routes/weather');
const index = require('./lib/routes/index');
const ip = require('./lib/api/ip');
ip.setLocationInfo();
// console.log(weather.getRoutes())
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/v1', weather.getRoutes());
app.use('/', index);

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
    res.send('error');
});

let port = config.port

app.listen(port, function () {

    console.log(`App starts on ${port}`)
});


module.exports = app;
