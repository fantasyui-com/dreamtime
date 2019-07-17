const kebabCase = require('lodash/kebabCase');
const camelCase = require('lodash/camelCase');
const uniq = require('lodash/uniq');
const take = require('lodash/take');

const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const util = require('util');
const chalk = require('chalk');
var pluralize = require('pluralize')

const toSource = require('tosource')
const beautify = require('js-beautify').js;
const stopword = require('stopword');

const ensureModule = require('../ensure-module');

const manager = function(program){

  return {

    updatePackage: function(){
      const packageJson = JSON.parse(fs.readFileSync(path.resolve('./package.json')));
      Object.assign(packageJson, program.meta, {name:kebabCase(program.meta.name)});
      fs.writeFileSync(path.resolve('./package.json'), JSON.stringify(packageJson, null, '  ') );
    },

    buildReadme: function(){
      const readme = [];
      readme.push(`# ${program.meta.name}`);
      readme.push(`${program.meta.description}`);
      readme.push('---');
      readme.push('');
      program.data.forEach(function(section){
        readme.push(`## ${section.meta.name}`)
        section.data.forEach(function(part){
          readme.push(`### ${part.name}`)
          readme.push(`${part.description}`)
          readme.push('```JavaScript')
          let moduleName = kebabCase(part.name);

          let clean = Object.assign({moduleName },part);
          delete clean.name;
          delete clean.description;
          let beautiful = beautify(toSource(clean, null, ''), { indent_size: 2, space_in_empty_paren: true }).trim();
          readme.push(`${beautiful}`)
          readme.push('```')
          //readme.push(`[${moduleName}](./code_modules/${moduleName}/README.md)`)
        });
      });
      fs.writeFileSync(path.resolve('./README.md'), readme.join('\n') );
    },

    buildModules: function(){
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
        strings = strings.map(string=>pluralize(string,1))

        strings = stopword.removeStopwords(strings);
        strings = uniq(strings);
        strings = take(strings, 4);
        return strings;
      }

      //console.log('Building modules...')
      // make the index.js file
      program.data.forEach(function(procedure, index){
          const procedureVariable = camelCase(procedure.meta.name);
          const procedureName = kebabCase(procedure.meta.name);
          //console.log(procedureVariable)

          ensureModule(
            path.resolve(`${__dirname}/templates/promise`), // templates are stored relative to this file's dir
            path.resolve(`./code_modules/${procedureName}`), // results realtive to calling program's root.
            Object.assign({author: program.meta.author, keywords:keywords(procedure.meta)},procedure.meta)
          );

          procedure.data.forEach(function(task,index){
            const taskVariable = camelCase(task.meta.name);
            const taskName = kebabCase(task.meta.name);
            //console.log('  ' + taskVariable)
            ensureModule(
              path.resolve(`${__dirname}/templates/promise`), // templates are stored relative to this file's dir
              path.resolve(`./code_modules/${procedureName}/code_modules/${taskName}`), // results realtive to calling program's root.
              Object.assign({author: program.meta.author, keywords:keywords(task.meta)},task.meta)
            );

            task.data.forEach(function(action,index){
              const actionVariable = camelCase(action.meta.name);
              const actionName = kebabCase(action.meta.name);
              //console.log('    ' + actionVariable)

              ensureModule(
                path.resolve(`${__dirname}/templates/promise`), // templates are stored relative to this file's dir
                path.resolve(`./code_modules/${procedureName}/code_modules/${taskName}/code_modules/${actionName}`), // results realtive to calling program's root.
                Object.assign({author: program.meta.author, keywords:keywords(action.meta)},action.meta)
              );



            }); // action

          }); // task

        }); // procedures




    },

    buildIndex: function(){
      const indexContent = [];
      const requireContents = [];
      requireContents.push(`import util from 'util';`)
      const asyncCallLine = [];

      const functionIndex = [];

      // make the index.js file
      program.data.forEach(function(section){
        // readme.push(`## ${section.meta.name}`)
        let previousPart;
        section.data.forEach(function(part,index){
          const moduleVariable = camelCase(part.name);
          const moduleName = kebabCase(part.name);

          let clean = Object.assign({},part);
          delete clean.name;
          delete clean.description;

          //requireContents.push(``);
          //requireContents.push(`const ${moduleVariable}Setup = ${toSource(clean, null, '')};`)
          requireContents.push(`import ${moduleVariable} from './code_modules/${moduleName}';`)

          asyncCallLine.push(``);
          asyncCallLine.push(`    // ${index+1}. ${part.name}:${part.description}`);

          asyncCallLine.push(`    console.log('\\n${part.name}');`);

          if(!previousPart){
            // first
            asyncCallLine.push(`    const ${moduleVariable}Result = await ${moduleVariable}({context,setup:${toSource(clean, null, '')},input:{}});`);
            asyncCallLine.push(`    // console.log(util.inspect(${moduleVariable}Result),false,2,true)`);

          }else if(index == section.data.length-1){
            // last
            asyncCallLine.push(`    const finalResult = await ${moduleVariable}({context,setup:${toSource(clean, null, '')},input: ${camelCase(previousPart.name)}Result});`);
            asyncCallLine.push(`    // console.log(util.inspect(finalResult),false,2,true)`);

          }else{
            // middle
            asyncCallLine.push(`    const ${moduleVariable}Result = await ${moduleVariable}({context,setup:${toSource(clean, null, '')},input: ${camelCase(previousPart.name)}Result});`);
            asyncCallLine.push(`    // console.log(util.inspect(${moduleVariable}Result),false,2,true)`);
          }

          functionIndex.push(moduleVariable)
          previousPart  = part;
        })



      });

      indexContent.push('// Load Modules');
      requireContents.forEach(line => indexContent.push(line));
      indexContent.push('');
      // indexContent.push('\n');

      //indexContent.push(`const functionIndex = [${functionIndex.join(', ')}];`);

      indexContent.push('async function main(context={}){');
      indexContent.push('');
      indexContent.push('  try {');
      asyncCallLine.forEach(line => indexContent.push(line));
      indexContent.push('');
      indexContent.push('    // Return Result');
      indexContent.push('    return finalResult;');
      indexContent.push('');

      indexContent.push('  } catch(error) {');
      indexContent.push('');
      indexContent.push('    console.error(error);');
      indexContent.push('');
      indexContent.push('  } // end try/catch');
      indexContent.push('');
      indexContent.push('} // end function main ()');
      indexContent.push('main();');




      fs.writeFileSync(path.resolve('./index.mjs'), indexContent.join('\n') );



    }

  }
}

module.exports = function(program){
  return manager(program);
}
