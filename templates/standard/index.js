
module.exports = function({setup, input, output, next}){
  // setup contains function parameters
  // input contains input packet
  // output contains .meta and .data
  // assign something to data
  output.data = 'TODO';

  // always call next.
  // next will send res to the next program in the chain
  next();
}
