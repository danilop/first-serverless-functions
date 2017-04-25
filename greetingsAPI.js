'use strict';

console.log('Loading hello world function');

exports.handler = (event, context, callback) => {
    var name = "World";
    var responseCode = 200;
    console.log('request: ' + JSON.stringify(event));

    if (event.queryStringParameters !== null &&
      event.queryStringParameters !== undefined) {
        if ('name' in event.queryStringParameters) {
            name = event.queryStringParameters.name;
            console.log('Received name: ' + name);
        }
        if ('httpStatus' in event.queryStringParameters) {
            responseCode = event.queryStringParameters.httpStatus;
            console.log('Received http status: ' + responseCode);
        }
    }

    var responseBody = {
        message: 'Hello ' + name + '!'
    };

    var response = {
        statusCode: responseCode,
        headers: {
          'x-custom-header' : 'my custom header value'
        },
        body: JSON.stringify(responseBody)
    };

    console.log('response: ' + JSON.stringify(response))
    callback(null, response);
};
