const kebabCase = require('lodash/kebabCase');
const camelCase = require('lodash/camelCase');

const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const util = require('util');
const chalk = require('chalk');

const toSource = require('tosource')
const beautify = require('js-beautify').js;

const ensureModule = require('ensure-module')({
  templateSource: path.resolve(`${__dirname}/templates/`),
});

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
      // make the index.js file
      program.data.forEach(function(section){
        // readme.push(`## ${section.meta.name}`)
        let previousPart;
        section.data.forEach(function(part,index){
          const moduleVariable = camelCase(part.name);
          const moduleName = kebabCase(part.name);
          ensureModule(moduleName);

        });
      });
    },

    buildIndex: function(){
      const indexContent = [];
      const requireContents = [];
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

          if(!previousPart){
            // first
            asyncCallLine.push(`    const ${moduleVariable}Result = await ${moduleVariable}({context,setup:${toSource(clean, null, '')},input:{}});`);
          }else if(index == section.data.length-1){
            // last
            asyncCallLine.push(`    const finalResult = await ${moduleVariable}({context,setup:${toSource(clean, null, '')},input: ${camelCase(previousPart.name)}Result});`);
          }else{
            // middle
            asyncCallLine.push(`    const ${moduleVariable}Result = await ${moduleVariable}({context,setup:${toSource(clean, null, '')},input: ${camelCase(previousPart.name)}Result});`);
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

      indexContent.push('async function main(){');
      indexContent.push('');
      indexContent.push('  try {');
      asyncCallLine.forEach(line => indexContent.push(line));
      indexContent.push('');
      indexContent.push('    // Return Result');
      indexContent.push('    successCallback(finalResult);');
      indexContent.push('');

      indexContent.push('  } catch(error) {');
      indexContent.push('');
      indexContent.push('    failureCallback(error);');
      indexContent.push('');
      indexContent.push('  } // end try/catch');
      indexContent.push('');
      indexContent.push('} // end function main ()');




      fs.writeFileSync(path.resolve('./index.mjs'), indexContent.join('\n') );



    }

  }
}

module.exports = function(program){
  return manager(program);
}
