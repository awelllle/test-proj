
const request = require('request');
const util = require('../helpers/utility');
const jwt  = require('jsonwebtoken');



exports.authenticate = (req, res, next) => {
  
    if(req.header('Authorization')){
        const token = req.header('Authorization').split(' ')[1];
        util.authenticate(token, (err, data) => {
            if(err) {    
                return util.sendErrorResponse(res, {}, err);
            }
            console.log(data, "Token decoded");
            req.payload = data;
            return next();

        });
    }else {
        return util.sendErrorResponse(res, [], "No Authorisation Header", 401);
    }
};


