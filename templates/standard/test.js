const assert = require('assert');
const program = require('./index.js');

const req = {
  urls: ['http://example.com']
};

const res = {};

const next = function(){
  const expected = 1270;
  const actual = res.data.length
  assert.deepEqual( actual , expected );
}
program.apply(program, [req, res, next]);
