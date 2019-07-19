#!/usr/bin/env node --no-warnings

const program = require('commander');
const path = require('path');
const fs = require('fs');

const dreamtime = require('./index.js');

async function main(){

  program
    .command('convert <file>')
    .option('-b, --bork', 'Enable bork mode.')
    .action(function (dir, cmd) {
      const textConverter = require('./text-converter.js');
      const textPath = path.resolve(dir);
      const codePath = path.resolve('program.js');
      textConverter({textPath,codePath});
  });

  program
    .command('build')
    .option('-d, --dest', 'destination path --dest ./out/')
    .action(async function (dir, cmd) {
      console.log('Building from program.js, to generate program.js from program.txt run: dreamtime convert program.txt')
      const program = require(path.resolve('program.js'));
      const options = {
        //dest: path.resolve(dir.toString())
      }
      const manager = dreamtime(program, options);
        manager.updatePackage();
        manager.buildIndex();
        await manager.buildReadme();
        manager.buildModules();
  });

  program.parse(process.argv)

}

main();
