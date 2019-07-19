/*
 classification: PROCEDURE TASK
           name: {{name}}
    description: {{description}}
         author: {{author}}
*/
/*
  This is the default method of loading the main {{camelCase name}}
  you can custome it to support different methods of execution (aws, stdlib, etc)
*/

import main from './main.mjs';

export default function {{camelCase name}}({context, setup, input}){

  return main({context, setup, input});

};
