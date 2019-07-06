
const kebabCase = require('kebab-case');
const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const util = require('util');

module.exports = function(obj={}){
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
        // check if module exists
        // execute it, passing information to the next.
        // run will be called once program structure is established.
        // Append the end event.
        data.push(['end',{source:'test'}]);
        emitter.on('end', ({input, setup}) => {
          console.info(`end got data: `, JSON.stringify({input, setup}))
        });
        // Create the chain
        for(let index = 0; index<obj._dreamtime.data.length-1; index++){
          let [name, setup] = data[index];
          const moduleName = kebabCase(name);
          emitter.on(name, function({input, setup}){

            // console.log(`\n -- -- -- -- -- ${name} -- -- -- -- -- \n`);
            // console.log(`${name} got input data:\n`, util.inspect(input, {compact:true}));
            // console.log(`${name} got setup data:\n`, util.inspect(setup, {compact:true}));

            if( !fs.existsSync(path.resolve(`./code_modules/${kebabCase(name)}`)) ){
              fs.mkdirSync(path.resolve(`./code_modules/${kebabCase(name)}`), {recursive:true})
              fs.copyFileSync(`${__dirname}/templates/standard/index.js`, `./code_modules/${kebabCase(name)}/index.js`);
              fs.copyFileSync(`${__dirname}/templates/standard/package.json`, `./code_modules/${kebabCase(name)}/package.json`);
              fs.copyFileSync(`${__dirname}/templates/standard/test.js`, `./code_modules/${kebabCase(name)}/test.js`);
              let p = JSON.parse(fs.readFileSync(`./code_modules/${kebabCase(name)}/package.json`).toString());
              p.name = kebabCase(name);
              fs.writeFileSync(`./code_modules/${kebabCase(name)}/package.json`, JSON.stringify(p,null,'  '))
            }
            const program = require(path.resolve(`./code_modules/${kebabCase(name)}/index.js`));


            const output = {};
            const next = function(){
              console.log(`Output from ${moduleName} contained ${Object.keys(output).join(', ')}`)
              let input = output;
              let [name, setup] = data[index+1];
              emitter.emit(name, {input, setup});
            }
            program({setup, input, output, next});
          });
        }
        // Create missing modules
        // BOOT
        // Configuration complete, sending standard input to the first listener
        let [name, setup] = data[0];
        emitter.emit(name, {input, setup});
      } // run
    }
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
