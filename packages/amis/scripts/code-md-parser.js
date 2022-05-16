const parserMarkdown = require('./md-parser');

module.exports = function (content, file) {
  const markdowns = [];
  
  content.replace(/\/\*\!markdown\n([\s\S]+?)\*\//g, function (_, md) {
    markdowns.push(md.trim());
  });

  return parserMarkdown(markdowns.join('\n\n'), file);
};
