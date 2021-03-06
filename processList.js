"use strict";

exports.handler = (event, context, callback) => {

  let itemList = event.itemList;

  processList(itemList, context);

}

function processList(itemList, context) {

    let item = itemList.shift();

    processItem(item, () => {
        if (itemList.length === 0) {
            console.log('Finished');
        } else if (context.getRemainingTimeInMillis() > TIME_THRESHOLD) {
            // Process remaning items
            processList(itemList, context);
        } else {
            console.log('Not finished');
            // Time is running out,
            // invoke self asynchrounously to process remaning items
            invokeSelf(itemList, context);
        }
    });

}

function processItem(item, callback) {
    // USE item HERE
    callback();
}