# dreamtime
Causality violation for JavaScript. Executing programs before functions are written (think cucumber in js)

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
