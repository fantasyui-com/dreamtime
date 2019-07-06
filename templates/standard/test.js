const assert = require('assert');
const program = require('./index.js');

const setup = {};
const input = {
  urls: ['http://example.com']
};

const output = {};

const next = function(){
  const expected = 1270;
  const actual = res.data.length
  assert.deepEqual( actual , expected );
}
program.apply(program, [setup, input, output, next]);
