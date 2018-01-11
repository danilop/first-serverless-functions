'use strict';

console.log('Loading function...');

const TABLE = 'somedata';

const AWS = require('aws-sdk');

//const AWSXRay = require('aws-xray-sdk');
//const AWS = AWSXRay.captureAWS(require('aws-sdk'));

const docClient = new AWS.DynamoDB.DocumentClient();

function getQueryStringParameters(event, parameterName, defaultValue) {
    let value;
    if (event.queryStringParameters !== null &&
        event.queryStringParameters !== undefined &&
        parameterName in event.queryStringParameters) {
        value = event.queryStringParameters[parameterName];
    }
    else {
        value = defaultValue;
    }
    console.log('QueryStringParameters ' + parameterName + ' = ' + value);
    return value;
}

function readFromDynamoDB(id) {
    return docClient.get({
        TableName: TABLE,
        Key: { 'id': id }
    }).promise();
}

function writeToDynamoDB(id, data) {
    return docClient.put({
        TableName: TABLE,
        Item: {
            'id': id,
            'data': data
        }
    }).promise();
}

exports.handler = (event, context, callback) => {
    console.log('event: ' + JSON.stringify(event));

    const processResponse = (res) => callback(null, {
        statusCode: '200',
        body: JSON.stringify(res)
    });

    const processError = (err) => callback(null, {
        statusCode: '400',
        body: err.message
    });

    let operation = getQueryStringParameters(event, 'op', 'r');
    let id = getQueryStringParameters(event, 'id', 'none');
    let data = getQueryStringParameters(event, 'data', 'empty');

    console.log('operation: ' + operation);
    console.log('id: ' + id);
    console.log('data: ' + data);

    switch (operation) {
        case 'r':
            readFromDynamoDB(id).then(processResponse).catch(processError);
            break;
        case 'w':
            writeToDynamoDB(id, data).then(processResponse).catch(processError);
            break;
        default:
            console.log('Unknown op');
    }

};
