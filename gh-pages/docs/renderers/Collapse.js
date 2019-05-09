define('docs/renderers/Collapse.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"collapse\" href=\"#collapse\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Collapse</h3><p>折叠器</p>\n<ul>\n<li><code>type</code> 请设置成 <code>collapse</code></li>\n<li><code>title</code> 标题</li>\n<li><code>collapsed</code> 默认是否要收起。</li>\n<li><code>className</code> CSS 类名，默认：<code>bg-white wrapper</code>。</li>\n<li><code>headingClassName</code> 标题 CSS 类名，默认：<code>font-thin b-b b-light text-lg p-b-xs</code>。</li>\n<li><code>bodyClassName</code> 内容 CSS 类名。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"body\">{\n    \"type\": \"collapse\",\n    \"title\": \"标题\",\n    \"body\": \"内容。。。\"\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Collapse",
          "fragment": "collapse",
          "fullPath": "#collapse",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
