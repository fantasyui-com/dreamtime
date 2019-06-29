
module.exports = function(req, res, next){

      // assign something to data
      res.data = 'TODO';

      // always call next.
      // next will send res to the next program in the chain
      next();

}
