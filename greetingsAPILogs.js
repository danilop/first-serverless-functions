"use strict";

const assert = require('assert');

// Logging & debugging helpers
const logLevels = { ERROR: 4, WARN: 3, INFO: 2, VERBOSE: 1, DEBUG: 0 };

const logLevelNames = {};
for (var k in logLevels) {
    logLevelNames[logLevels[k]] = k;
}

const currentLogLevel = logLevels[(process.env.LOG_LEVEL !== null &&
    process.env.LOG_LEVEL !== undefined) ? process.env.LOG_LEVEL : 'INFO'];

function logWhen(logLevel, statement) {
    if (logLevel === undefined) {
        console.log('ERROR: Wrong log level');
    } else if(logLevel >= currentLogLevel ) {
        console.log(logLevelNames[logLevel] + ': ' + statement);
    }
}

function doWhen(logLevel, doSomething) {
    if (logLevel === undefined) {
        console.log('ERROR: Wrong log level');
    } else if(logLevel >= currentLogLevel ) {
        doSomething();
    }
}

logWhen(logLevels.INFO, 'Loading function');

// Your business logic
function greetingsFor(name) {
    logWhen(logLevels.DEBUG, 'name: ' + name);
    if ((name == undefined) || (name == '')) {
        name = 'World';
    }
    const greetings = 'Hello ' + name + '!';
    logWhen(logLevels.DEBUG, 'greetings: ' + greetings);
    return greetings;
}

// Event wrapper for Amazon API Gateway
exports.handler = async (event, context) => {

    function buildResponse(message) {
        const responseCode = 200;
        const responseBody = {
            message: message
        };
        doWhen(logLevels.DEBUG, () => {
            responseBody.input = {
                event: event,
                context: context
            };
        });
        const response = {
            statusCode: responseCode,
            headers: {
              'x-custom-header' : 'my custom header value'
            },
            body: JSON.stringify(responseBody)
        };
        doWhen(logLevels.DEBUG, () => {
            assert(responseCode == 200, "Wrong responseCode");
        });
        logWhen(logLevels.INFO, 'response: ' + JSON.stringify(response))
        return response;
    }

    logWhen(logLevels.INFO, 'request: ' + JSON.stringify(event));

    let name; // default value is undefined
    
    if (event.queryStringParameters != null) {
        name = event.queryStringParameters.name;
    }
    
    return buildResponse(greetingsFor(name));

};

// Not running on AWS Lambda, using Express
if (!(process.env.LAMBDA_TASK_ROOT && process.env.AWS_EXECUTION_ENV)) {
    const express = require('express')
    const app = express()
    
    app.get('/', function (req, res) {
      res.send(greetingsFor(req.query.name));
    })
    
    app.listen(process.env.PORT || 3000)
}