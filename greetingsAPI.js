"use strict";

console.log('Loading function');

// Your business logic
function greetingsFor(name) {
    console.log('name: ', name);
    if ((name == undefined) || (name == '')) {
        name = 'World';
    }
    const greetings = 'Hello ' + name + '!';
    console.log('greetings: ', greetings);
    return greetings;
}

// Event wrapper for Amazon API Gateway
exports.handler = async (event, context) => {

    function buildResponse(message) {
        const responseCode = 200;
        const responseBody = {
            message: message
        };
        const response = {
            statusCode: responseCode,
            headers: {
              'x-custom-header' : 'my custom header value'
            },
            body: JSON.stringify(responseBody)
        };
        console.log('response: ' + JSON.stringify(response))
        return response;
    }

    console.log('request: ' + JSON.stringify(event));

    let name; // default value is undefined    
    if (event.queryStringParameters != null) {
        name = event.queryStringParameters.name;
    }
    
    return buildResponse(greetingsFor(name));
};

// If not running on AWS Lambda, use Express
if (!(process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV)) {
    const express = require('express')
    const app = express()
    
    app.get('/', function (req, res) {
      res.send(greetingsFor(req.query.name));
    })
    
    app.listen(process.env.PORT || 3000)
}