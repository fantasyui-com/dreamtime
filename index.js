
module.exports = function(obj={}){

    const EventEmitter = require('events');
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
          emitter.on(name, function({input, setup}){
            console.info(`${name} got data: `, JSON.stringify({input, setup}));
            {
              let [name, setup] = data[index+1];
              emitter.emit(name, {input, setup});
            }
          });
        }


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
            obj[propKey] = function(){
              obj._dreamtime.data.push([propKey, arguments]);
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
