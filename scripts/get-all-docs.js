/**
 * 获取所有文档和 json 示例，生成到一个文件里，用于继续预训练
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const docs = path.resolve(__dirname, '..', 'docs');

const examples = path.resolve(__dirname, '..', 'examples');

const outputFile = 'amis_docs.txt';

glob(docs + '/**/*.md', {}, (err, files) => {
  for (const file of files) {
    const data = fs.readFileSync(file, {encoding: 'utf8', flag: 'r'});
    fs.appendFileSync(outputFile, data + '\n\n');
  }
});

// glob(examples + '/**/*.jsx', {}, (err, files) => {
//   for (const file of files) {
//     try {
//       const content = fs.readFileSync(file, {encoding: 'utf8', flag: 'r'});
//       if (content.indexOf('export default') !== -1) {
//         const schema = Function(content.replace('export default', 'return'))();
//         const json = JSON.stringify(schema, null, 2);
//         console.log(file);
//         fs.appendFileSync(outputFile, json + '\n\n');
//       }
//     } catch (e) {
//       // console.log(e);
//     }
//   }
// });
