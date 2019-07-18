/*
       name: {{name}}
description: {{description}}
     author: {{author}}

*/

// Load Modules
import {inspect} from 'util';
{{#each taskImport}}
import {{camelCase name}} from './code_modules/{{kebabCase name}}';
{{/each}}

export default async function main(context={}){

  try {
    const debug = false;
    const initialData = context;

  {{#each taskExecutioin}}
    // {{name}}: {{description}}
    // if(debug) console.log('{{name}}: {{description}}');
{{#if @first}}
    const {{camelCase name}}Data = await {{camelCase name}}({context,setup:{{{setup}}},input:initialData});
    // if(debug) console.log(inspect({{camelCase name}}Data));
{{else if @last}}
    const finalResult = await {{camelCase name}}({context,setup:{{{setup}}},input:{{camelCase previousName}}Data});
    // if(debug) console.log(inspect(finalResult));
{{else}}
    const {{camelCase name}}Data = await {{camelCase name}}({context,setup:{{{setup}}},input:{{camelCase previousName}}Data});
    // if(debug) console.log(inspect({{camelCase name}}Data));
{{/if}}

  {{/each}}
    // Return Result
    return finalResult;

  } catch(error) {

    console.error(error);

  } // end try/catch

} // end function main ()
