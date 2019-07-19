#!/usr/bin/env node

/*
 classification: PROGRAM
           name: {{name}}
    description: {{description}}
         author: {{author}}
*/

// Load Modules
import {inspect} from 'util';
import program = from 'commander';
import path = from 'path';
import fs = from 'fs';

{{#each procedureImport}}
import {{camelCase name}} from './code_modules/{{kebabCase name}}';
{{/each}}

async function main(){

  {{#each procedureExecutioin}}
    // {{name}}: {{description}}
    program
      .command('{{kebabCase name}}')
      .option('-b, --bork', 'Enable bork mode.')
      .action(async function (setup) {
        const {{camelCase name}}Data = await {{camelCase name}}({context={}, setup, input={}});
    });
  {{/each}}

  program.parse(process.argv)
}

main();
