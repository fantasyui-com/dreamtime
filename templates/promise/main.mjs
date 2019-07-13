import sleep from './util/sleep.mjs';

export default async function main({context, setup, input}) {

  const output = {
    // someList:[],
    // url: 'example.com',
    // meta: {},
    // data: {},
  };

  return new Promise( async (resolve, reject) => {

    for (const duration of setup.sleepList) {
      output.htmlList.push( await sleep(duration) );
    }
    resolve(output);

  });

};
