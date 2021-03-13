/**
 * @file 用于生成 helper 文档中的 class 列表，需要在 scss 目录下运行。
 * 比如 node ../scripts/generate-helper-table.js helper/border/_border-style.scss
 */

const scssFile = process.argv[2];
const fs = require('fs');
const css = require('css');
const execSync = require('child_process').execSync;

fs.writeSync(
  fs.openSync('./tmp.scss', 'w'),
  `
@import './functions';
@import './variables';
@import './mixins';
@import '${scssFile}';
`
);

let generateCSS = execSync(`../node_modules/.bin/sass tmp.scss`).toString();

generateCSS = generateCSS.replace(/\/\*\!markdown[\s\S]*?\*\//g, '');

let parseCSS = css.parse(generateCSS);

console.log(`| Class       | Properties               |
| ----------- | ------------------------ |`);

for (let rule of parseCSS.stylesheet.rules) {
  if (rule.type === 'rule') {
    let className = rule.selectors[0].replace('.', '');
    let declarations = rule.declarations
      .map(declaration => {
        return `${declaration.property}: ${declaration.value}`;
      })
      .join('; ');
    console.log(`| ${className} | ${declarations} |`);
  }
}

fs.unlinkSync('./tmp.scss');
