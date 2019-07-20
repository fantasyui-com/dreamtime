/*
 classification: PROGRAM
           name: {{name}}
    description: {{description}}
         author: {{author}}
*/

// Load Modules
import EventEmitter from 'events';

{{#each procedureImport}}
import {{camelCase name}} from './code_modules/{{kebabCase name}}';
{{/each}}

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

export default async function main(context={}){

  {{#each procedureExecutioin}}

    // {{name}}: {{description}}
    myEmitter.on('{{kebabCase name}}', (input, next) => {
      console.log('{{kebabCase name}} event occurred!');
      const {{camelCase name}}Data = await {{camelCase name}}({context, input:input});
      if(next) next(null, {{camelCase name}}Data)
    });

  {{/each}}

  return myEmitter;
}
