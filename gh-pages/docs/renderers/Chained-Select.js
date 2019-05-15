define('docs/renderers/Chained-Select.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"chained-select\" href=\"#chained-select\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Chained-Select</h3><p>无限级别下拉，只支持单选，且必须和 <code>source</code> 搭配，通过 API 拉取数据，只要 API 有返回结果，就能一直无限级别下拉下去。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>chained-select</code></li>\n<li><code>options</code> 选项配置，类型为数组，成员格式如下。<ul>\n<li><code>label</code> 文字</li>\n<li><code>value</code> 值</li>\n</ul>\n</li>\n<li><code>source</code> Api 地址，如果选项不固定，可以通过配置 <code>source</code> 动态拉取。另外也可以用 <code>$xxxx</code> 来获取当前作用域中的变量。\n更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a>。</li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"form-item\">{\n  \"name\": \"select3\",\n  \"type\": \"chained-select\",\n  \"label\": \"级联下拉\",\n  \"source\": \"https://houtai.baidu.com/api/mock2/options/chainedOptions?waitSeconds=1&parentId=$parentId&level=$level&maxLevel=4&waiSeconds=1\",\n  \"value\": \"a,b\"\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Chained-Select",
          "fragment": "chained-select",
          "fullPath": "#chained-select",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
