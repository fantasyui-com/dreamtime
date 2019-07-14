# dreamtime
Causality violation for JavaScript. Executing programs before functions are written (think cucumber in js)

# Dreamtime Functions

## First Order Functions

First order functions describe a procedure completed by second order functions.
- specify order of operations
- it feels like they exist to debug flow control

## Second Order Functions

Second order functions follow good conventions for managing fulfillment of the task they are charged with.
- There is a single new Promise instance here and heavy reliance on async functions

## Third Order Functions

Third order functions do the dirty work, they don't even receive arguments in an object, they get a standard comma separated deal with it set.
  - get simple arguments (ex: function(url, timeout){ /* dirty work */ })

## Todo

- if module directory changes update the package.json name field

## References

https://github.com/fantasyui-com/tarnation

## Example

```JavaScript
const dreamtime = require('dreamtime');

const program = dreamtime()

  .downloadHtml('http://trackthis.link')
  .htmlQuery('head > script[url]')
  .downloadUrls()
  .extractObjects('ObjectExpression')

console.log(program)
```
