const program = wrap({foo:1});

function wrap(obj){

  if(obj._dreamtime === undefined){
    obj._dreamtime = {list:[]};
    obj.run = function(){

      // check if module exists
      // execute it, passing information to the next.

    }
  }else{
  }

  // Proxy is used to just gather up the program structure information,
  // it keeps returning it self logging a sequence of function calls.
  return new Proxy(obj, {
    get(target, propKey) {
        if((!obj[propKey])&&(typeof propKey === 'string')){
          obj[propKey] = function mock(){ return program; }
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
