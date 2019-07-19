/*
 classification: PROGRAM PROCEDURE
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
{{#each taskImport}}
import {{camelCase name}} from './code_modules/{{kebabCase name}}';
{{/each}}

export default async function main({context, input}){

  try {
    const debug = false;

  {{#each taskExecutioin}}
    // {{name}}: {{description}}
    // if(debug) console.log('{{name}}: {{description}}');
{{#if @last}}
  {{#if @first}}
    const finalResult = await {{camelCase name}}({context, setup:{{{setup}}}, input});
    // if(debug) console.log(inspect({{camelCase name}}Data));
  {{else}}
    const finalResult = await {{camelCase name}}({context, setup:{{{setup}}}, input:{{camelCase previousName}}Data});
    // if(debug) console.log(inspect(finalResult));
  {{/if}}
{{else if @first}}
    const {{camelCase name}}Data = await {{camelCase name}}({context, setup:{{{setup}}}, input});
    // if(debug) console.log(inspect({{camelCase name}}Data));
{{else}}
    const {{camelCase name}}Data = await {{camelCase name}}({context, setup:{{{setup}}}, input:{{camelCase previousName}}Data});
    // if(debug) console.log(inspect({{camelCase name}}Data));
{{/if}}

  {{/each}}
    // Return Result
    return finalResult;

  } catch(error) {

    console.error(error);

  } // end try/catch

} // end function main ()
