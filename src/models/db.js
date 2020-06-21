/* eslint-disable no-console */

const mongoose = require( 'mongoose' ),
    config = require('../config/config');

const ENV = process.env.NODE_ENV;
let dbUrl = config.dbUrl.dev;
if(ENV === 'production'){
    dbUrl = encodeURI(config.dbUrl.prod);
}

mongoose.Promise = global.Promise;

const dbName = process.env.DB_NAME;
mongoose.connect(dbUrl, {
    dbName: dbName,
    autoReconnect: true,
    useCreateIndex: true,
    useNewUrlParser: true
}).then((conn) =>{

   // console.log('DB Connected');

}).catch(error => {
    console.log('DB Error', error);
});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbUrl);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

require('./agent');
require('./request');