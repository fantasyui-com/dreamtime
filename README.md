# dreamtime
Causality violation for JavaScript. Executing programs before functions are written (think cucumber in js)

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
