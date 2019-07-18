import assert from 'assert';
import program from './index.mjs';

const setup = {
  downloadCache: "1000 years",
  websiteList: [ "https://www.spacejam.com/archive/spacejam/movie/jam.htm" ]
};

const input = {};

async function main(context = {}){
  try {
    // Faux test, data will change...
    const response = await program({context, setup, input});
    const actualBytes = response.htmlList[0].length;
    const expectedBytes = 6418;
    assert.equal(actualBytes, expectedBytes);
  } catch(error) {
    console.error(error);
  }

}

main();
