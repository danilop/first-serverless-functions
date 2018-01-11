"use strict";

console.log('Loading function');

const salutation = ('SALUTATION' in process.env) ? process.env.SALUTATION : 'Hello';

console.log('salutation: ' + salutation);

exports.handler = (event, context, callback) => {
    console.log('Received event:',
        JSON.stringify(event, null, 2));
    let name = '';
    if ('name' in event) {
        name = event.name;
        console.log('name: ', name);
    } else {
        name = 'World';
    }
    const greetings = salutation + ' ' + name + '!';
    console.log(greetings);
    callback(null, greetings);
};
