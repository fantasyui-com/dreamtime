#!/usr/bin/env node --experimental-modules --no-warnings

/*
 classification: PROGRAM
           name: {{name}}
    description: {{description}}
         author: {{author}}
*/

// Load Modules
import {inspect} from 'util';
import program from 'commander';
import path from 'path';
import fs from 'fs';

{{#each procedureImport}}
import {{camelCase name}} from './code_modules/{{kebabCase name}}';
{{/each}}

async function main(){

  {{#each procedureExecutioin}}
    // {{name}}: {{description}}
    program
      .command('{{kebabCase name}}')
      .option('-b, --bork', 'Enable bork mode.')
      .option('-t, --text [value]', 'Text input')
      .action(async function (options) {
        const input = Object.entries(options).filter(([name])=>!name.startsWith('_')).filter(([name])=>!['commands', 'options', 'parent'].includes(name)).reduce((a,[k,v])=>({...a,[k]:v}),{})
        const {{camelCase name}}Data = await {{camelCase name}}({context:{}, input});
    });
  {{/each}}

  program.parse(process.argv)
}

main();
