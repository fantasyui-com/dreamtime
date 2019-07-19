const kebabCase = require('lodash/kebabCase');
const camelCase = require('lodash/camelCase');
const startCase = require('lodash/startCase');

const uniq = require('lodash/uniq');
const take = require('lodash/take');

const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const util = require('util');
const chalk = require('chalk');
const pluralize = require('pluralize')

const toSource = require('tosource')
const beautify = require('js-beautify').js;
const stopword = require('stopword');

const ensureModule = require('../ensure-module');

function keywords(meta){
  if(meta.keywords){
    return meta.keywords
  }

  let strings = meta.keywords || [];
  if(meta.name){
    strings = strings.concat(meta.name.toLowerCase().split(' '))
  }
  if(meta.description){
    strings = strings.concat(meta.description.toLowerCase().split(' '))
  }
  strings = strings.sort()
  strings = strings.map(string=>string.replace(/[^a-z0-9-]/,''))
  strings = strings.map(string=>pluralize(string,1))

  strings = stopword.removeStopwords(strings);
  strings = uniq(strings);
  strings = take(strings, 4);
  return strings;
}

const describeMeta = function(readme, meta){
  Object
    .entries(meta)
    .forEach(function([key, value]) {
      if (typeof value === 'string') {
        if((key==='name')||(key==='description')||(key==='type')) return
        readme.push(`- **${startCase(key)}**: ${value}`)
      }
      else if (Array.isArray(value)) {
        if(value.length === 0) return
        readme.push(`- **${startCase(key)}**:`);

        value.forEach(function(value) {
          if (typeof value === 'string') {
            readme.push(`   - ${value}`);
          }
          else if (Array.isArray(value)) {
            readme.push(`  - **${startCase(key)}**`);
            value.forEach(function(value) {
              if (typeof value === 'string') {
                readme.push(`  - ${value}`);
              }
              else if (Array.isArray(value)) {
                readme.push(`  - **${startCase(key)}**`);
              }
            })
          }
          else if (typeof value === 'object') {
            let items = [];
            Object
              .entries(value)
              .forEach(function([name, value]) {
                if((key === 'modules') && (name === 'name')){
                  items.push(`**${startCase(name)}**: [${value}](https://nodejs.org/api/${value}.html)`);
                }else if((key === 'dependencies') && (name === 'name')){
                    items.push(`**${startCase(name)}**: [${value}](https://www.npmjs.com/package/${value})`);
                }else{
                items.push(`**${startCase(name)}**: ${value}`);
                }
              });
            readme.push(`    - ${items.join(', ')}`)

          }
        })
      }
    });
}

