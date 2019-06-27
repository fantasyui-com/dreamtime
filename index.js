const program = wrap({foo:1});




function wrap(obj){

  const EventEmitter = require('events');
  class MyEmitter extends EventEmitter {};

  if(obj._dreamtime === undefined){
    obj._dreamtime = { data:[], list:[], emitter: new MyEmitter()};

    obj.run = function(standardInput={}){

      // check if module exists
      // execute it, passing information to the next.
      // run will be called once program structure is established.

      obj._dreamtime.emitter.on('root', (incoming) => {
        const next = obj._dreamtime.list[0];
        console.log('root heard', incoming)
        console.log(`root will message ${next}`)
        obj._dreamtime.emitter.emit(next, {conf:obj._dreamtime.data[0]});
      });

      obj._dreamtime.emitter.on('end', (incoming) => {
        console.info('End got data', incoming)
      });

      obj._dreamtime.list.push('end');

      for(let index = 0; index<obj._dreamtime.list.length-1; index++){
        let item = obj._dreamtime.list[index]
        let data = obj._dreamtime.data[index]
        console.log(index, item)
        obj._dreamtime.emitter.on(item, (incoming) => {
          console.log('%s heard', item, incoming)
          obj._dreamtime.emitter.emit(obj._dreamtime.list[index+1], {conf:obj._dreamtime.data[index+1]});
        });

      }


      console.log('Emitting to root')
      program._dreamtime.emitter.emit('root', standardInput);


    } // run
  }else{
  }

  // Proxy is used to just gather up the program structure information,
  // it keeps returning it self logging a sequence of function calls.
  return new Proxy(obj, {
    get(target, propKey) {
        if((!obj[propKey])&&(typeof propKey === 'string')){
          obj[propKey] = function mock(){ obj._dreamtime.data.push(arguments); return program; }
          obj._dreamtime.list.push(propKey);

          return obj[propKey];
        }else{
          return target[propKey]
        }
    }

  })

}

module.exports = function(obj={}){
  return wrap(obj);
}
