import util from 'util';
import sleep from './util/sleep.mjs';

export default async function main({ context, setup, input }) {

  // console.log(util.inspect(input,false,2,true))

  const output = {
    someList:[],
    // url: 'example.com',
    // data: {},
  };

  return async (resolve, reject) => {

    console.log('module code incomplete...')
    setup.sleepList = [1,2,3,5,8,13];
    for (const duration of setup.sleepList) {
      await sleep(duration);
      console.log('still incomplete...')
    }

    resolve(output);
  };

};