const manager = function(program){

  return {

    updatePackage: function(){
      const packageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json')));
      Object.assign(packageJson, program.meta, {
        name:kebabCase(program.meta.name),
        main:'index.mjs',
        "dependencies": {
          "commander": "^2.20.0"
        },
        "bin": {
          [kebabCase(program.meta.name)]: "node --experimental-modules cli.mjs"
        },
        "scripts": {
          "cli": "cli.mjs",
          "index": "node --experimental-modules index.mjs",
          "test": "node --experimental-modules test.mjs"
        },
      });
      fs.writeFileSync(path.resolve('./package.json'), JSON.stringify(packageJson, null, '  ') );
    },

    buildReadme: function(){
      const readme = [];
      readme.push(`# ${program.meta.name}`);
      readme.push(`${program.meta.description}`);
      readme.push('---');
      readme.push('');

      // walk program procedures
      program.data.forEach(function(procedure, procedureIndex){
        const procedureTitle = `---\n## ${procedureIndex+1}) Program ${startCase(procedure.meta.type)}: ${procedure.meta.name}`;
        const procedureVariable = camelCase(procedure.meta.name);
        const procedureName = kebabCase(procedure.meta.name);
        readme.push(procedureTitle);
        readme.push(`${procedure.meta.description}`)
        readme.push('');
        readme.push(`[./code_modules/${kebabCase(procedure.meta.name)}](code_modules/${kebabCase(procedure.meta.name)})`);
        readme.push('');

        describeMeta(readme, procedure.meta);

        // walk procedure's tasks
        procedure.data.forEach(function(task, taskIndex){
          const taskTitle = `---\n### ${procedureIndex+1}.${taskIndex+1}) ${startCase(procedure.meta.type)} ${startCase(task.meta.type)}: ${task.meta.name}`;
          const taskVariable = camelCase(task.meta.name);
          const taskName = kebabCase(task.meta.name);
          readme.push(taskTitle);
          readme.push(`${task.meta.description}`)
          readme.push('');
          readme.push(`[./code_modules/${kebabCase(procedure.meta.name)}/code_modules/${kebabCase(task.meta.name)}](code_modules/${kebabCase(procedure.meta.name)}/code_modules/${kebabCase(task.meta.name)})`);
          readme.push('');
          describeMeta(readme, task.meta);

          // walk task's actions
          task.data.forEach(function(action, actionIndex){
            const actionTitle = `---\n#### ${procedureIndex+1}.${taskIndex+1}.${actionIndex+1}) ${startCase(task.meta.type)} ${startCase(action.meta.type)}: ${action.meta.name}`;
            const actionVariable = camelCase(action.meta.name);
            const actionName = kebabCase(action.meta.name);
            readme.push(actionTitle);
            readme.push(`${action.meta.description}`)
            readme.push('');
            readme.push(`[./code_modules/${kebabCase(procedure.meta.name)}/code_modules/${kebabCase(task.meta.name)}/code_modules/${kebabCase(action.meta.name)}](code_modules/${kebabCase(procedure.meta.name)}/code_modules/${kebabCase(task.meta.name)}/code_modules/${kebabCase(action.meta.name)})`);
            readme.push('');
            describeMeta(readme, action.meta);

          }); // walk task's actions: task-action
        }); // walk procedure's tasks: procedure-task
      }); // walk program procedures: program-procedure



      //
      //
      //
      //
      //
      //
      // const readme = [];
      // readme.push(`# ${program.meta.name}`);
      // readme.push(`${program.meta.description}`);
      // readme.push('---');
      // readme.push('');
      // program.data.forEach(function(section){
      //   readme.push(`## ${section.meta.name}`)
      //   section.data.forEach(function(part){
      //     readme.push(`### ${part.name}`)
      //     readme.push(`${part.description}`)
      //     readme.push('```JavaScript')
      //     let moduleName = kebabCase(part.name);
      //
      //     let clean = Object.assign({moduleName },part);
      //     delete clean.name;
      //     delete clean.description;
      //     let beautiful = beautify(toSource(clean, null, ''), { indent_size: 2, space_in_empty_paren: true }).trim();
      //     readme.push(`${beautiful}`)
      //     readme.push('```')
      //     //readme.push(`[${moduleName}](./code_modules/${moduleName}/README.md)`)
      //   });
      // });

      fs.writeFileSync(path.resolve('./README.md'), readme.join('\n') );
    },

    buildModules: function(){


      // walk program procedures
      program.data.forEach(function(procedure, index){
          const procedureVariable = camelCase(procedure.meta.name);
          const procedureName = kebabCase(procedure.meta.name);
          //console.log(procedureVariable)

          const code = {
            taskImport:procedure.data.map(task=>({name:task.meta.name,description:task.meta.description})),
            taskExecutioin:[],
          };
          let previousTask = {meta:{},data:[]};
          procedure.data.forEach(function(task, index){
            const name = task.meta.name;
            previousName = previousTask.meta.name;
            const description = task.meta.description;
            const setup = task.meta.parameters || '{}'
            code.taskExecutioin.push({name,description,setup,previousName})
            previousTask = task;
          });

          const data = {};
          Object.assign(data, {author: program.meta.author, keywords:keywords(procedure.meta)});
          Object.assign(data, procedure.meta);
          Object.assign(data, code);
          Object.assign(data, {debug:JSON.stringify(data, null, '  ')});

          ensureModule(
            path.resolve(`${__dirname}/templates/program-procedure`), // templates are stored relative to this file's dir
            path.resolve(`./code_modules/${procedureName}`), // results realtive to calling program's root.
            data
          );

          // walk procedure's tasks
          procedure.data.forEach(function(task,index){

            const taskVariable = camelCase(task.meta.name);
            const taskName = kebabCase(task.meta.name);

            const code = {
              actionImport:task.data.map(action=>({name:action.meta.name,description:action.meta.description})),
              actionExecutioin:[],
            };
            let previousAction = {meta:{},data:[]};
            task.data.forEach(function(action, index){
              const name = action.meta.name;
              previousName = previousAction.meta.name;
              const description = action.meta.description;
              const setup = action.meta.parameters|| '{}'
              code.actionExecutioin.push({name,description,setup,previousName})
              previousAction = action;
            });

            const data = {};
            Object.assign(data, {author: program.meta.author, keywords:keywords(procedure.meta)});
            Object.assign(data, task.meta);
            Object.assign(data, code);
            Object.assign(data, {debug:JSON.stringify(data, null, '  ')});

            ensureModule(
              path.resolve(`${__dirname}/templates/procedure-task`), // templates are stored relative to this file's dir
              path.resolve(`./code_modules/${procedureName}/code_modules/${taskName}`), // results realtive to calling program's root.
              data
            );

            // walk task's actions
            task.data.forEach(function(action,index){
              const actionVariable = camelCase(action.meta.name);
              const actionName = kebabCase(action.meta.name);
              //console.log('    ' + actionVariable)

              ensureModule(
                path.resolve(`${__dirname}/templates/task-action`), // templates are stored relative to this file's dir
                path.resolve(`./code_modules/${procedureName}/code_modules/${taskName}/code_modules/${actionName}`), // results realtive to calling program's root.
                Object.assign({author: program.meta.author, keywords:keywords(action.meta)},action.meta)
              );


            }); // walk task's actions: task-action

          }); // walk procedure's tasks: procedure-task

        }); // walk program procedures: program-procedure




    },

    buildIndex: function(){


      const code = {
        procedureImport:program.data.map(procedure=>({name:procedure.meta.name,description:procedure.meta.description})),
        procedureExecutioin:[],
      };

      program.data.forEach(function(procedure, index){
          const procedureVariable = camelCase(procedure.meta.name);
          const procedureName = kebabCase(procedure.meta.name);
          const name = procedure.meta.name;
          const description = procedure.meta.description;
          const setup = procedure.meta.parameters||'{}'
          code.procedureExecutioin.push({name,description,setup})
        });

        const data = {};
        Object.assign(data, program.meta);
        Object.assign(data, code);

        ensureModule(
          path.resolve(`${__dirname}/templates/program`), // templates are stored relative to this file's dir
          path.resolve(`./`), // results realtive to calling program's root.
          data
        );

      // const indexContent = [];
      //
      // indexContent.push('// Load Modules');
      // indexContent.push(`import {inspect} from 'util';`)
      // program.data.forEach(function(procedure, procedureIndex){
      //   const procedureVariable = camelCase(procedure.meta.name);
      //   const procedureName = kebabCase(procedure.meta.name);
      //   indexContent.push(`import ${procedureVariable} from 'code_modules/${kebabCase(procedure.meta.name)}';`)
      // })
      // indexContent.push('');
      //
      // indexContent.push('async function main(){');
      // indexContent.push('');
      // let names = []
      // program.data.forEach(function(procedure, procedureIndex){
      //   const procedureVariable = camelCase(procedure.meta.name);
      //   const procedureName = kebabCase(procedure.meta.name);
      //   names.push(procedureVariable);
      // })
      // indexContent.push(`  return {${names.join(', ')}};`);
      // indexContent.push('');
      // indexContent.push('}');
      // indexContent.push('main();');
      //
      // fs.writeFileSync(path.resolve('./index.mjs'), indexContent.join('\n') );

    }

  }
}

module.exports = function(program){
  return manager(program);
}
