const {validParam, sendPostRequest, authenticate, generateToken, generateCode, sendErrorResponse, sendSuccessResponse, trimCollection} = require('../../helpers/utility');
const mongoose = require('mongoose');
const Agent = mongoose.model('Agent');
const Request = mongoose.model('Request');
const ObjectId = require('mongodb').ObjectId;

var mqtt = require('mqtt');

exports.receiveRequest = async(req, res, next) => {
  

    req.body = trimCollection(req.body);
    const body = req.body;
    console.log(req.body, "bodyy");

    var value = body.text.split(",")
    console.log(value, "ress");


    if(value.length < 4 || value.length > 4){
        return sendErrorResponse(res, {}, 'Please send in the following format: Name,Gender,Lga,City');
    }

    let nRequest     = new Request();
    nRequest.name      = value[0];
    nRequest.gender     = value[1];
    nRequest.lga     = value[2];
    nRequest.city     = value[3];
    nRequest.status     = "pending";

    
  
    nRequest.save((err) => {
        console.log(err);
        if (err) {
            return sendErrorResponse(res, err, 'Something went wrong');
        }
        console.log("Request saved");
     });


    Agent.find({}, function (err, result) {
        if(err)
        {
            console.log(err);
            return sendErrorResponse(res, {}, 'Something went wrong, Please try again');
        }

        if(result != null){

        var i;
        for (i = 0; i < result.length; i++) {

        var options = {
            port: 8883,
            username: 'kogora',
            password: 'kogoradev',
        };
        
        let client = mqtt.connect('mqtts://www.dev.digitalacre.io', options);
       

           let phone = result[i].phone;

        client.on('connect', function () {
            console.log("connected");
           
    
            client.subscribe(phone, function (err) {
              if (!err) {
                  let data = {phone: "1", requestId: "44" };
                  let payload = JSON.stringify(data);

                client.publish("accept", Buffer.from(payload) )
              }
            })
          })
          
          client.on('message', function (topic, message) {
            // message is Buffer
            console.log(message.toString())
            client.end()
          })

        }
               
         
        }else{
            return sendErrorResponse(res, {}, 'No orders found');

        } 
    });


    return sendSuccessResponse(res, {}, 'hello');

      

};


exports.addAgent = (req, res) =>{

    let nAgent     = new Agent();
    nAgent.name      = req.body.name;
    nAgent.phone     = req.body.phone;
  

    
  
    nAgent.save((err) => {
        console.log(err);
       if (err) {
            return sendErrorResponse(res, err, 'Something went wrong');
        }
        
     });
     
     return sendSuccessResponse(res, {}, 'Agent saved');


}

exports.requests = (req, res) =>{

    if(req.body.phone != null){
        clause = {phone : req.body.phone}
    }else{
        clause = { }
    }

    Request.find(clause, function (err, result) {
        if(err)
        {
            console.log(err);
            return sendErrorResponse(res, {}, 'Something went wrong, Please try again');
        }
        return sendSuccessResponse(res, result, 'Here you go');


    });
    
   
}

exports.request = (req, res)=> {
   
    
 id = new ObjectId(req.body.id);
    Request.find({_id: id}, function (err, result) {
        if(err)
        {
            console.log(err);
            return sendErrorResponse(res, {}, 'Something went wrong, Please try again');
        }
        return sendSuccessResponse(res, result, 'Here you go');


    });
}


exports.createRequest = (req, res) =>{

    let nRequest     = new Request();
    nRequest.name      = req.body.name;
    nRequest.gender     = req.body.gender;
    nRequest.lga     = req.body.lga;
    nRequest.city     = req.body.city;
    nRequest.status     = "pending";

    
  
    nRequest.save((err) => {
        console.log(err);
        if (err) {
            return sendErrorResponse(res, err, 'Something went wrong');
        }
        return sendSuccessResponse(res, {}, 'Request created');
     });
}


exports.updateRequest = (req, res) =>{

    console.log(req.body);
    

    if(req.body.phone != null){
        clause = {phone : req.body.phone}
    }else{
        id = new ObjectId(req.body.id);
        clause = { _id : id}
    }

    Request.updateOne(
        { clause}, {
        $set: {

            name : req.body.name,
            gender : req.body.gender,
            lga : req.body.lga,
            city : req.body.city,
            status : req.body.status
            
        },
    }, (err, updated) => {
       
        if (err) {
            console.log(err);
            return sendErrorResponse(res, {}, 'Something went wrong, please try again');
        }
        if (updated && updated.nModified) {
            return sendSuccessResponse(res, { }, 'Request Updated!');
        }else{
            return sendSuccessResponse(res, { }, 'Request Already Updated!');
        }
    });
     
}


exports.deleteRequest = (req, res)=> {

       id = new ObjectId(req.body.id);

       if(req.body.phone != null){
        clause = {phone : req.body.phone}
    }else{
        id = new ObjectId(req.body.id);
        clause = { _id : id}
    }

       
       Request.deleteOne( {clause}, { }, (err, updated) => {
            return sendSuccessResponse(res, {}, 'Request Deleted');
       }); 
}