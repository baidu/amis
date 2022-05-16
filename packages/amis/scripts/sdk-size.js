/**
 * 用于简单计算 sdk 各个模块的大小
 */

const readline = require('readline');
const fs = require('fs');
const readInterface = readline.createInterface({
  input: fs.createReadStream(process.argv[2]),
  console: false
});

let currentModule = '';
let moduleSizeMap = {};

readInterface.on('line', (line) => {
   if (line.startsWith(`;/*`)) {
     currentModule = line.trim();
   }
   if (currentModule in moduleSizeMap) {
     moduleSizeMap[currentModule] += line.length;
   } else {
     moduleSizeMap[currentModule] = line.length;
   }
}).on('close', () => {
  let sizeArray = [];
  for (let module in moduleSizeMap) {
    sizeArray.push([module, moduleSizeMap[module]]);
  }

  sizeArray.sort(function(a, b) {
    return a[1] - b[1];
  });

  for (size of sizeArray) {
    console.log(size[0], size[1]);
  }
});

