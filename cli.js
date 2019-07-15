#!/usr/bin/env node

const program = require('commander');

const path = require('path');
const fs = require('fs');



program
  .command('convert <file>')
  .option('-b, --bork', 'Enable bork mode.')
  .action(function (dir, cmd) {
    const textConverter = require('./text-converter.js');
    const textPath = path.resolve(dir);
    const codePath = path.resolve('program.js');
    // console.log('Ok, converting ' + dir + ' to program.js' + (cmd.bork ? ' bork' : ''))
    textConverter({textPath,codePath});
  })

program.parse(process.argv)
