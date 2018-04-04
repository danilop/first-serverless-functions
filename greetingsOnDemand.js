"use strict";

console.log('Loading function');

// Your business logic
function greetingsFor(name) {
    console.log('name: ', name);
    if ((name == undefined) || (name == '')) {
        name = 'World';
    }
    const greetings = 'Hello ' + name + '!';
    console.log(greetings);
    return greetings;
}

// Event wrapper
exports.handler = async (event, context) => {
    console.log('Received event:',
        JSON.stringify(event, null, 2));
    return greetingsFor(event.name);
};
