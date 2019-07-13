/*
  This is the default method of loading the main.
*/

import main from './main.mjs';

export default function downloadHtml({context, setup, input}){

  return main({context, setup, input});

};
