/*
 classification: TASK ACTION
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

// Example interface - this should be a very simple function

export default async function main(setup) {

  // Prepare the outout object
  const output = {text: 'Action Response' };
  const debug = true;

  if(debug) console.log('Input for: {{name}} - {{description}}')
  if(debug) console.log(util.inspect(setup,false,2,true))

  consoel.log(setup)
  return output;


};
