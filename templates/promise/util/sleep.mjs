export default function sleep(seconds){

  return new Promise(function(resolve, reject) {

    setTimeout(function(){

      resolve({slept:true, seconds});

    }, seconds * 1000 ); // Timeout

  }); // Promise

}; // default function
