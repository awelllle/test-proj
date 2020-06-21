
'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let RequestSchema = new Schema({
    
    name: String,
    gender: String,
    lga: String,
    city: String,
    status: String,
    agent: String,
    
    created: {type: Date, require:true, default: Date.now}
});


module.exports = mongoose.model('Request', RequestSchema);
