const fs = require('fs');
const path = require('path');
const {inspect} = require('util');

const kebabCase = require('lodash/kebabCase');
const zip = require('lodash/zip');

const matchPatterns = function(patternList,lineText){
  for(let index = 0; index < patternList.length; index++){
    const patternExpression = patternList[index];
    const resultList = lineText.match(patternExpression);
    //console.log(lineText, resultList, patternExpression)
    if(resultList){
      lineData = Object.assign({},resultList.groups);
      break; // match found exit loop
    }
  }
  Object.keys( lineData ).forEach(key=>{
    lineData[key] = lineData[key].trim();
  })
  return lineData;
}

const lineType = function(lineText){
  let responseString = null;
  const typeMatch = lineText.match(/\s*(?<type>.*?)\s*:/);
  if(typeMatch){
    responseString = kebabCase(typeMatch.groups.type);
  }
  return responseString;
}

const lineInterpreter = function(lineText){

  const type = lineType(lineText);
  let data = null

  if(0){
  }else if(type === 'program'){
    const patternList = [
      /.*?:\s*(?<name>.+?)\s*-\s*(?<description>.*)$/, // with description
      /.*?:\s*(?<name>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'author'){
    const patternList = [
      /.*?:\s*(?<author>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'keywords'){
    const patternList = [
      /.*?:\s*(?<keywords>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
    data.keywords = data.keywords.split(/, | |,/).map(i=>i.trim());

  }else if(type === 'procedure'){
    const patternList = [
      /.*?:\s*(?<name>.+?)\s*-\s*(?<description>.*)$/, // with description
      /.*?:\s*(?<name>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'task'){
    const patternList = [
      /.*?:\s*(?<name>.+?)\s*-\s*(?<description>.*)$/, // with description
      /.*?:\s*(?<name>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'task-dependencies'){
    const patternList = [
      /.*?:\s*(?<dependencies>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
    data.dependencies = data.dependencies.split(/, | |,/).map(i=>i.trim()).map(name=>({name,version:'latest'}));
  }else if(type === 'action'){
    const patternList = [
      /.*?:\s*(?<name>.+?)\s*-\s*(?<description>.*)$/, // with description
      /.*?:\s*(?<name>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'action-dependencies'){
    const patternList = [
      /.*?:\s*(?<dependencies>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
    data.dependencies = data.dependencies.split(/, | |,/).map(i=>i.trim()).map(name=>({name,version:'latest'}));
  }else if(type === 'action-parameters'){
    const patternList = [
      /.*?:\s*(?<parameters>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'task-parameters'){
    const patternList = [
      /.*?:\s*(?<parameters>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);

  }else if(type === 'procedure-test'){
    const patternList = [
      /.*?:\s*(?<description>.+?)\s*-\s*(?<assertion>.*)$/, // with description
    ]
    data = matchPatterns(patternList, lineText);

  }else if(type === 'task-test'){
    const patternList = [
      /.*?:\s*(?<description>.+?)\s*-\s*(?<assertion>.*)$/, // with description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'action-test'){
    const patternList = [
      /.*?:\s*(?<description>.+?)\s*-\s*(?<assertion>.*)$/, // with description
    ]
    data = matchPatterns(patternList, lineText);

  }else{
    const str = `Unknown line type: ${type}`
    console.error(str)
  }

  return Object.assign({type:kebabCase(type)},data);

}





module.exports = function({textPath,codePath}){
  const jsFile = [];

  const textData = fs.readFileSync(textPath).toString();
  jsFile.push(`/* generated on ${new Date()} from ${textPath}\n \n${textData}\n*/`);
  const textDataList = textData
    .split("\n")
    .map(i=>i.replace(/ +$/,''))
    .filter(i=>i.length);

  const program = {
    meta:{
      name: 'Untitled',
      description: 'Not available',
      author: 'https://github.com/fantasyui-com',
      keywords: ['program']
    },
    data:[]
  }

  let activeProcedure = {meta:{}, data:[]};
  let activeTask = {meta:{}, data:[]};
  let activeAction = {meta:{}, data:[]};

  textDataList.forEach((input,index)=>{

    let lineNumber = index+1;
    let lineText = input.trim();
    let lineData = lineInterpreter(input)

    //console.log(lineData)

    if(0){

    } else if (lineData.type === 'program') {
      program.meta.name = lineData.name
      program.meta.description = lineData.description

    } else if (lineData.type === 'author') {
      program.meta.author = lineData.author

    } else if (lineData.type === 'keywords') {
      program.meta.keywords = lineData.keywords


    } else if (lineData.type === 'procedure') {
      activeProcedure = { meta: lineInterpreter(lineText), test: [], data: [] };
      program.data.push(activeProcedure);

    } else if (lineData.type === 'task') {
      activeTask = { meta: lineInterpreter(lineText), test: [], data: [] };
      activeProcedure.data.push(activeTask);

    } else if (lineData.type === 'action') {
      activeAction = { meta: lineInterpreter(lineText), test: [], data: [] };
      activeTask.data.push(activeAction);


    } else if (lineData.type === 'action-parameters') {
      activeAction.meta.parameters = lineData.parameters;

    } else if (lineData.type === 'task-parameters') {
      activeTask.meta.parameters = lineData.parameters;

    } else if (lineData.type === 'task-dependencies') {
      activeTask.meta.dependencies = lineData.dependencies;


    } else if (lineData.type === 'action-dependencies') {
      activeAction.meta.dependencies = lineData.dependencies;

    } else if (lineData.type === 'procedure-test') {
      let {description, assertion} = lineData;
      activeProcedure.test.push({description, assertion});

    } else if (lineData.type === 'task-test') {
      let {description, assertion} = lineData;
      activeTask.test.push({description, assertion});

     } else if (lineData.type === 'action-test') {
      let {description, assertion} =  lineData;
      activeAction.test.push({description, assertion});


    } else {
      console.log('Unsupported type', lineData.type);
    }



  })

  //console.log( JSON.stringify(program,null,' ') )
  jsFile.push(`\nconst program = ${JSON.stringify(program,null,' ')};\nmodule.exports = program;\n`);
  fs.writeFileSync( codePath, jsFile.join('\n') );
}
