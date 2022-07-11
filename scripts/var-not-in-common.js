/**
 * 用于查找某个变量在 cxd-variables 里但不在 properties.scss 里的情况
 */

const fs = require('fs');
const path = require('path');

const cxdVariables = fs.readFileSync(
  path.join(__dirname, '..', 'scss', 'themes', '_cxd-variables.scss'),
  {encoding: 'utf8'}
);

const commonVariables = fs.readFileSync(
  path.join(__dirname, '..', 'scss', '_properties.scss'),
  {encoding: 'utf8'}
);

const cxdVariableSet = new Set();

cxdVariables.match(/\-\-[\-a-zA-Z0-9]+/g).forEach(function (variable) {
  cxdVariableSet.add(variable);
});

const commonVariableSet = new Set();

commonVariables.match(/\-\-[\-a-zA-Z0-9]+/g).forEach(function (variable) {
  commonVariableSet.add(variable);
});

for (const variable of cxdVariableSet) {
  if (!commonVariableSet.has(variable)) {
    console.log(variable);
  }
}
