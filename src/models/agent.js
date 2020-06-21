
'use strict';
const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

let AgentsSchema = new Schema({
    
    name: String,
    phone: String,
    

    created: {type: Date, require:true, default: Date.now}
});



module.exports = mongoose.model('Agent', AgentsSchema);
