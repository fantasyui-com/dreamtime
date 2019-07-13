/*
  This is an example of an alternative method of loading the promise.
*/

const factory = require('./main.mjs');

module.exports = (params, stdLibCallback) => {

  // Configure your inputs
  const context = {};
  const setup = {};
  const input = {};

  // Configure promise with inputs
  const main = factory({context, setup, input});

  // Execute your promise
  main.then( (output) => {
    // call the callback
    stdLibCallback(null, output);
  }, /* (error) => { stdLibCallback(error); } */ )
  .catch(error => { stdLibCallback(error); });

};
