'use strict';

const logLevels = { error: 4, warn: 3, info: 2, verbose: 1, debug: 0 };

const currentLogLevel = (process.env.LOG_LEVEL !== null &&
  process.env.LOG_LEVEL !== undefined) ? process.env.LOG_LEVEL : 'info';

function logWhen(logLevel, statement) {
    if(logLevels[logLevel] >= logLevels[currentLogLevel] ) {
        console.log(logLevel + ': ' + statement);
    }
}

function doWhen(logLevel, callback) {
    if(logLevels[logLevel] >= logLevels[currentLogLevel] ) {
        callback();
    }
}

logWhen('info', 'Loading hello world function');

exports.handler = (event, context, callback) => {
    let name = "World";
    let responseCode = 200;
    logWhen('info', 'request: ' + JSON.stringify(event));

    if (event.queryStringParameters !== null &&
      event.queryStringParameters !== undefined) {
        if ('name' in event.queryStringParameters) {
            name = event.queryStringParameters.name;
            logWhen('debug', 'Received name: ' + name);
        }
        if ('httpStatus' in event.queryStringParameters) {
            responseCode = event.queryStringParameters.httpStatus;
            logWhen('debug', 'Received http status: ' + responseCode);
        }
    }

    let responseBody = {
        message: 'Hello ' + name + '!'
    };

    doWhen('debug', () => {
      responseBody.input = event;
    });

    let response = {
        statusCode: responseCode,
        headers: {
          'x-custom-header' : 'my custom header value'
        },
        body: JSON.stringify(responseBody)
    };

    logWhen('info', 'response: ' + JSON.stringify(response));

    callback(null, response);
};
