console.log('Loading function');
var AWS = require('aws-sdk');

// config includes region, secretAccessKey and accessKeyId
const awsConfig = require('./awsConfig.json');

AWS.config.update(awsConfig);

var dynamo = new AWS.DynamoDB.DocumentClient();
var historyTable = "droneNetworkHistory";
var statusTable = "droneNetworkStatus";


exports.handler = function(event, context) {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    
    var payload = event;
    
    payload.roll = Math.atan(parseFloat(payload.accelerometer[1])/ Math.sqrt(Math.pow( parseFloat(payload.accelerometer[0]),2)+Math.pow(parseFloat(payload.accelerometer[2]),2))) * (180/Math.PI);
    
    
    var Item = {
        "serialNumber":  payload.serialNumber,
        "velocity": payload.velocity,
        "position": payload.position,
        //"attitude": event.attitude,
        "roll" : payload.roll,
        "battery": payload.battery,
        "stance" : payload.stance,
        "time": payload.time
        };
        
   var paramsHistory = {
    TableName:historyTable,
    Item
    };
    
    var paramsStatus = {
        TableName: statusTable,
        Item,
    }

    
    // Updating drone history
    
    dynamo.put(paramsHistory, function(err, data) {
        if (err) {
            context.fail();
        } else {
            context.succeed();
        }
    });
    
    // Updating drone status
    
     dynamo.put(paramsStatus, function(err, data) {
        if (err) {
            context.fail();
        } else {
            context.succeed();
        }
    });
    
    
}