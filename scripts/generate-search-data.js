/**
 * @file 生成给前端全文搜索用的文件
 * @author wuduoyi
 */

const glob = require('glob');
const fs = require('fs');
let yaml = require('js-yaml');
var rYml = /^\s*---([\s\S]*?)---\s/;

const resultData = {docs: []};

glob('./docs/**/*.md', {}, function (er, docs) {
  for (const doc of docs) {
    let content = fs.readFileSync(doc, {encoding: 'utf8'});
    let m = rYml.exec(content);
    let info = {};
    if (m && m[1]) {
      info = yaml.load(m[1]);
      content = content.substring(m[0].length);
    }

    const title = info.title || doc;
    // todo: 属性列表单独处理，检索的时候优先检索
    resultData.docs.push({
      title: title,
      // 去掉注释、换行、图片等
      body: content
        .replace(/<\!---.+-->/g, '')
        .replace(/!?\[.*\]\(.*\)/g, '')
        .replace(/```[^`]*```/g, ''),
      path: doc
        .slice(1)
        .replace('.md', '')
        .replace('/docs/zh-CN/components/', '/zh-CN/components/')
        .replace('/docs/zh-CN/style/', '/zh-CN/style/')
        .replace('/docs/zh-CN/', '/zh-CN/docs/')
    });
  }
  fs.writeFileSync('./examples/docs.json', JSON.stringify(resultData));
});
