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

readInterface
  .on('line', line => {
    if (line.startsWith(`;/*`)) {
      currentModule = line.trim();
    }
    if (currentModule in moduleSizeMap) {
      moduleSizeMap[currentModule] += line.length;
    } else {
      moduleSizeMap[currentModule] = line.length;
    }
  })
  .on('close', () => {
    const moduleSize2Map = {};
    let sizeArray = [];
    for (let module in moduleSizeMap) {
      sizeArray.push([module, moduleSizeMap[module]]);

      const parts = module.substring(4, module.length - 2).split('/');
      while (parts.length > 1 && parts[parts.length - 2] !== 'node_modules') {
        if (
          parts[parts.length - 3] === 'node_modules' &&
          parts[parts.length - 2][0] === '@'
        ) {
          break;
        }

        parts.pop();
      }
      if (parts[0] === 'node_modules') {
        parts.shift();
      }
      const moduleName = parts.join('/');
      moduleSize2Map[moduleName] = moduleSize2Map[moduleName] || 0;
      moduleSize2Map[moduleName] += moduleSizeMap[module];
    }

    sizeArray.sort(function (a, b) {
      return a[1] - b[1];
    });

    for (size of sizeArray) {
      console.log(size[0], size[1]);
    }

    console.log('\n\n\npackages\n\n');

    const sizeArray2 = [];
    for (let module in moduleSize2Map) {
      sizeArray2.push([module, moduleSize2Map[module]]);
    }
    sizeArray2.sort(function (a, b) {
      return a[1] - b[1];
    });
    for (size of sizeArray2) {
      console.log(size[0], size[1]);
    }
  });
