/*
 classification: PROGRAM
           name: {{name}}
    description: {{description}}
         author: {{author}}
*/

// Load Modules
import {inspect} from 'util';
{{#each procedureImport}}
import {{camelCase name}} from './code_modules/{{kebabCase name}}';
{{/each}}

// Example module interface
export default async function main(context={}){

  try {
    const debug = false;
    const result = {};

    // TODO: you should set this up yourself.
  {{#each procedureExecutioin}}
    // {{name}}: {{description}}
    // const {{camelCase name}}Data = await {{camelCase name}}({context={}, setup={}, input={}});
    // if(debug) console.log(inspect({{camelCase name}}Data));
  {{/each}}

    // Return Result
    return result;

  } catch(error) {

    console.error(error);

  } // end try/catch

} // end function main ()
