import util from 'util';
import sleep from './util/sleep.mjs';

export default async function main({context, setup, input}) {

  console.log(util.inspect(input,false,2,true))

  const output = {
    someList:[],
    // url: 'example.com',
    // meta: {},
    // data: {},
  };

  return new Promise( async (resolve, reject) => {

    setup.sleepList = [1,2,3]; // Faux
    for (const duration of setup.sleepList) {
      output.someList.push( await sleep(duration) );
    }
    resolve(output);

  });

};
