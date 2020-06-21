
const request = require('request');
const jwt  = require('jsonwebtoken');


exports.sendJsonResponse = function (res, status, content) {
    res.status(status).json(content);
};
exports.sendErrorResponse = function (res, content, message, status) {
    status = !status ? 422 : status
    let data = {
        success: false,
        message: message,
        data: content
    };
    res.status(status).json(data);
};
exports.sendSuccessResponse = function (res, content, message) {
    let data = {
        success: true,
        message: message,
        data: content
    };
    res.status(200).json(data);
};

exports.generateToken =  (payload) => {
    

   
    const  options = { expiresIn: '2d'};
    const  secret  = process.env.JWT_SECRET;
    const  token   = jwt.sign(payload, secret, options);
    return token;

};

exports.generateCode = (l) => {

    const length = l;
    let timestamp = Date.now().toString();

    let _getRandomInt = function( min, max ) {
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    };

    let parts = timestamp.split( "" ).reverse();
    let id = "";

    for( let i = 0; i < length; ++i ) {
        const index = _getRandomInt( 0, parts.length - 1 );
        id += parts[index];
    }

    return id;
};


exports.validParam = (obj, requiredParam) => {
    let objKeys = Object.keys(obj);
    let notFound = [];
    let success = true;

    requiredParam.forEach((param, index) => {
        let idx = objKeys.findIndex(k => {
            return k === param.name;
        });

        if (idx < 0) {
            notFound.push(`${param.name} is required`);
            success = false;
        } else if (param.type && (typeof obj[param.name] != param.type)) {
            notFound.push(`${param.name} should be ${param.type}`);
            success = false;
        }
    });

    return {
        success: success,
        message: notFound
    };
};

exports.sendPostRequest = (data,token, path) => {

    const appUrl = process.env.APP_URL;
    let response = '';

    let authRequest = request.post({
        url: `${appUrl}${path}`,
        body: data,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

    }, function(error, res, body){
        if(error){
            console.log(error);
            (error, body);
        }
    });

    authRequest.on('data', (data) => {
        response += data;
    });

    authRequest.on('end', () => {
        try {
            let data = JSON.parse(response);
            console.log(data);
            if (data.success) {
                return (null, data.data);
            }
        } catch (e) {
            //todo: log error to sentry
            console.log(e);
        }
        (true, data);
    });
};

exports.sendPutRequest = (data,token, path, cb) => {

    const authUrl = process.env.AUTH_URL;
    let response = '';

    let authRequest = request.put({
        url: `${authUrl}${path}`,
        body: data,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

    }, function(error, res, body){
        if(error){
            console.log(error);
            cb(error, body);
        }
    });

    authRequest.on('data', (data) => {
        response += data;
    });

    authRequest.on('end', () => {
        try {
            let data = JSON.parse(response);
            console.log(data);
            if (data.success) {
                return cb(null, data.data);
            }
        } catch (e) {
            //todo: log error to sentry
            console.log(e);
        }
        cb(true, data);
    });
};

exports.sendGetRequest = (data,token, path, cb) => {

    const authUrl = process.env.AUTH_URL;
    let response = '';

    let authRequest = request.get({
        url: `${authUrl}${path}`,
        qs: data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }

    }, function(error, res, body){
        if(error){
            console.log(error);
            cb(error, body);
        }
    });

    authRequest.on('data', (data) => {
        response += data;
    });

    authRequest.on('end', () => {
        try {
            let data = JSON.parse(response);
            if (data.success) {
                return cb(null, data.data);
            }
        } catch (e) {
            //todo: log error to sentry
            console.log(e);
        }
        return cb(true, data.message);
    });
};

exports.trimCollection = (data) => {
    for(let key in data){
        if(data.hasOwnProperty(key)){
            if(typeof data[key] == "string"){
                data[key] = data[key].trim();
            }
        }
    }
    return data;
};

exports.authenticate = (token, cb) => { //This function authenticates all the micro services
  
    if(token !== "" ){ //Token shouldn't be empty, but just incase it is

       
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if(err){
                return cb('Token is either Invalid or has expired', null);
            }else{
               
                console.log(decoded, "Token decoded");
                return cb(null, decoded);
               
            }
          });
    }else {
        return cb('No Authorisation header', null);
    }
};


exports.capitalize = (str) => {
    if(str.length > 0){
        let temp = str.substr(1);
        str = str.charAt(0).toUpperCase() + temp;
    }
    return str;
}