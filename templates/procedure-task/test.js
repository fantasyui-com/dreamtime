/*
 classification: PROCEDURE TASK
           name: {{name}}
    description: {{description}}
         author: {{author}}
*/

// Load Modules
import {inspect} from 'util';
{{#each actionImport}}
import {{camelCase name}} from './code_modules/{{kebabCase name}}';
{{/each}}

// Example module interface
export default async function main(context={test:true}){

  try {
    const debug = false;
    const result = {};

  {{#each actionExecutioin}}

    // {{name}}: {{description}}
    // TODO: you should configure {{camelCase name}}Expected
    const {{camelCase name}}Expected = {};
    if(debug) console.log('{{name}}: {{description}}');
    // const {{camelCase name}}Data = await {{camelCase name}}({context={}, setup={}, input={}});
    if(debug) console.log(inspect({{camelCase name}}Data));
    // assert.equal({{camelCase name}}Data, expectedBytes);
  {{/each}}

    // Return Result
    return result;

  } catch(error) {

    console.error(error);

  } // end try/catch

} // end function main ()
