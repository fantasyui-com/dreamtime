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
    responseString = typeMatch.groups.type;
  }
  return responseString;
}

const lineInterpreter = function(lineText){

  const type = lineType(lineText);
  let data = null

  if(0){
  }else if(type === 'Program'){
    const patternList = [
      /.*?:\s*(?<name>.+?)\s*-\s*(?<description>.*)$/, // with description
      /.*?:\s*(?<name>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'Author'){
    const patternList = [
      /.*?:\s*(?<author>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'Keywords'){
    const patternList = [
      /.*?:\s*(?<keywords>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
    data.keywords = data.keywords.split(/, | |,/).map(i=>i.trim());

  }else if(type === 'Procedure'){
    const patternList = [
      /.*?:\s*(?<name>.+?)\s*-\s*(?<description>.*)$/, // with description
      /.*?:\s*(?<name>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'Task'){
    const patternList = [
      /.*?:\s*(?<name>.+?)\s*-\s*(?<description>.*)$/, // with description
      /.*?:\s*(?<name>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'Task Modules'){
    const patternList = [
      /.*?:\s*(?<modules>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
    data.modules = data.modules.split(/, | |,/).map(i=>i.trim());
  }else if(type === 'Action'){
    const patternList = [
      /.*?:\s*(?<name>.+?)\s*-\s*(?<description>.*)$/, // with description
      /.*?:\s*(?<name>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'Action Modules'){
    const patternList = [
      /.*?:\s*(?<modules>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
    data.modules = data.modules.split(/, | |,/).map(i=>i.trim());
  }else if(type === 'Task Modules'){
    const patternList = [
      /.*?:\s*(?<modules>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
    data.modules = data.modules.split(/, | |,/).map(i=>i.trim());
  }else if(type === 'Action Parameters'){
    const patternList = [
      /.*?:\s*(?<parameters>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);

  }else if(type === 'Procedure Test'){
    const patternList = [
      /.*?:\s*(?<name>.+?)\s*-\s*(?<description>.*)$/, // with description
      /.*?:\s*(?<name>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);

  }else if(type === 'Task Test'){
    const patternList = [
      /.*?:\s*(?<name>.+?)\s*-\s*(?<description>.*)$/, // with description
      /.*?:\s*(?<name>.+?)$/ // no description
    ]
    data = matchPatterns(patternList, lineText);
  }else if(type === 'Action Test'){
    const patternList = [
      /.*?:\s*(?<name>.+?)\s*-\s*(?<description>.*)$/, // with description
      /.*?:\s*(?<name>.+?)$/ // no description
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

  let activeProcedure;
  let activeTask;
  let activeAction;

  textDataList.forEach((input,index)=>{

    let lineNumber = index+1;
    let lineText = input.trim();
    let lineData = lineInterpreter(input)

    console.log(lineData)

    if(0){
    } else if (lineData.type === 'program') {
      program.meta.name = lineData.name
      program.meta.description = lineData.description

    } else if (lineData.type === 'author') {
      program.meta.author = lineData.author

    } else if (lineData.type === 'procedure') {
      activeProcedure = { meta: lineInterpreter(lineText), data: [] };
      program.data.push(activeProcedure);

    } else if (lineData.type === 'task') {
      activeTask = { meta: lineInterpreter(lineText), data: [] };
      activeProcedure.data.push(activeTask);

    } else if (lineData.type === 'action') {
      activeFunction = { meta: lineInterpreter(lineText), data: [] };
      activeTask.data.push(activeFunction);
    }







  })
  //console.log(inspect(program,false,6,true))
  console.log( JSON.stringify(program,null,' ') )
  // interpret lines ...

  fs.writeFileSync( codePath, jsFile.join('\n') );
}
