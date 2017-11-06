"use strict";

console.log('Loading function');

exports.handler = (event, context, callback) => {
    console.log('Received event:',
        JSON.stringify(event, null, 2));
    var name = '';
    if ('name' in event) {
        name = event.name;
        console.log('name: ', name);
    } else {
        name = 'World';
    }
    var greetings = 'Hello ' + name + '!';
    console.log(greetings);
    callback(null, greetings);
};
