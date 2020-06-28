console.log('Loading function');
var AWS = require('aws-sdk');

// config includes region, secretAccessKey and accessKeyId
const awsConfig = require('./awsConfig.json');

AWS.config.update(awsConfig);

var dynamo = new AWS.DynamoDB.DocumentClient();
var table = "iotCatalog";


exports.handler = function(event, context) {
    //console.log('Received event:', JSON.stringify(event, null, 2));
   var params = {
    TableName:table,
    Item:{
        "serialNumber": event.serialNumber,
        "clientId": event.clientId,
        "device": event.device,
        "endpoint": event.endpoint,
        "type": event.type,
        "certificateId": event.certificateId,
        "activationCode": event.activationCode,
        "activated": event.activated,
        "email": event.email
        }
    };

    console.log("Adding a new IoT device...");
    dynamo.put(params, function(err, data) {
        if (err) {
            console.error("Unable to add device. Error JSON:", JSON.stringify(err, null, 2));
            context.fail();
        } else {
            console.log("Added device:", JSON.stringify(data, null, 2));
            context.succeed();
        }
    });
}