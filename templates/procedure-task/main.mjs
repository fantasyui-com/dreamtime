/*
 classification: PROCEDURE TASK
           name: {{name}}
    description: {{description}}
         author: {{author}}

*/

// Load Modules
import {inspect} from 'util';
{{#each modules}}
import {{camelCase name}} from '{{name}}';
{{/each}}
{{#each dependencies}}
import {{camelCase name}} from '{{name}}';
{{/each}}
{{#each actionImport}}
import {{camelCase name}} from './code_modules/{{kebabCase name}}';
{{/each}}

// Example interface

export default async function main({ context, setup, input }) {

  const debug = true;

  if(debug) console.log('Input for: {{name}} - {{description}}')
  if(debug) console.log(inspect(input,false,2,true))

  // Prepare the outout object
  const output = {
    someList:[],
  };

  // TODO: customize this to match your code
  for (const element of input.someList||[1]) {
    {{#each actionExecutioin}}
      // {{name}}: {{description}}
      if(debug) console.log('Calling {{camelCase name}}')
      const {{camelCase name}}Data = await {{camelCase name}}(input);
      if(debug) console.log(inspect({{camelCase name}}Data));
    {{/each}}
  }

  return output;

};
