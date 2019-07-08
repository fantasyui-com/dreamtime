
const kebabCase = require('kebab-case');
const path = require('path');
const fs = require('fs');

const EventEmitter = require('events');
const util = require('util');
const chalk = require('chalk');

module.exports = function(obj={}){
    let debug = 0;
    class MyEmitter extends EventEmitter {};
    const emitter = new MyEmitter();

    // PREPARATION OF OBJ METADATA
    if(obj._dreamtime === undefined){
      // prepare metadata
      const meta = {emitter};
      const data = [];

      obj._dreamtime = { meta, data };
      // test function will get input for root
      obj.testRun = function(input={}){
        if(debug > 2) console.log('Test run called!')
        // check if module exists
        // execute it, passing information to the next.
        // run will be called once program structure is established.
        // Append the end event.

        const readCache = function(name){
          const moduleName = kebabCase(name);

          if (!fs.existsSync(`./cache/${kebabCase(name)}/data.json`)) {
            return null;
          }

          const {expiration, output} = JSON.parse(fs.readFileSync(`./cache/${kebabCase(name)}/data.json`));

          let currentDate = new Date();
          let dateOfExpiration = new Date(expiration);
          let expired = (currentDate > dateOfExpiration)

            if(!expired){
              return output;
            }else{
              return null;
            }

        }
        const ensureModule = function(name){
          if( (!fs.existsSync(path.resolve(`./code_modules/${kebabCase(name)}`))) ){
            fs.mkdirSync(path.resolve(`./code_modules/${kebabCase(name)}`), {recursive:true})
            fs.copyFileSync(`${__dirname}/templates/standard/index.js`, `./code_modules/${kebabCase(name)}/index.js`);
            fs.copyFileSync(`${__dirname}/templates/standard/package.json`, `./code_modules/${kebabCase(name)}/package.json`);
            fs.copyFileSync(`${__dirname}/templates/standard/test.js`, `./code_modules/${kebabCase(name)}/test.js`);
            let p = JSON.parse(fs.readFileSync(`./code_modules/${kebabCase(name)}/package.json`).toString());
            p.name = kebabCase(name);
            fs.writeFileSync(`./code_modules/${kebabCase(name)}/package.json`, JSON.stringify(p,null,'  '))
          }

        }

        // Create the chain
        for(let index = 0; index<obj._dreamtime.data.length; index++){
          // Starting at the first entry in data
          let [name, setup] = data[index];
          const moduleName = kebabCase(name);

          emitter.on(name, function({input, setup}){

            // console.log(`\n -- -- -- -- -- ${name} -- -- -- -- -- \n`);
            // console.log(`${name} got input data:\n`, util.inspect(input, {compact:true}));
            // console.log(`${name} got setup data:\n`, util.inspect(setup, {compact:true}));

            // Create module from template, if missing.
            ensureModule(name);

            // Load Code Module
            const codeModule = require(path.resolve(`./code_modules/${kebabCase(name)}/index.js`));

            // Prepare arguments that code module will be called with
            const output = {};

            // This is executed by the user when they finish.
            const next = function(){

              //console.log(`Output from ${moduleName} contained ${Object.keys(output).join(', ')}`);

              //CACHE
              // Next was called, that means user program has finished, and output is available.
              // If cache is enabled, then serialize output.
              if((setup) && (setup.cache)){
                // SAVE OUTPUT
                let [timeValue, timeUnit] = setup.cache.split(' ');
                timeValue = parseInt(timeValue);
                let expirationDate = new Date();
                if(timeUnit.startsWith('second')){
                  expirationDate.setSeconds(expirationDate.getSeconds() + timeValue);
                }else if(timeUnit.startsWith('minute')){
                  expirationDate.setMinutes(expirationDate.getMinutes() + timeValue);
                }else if(timeUnit.startsWith('hour')){
                  expirationDate.setHours(expirationDate.getHours() + timeValue);
                }else if(timeUnit.startsWith('month')){
                  expirationDate.setMonth(expirationDate.getMonth() + timeValue);
                }else{
                  throw new Error('Unknown timeUnit use in cache duration, use second, minute, hour, or month')
                }
                expiration = expirationDate.toString();
                fs.mkdirSync(path.resolve(`./cache/${kebabCase(name)}`), {recursive:true})
                fs.writeFileSync(`./cache/${kebabCase(name)}/data.json`, JSON.stringify({expiration, output}, null, '  '));
                console.log(`CACHE of ${setup.cache} will expire on ${expiration}`)
              }
              //END CACHE


              //CACHE
              // now check if the emitter we are about to trigger was cached.
              // if it was cached then we get the data out and call the next emitter

              // END CAXXHE

              // Who is next?
              // {
              // let input = output;
              // let [name, setup] = data[index+1];
              // emitter.emit(name, {input, setup});
              // }

              console.log(`Module ${chalk.cyan(kebabCase(name))} returned following properties: ${Object.keys(output).map(i=>chalk.yellow(i + ' (' + output[i].length +')')).join(', ')}`);

              { // CACHE

                let input = output;
                let name = null;
                let setup = {};
                let step = 0;

                // LOOK AHEAD, we are adding 1... to existing program index to find an unchaced thing
                if( index === data.length-1 ){
                  // program end
                }else{
                for(let lookAheadIndex = 1; lookAheadIndex<data.length; lookAheadIndex++){
                  step = index+lookAheadIndex;
                  [name, setup] = data[step];
                  let cached = readCache(name);
                  if(cached){
                    console.log('\n')
                    console.log(`Step  #${step}`)
                    console.log('Did not need to be called becasue ist was cached', name)
                    // this module does not need to be called
                    input = cached;
                    // continue
                  }else{
                    // there was no cache, this module must be called
                    //console.log('Would have called', name)
                    break;
                  }
                } // end for loop
                console.log('\n')
                console.log(`Step  #${step}`)
                console.log(`Calling ${chalk.cyan(kebabCase(name))} with following properties: ${Object.keys(input).map(i=>chalk.yellow(i + ' (' + input[i].length +')')).join(', ')}`);
                emitter.emit(name, {input, setup});
                }

              } // END CACHE


            }

            codeModule({setup, input, output, next});

          });

        } // for each data

        init: {
          // At this point all emitters are setup.
          let [name, setup] = data[0];
          if(debug > 2) console.log(`Emiting boot event: ${name}`)
          emitter.emit(name, {input:{}, setup});
        }

      } // run
    } // if(obj._dreamtime === undefined){



    // RETURN STAGE
    // Proxy is used to just gather up the program structure information,
    // it keeps returning it self logging a sequence of function calls.
    const proxy = new Proxy(obj, {
      get(target, propKey) {
          if((!obj[propKey])&&(typeof propKey === 'string')){
            // this is the faux function that gathers intel on the program:
            obj[propKey] = function(setup){
              obj._dreamtime.data.push([propKey, setup]);
              return proxy;
            }
            return obj[propKey];
          }else{
            return target[propKey]
          }
      }
    }) // Proxy
    return proxy;
}
