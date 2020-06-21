
require('dotenv').load();
const createError = require('http-errors');
const express = require('express');
const path  = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const cors = require('cors');

//Database Configuration
require('./src/models/db');


const indexRouter = require('./src/routes');
const app = express();

app.disable('x-powered-by');//turn off header

// view engine setup
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(compression());
app.use(logger('dev'));
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
//app.use(formData.parse({}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cors());
//app.use('/uploads', express.static('uploads'));
app.options('*', cors());
app.use('/', indexRouter);



//Enable CORS from client side
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT,GET,DELETE,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept, Authorization, Apptoken,' +
        ' Access-Control-Allow-Credential');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
});


/**
 * Api routing section
 */
require('./src/routes/api')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Catch unauthorised errors
// app.use(function (err, req, res, next) {
//     if (err.name === 'UnauthorizedError') {
//         res.status(401);
//         res.json({"message": err.name + ": " + err.message});
//     }else{
//        throw new Error(err);
//     }
// });

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
