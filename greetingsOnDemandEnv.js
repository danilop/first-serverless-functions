"use strict";

console.log('Loading function');

const salutation = ('SALUTATION' in process.env) ? process.env.SALUTATION : 'Hello';

console.log('salutation: ' + salutation);

// Your business logic
function greetingsFor(name) {
    console.log('name: ', name);
    if ((name == undefined) || (name == '')) {
        name = 'World';
    }
    const greetings = salutation + ' ' + name + '!';
    console.log(greetings);
    return greetings;
}

// Event wrapper
exports.handler = async (event, context) => {
    console.log('Received event:',
        JSON.stringify(event, null, 2));
    return greetingsFor(event.name);
};
