define('docs/renderers/Form/Repeat.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"repeat\" href=\"#repeat\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Repeat</h3><p>可用来设置重复频率</p>\n<ul>\n<li><code>type</code> 请设置成 <code>repeat</code></li>\n<li><code>options</code> 默认: <code>hourly,daily,weekly,monthly</code>， 可用配置 <code>secondly,minutely,hourly,daily,weekdays,weekly,monthly,yearly</code></li>\n<li><code>placeholder</code> 默认为 <code>不重复</code>, 当不指定值时的说明。</li>\n<li><strong>还有更多通用配置请参考</strong> <a href=\"/amis/docs/renderers/Form/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"form-item\">{\n  \"type\": \"repeat\",\n  \"name\": \"repeat\",\n  \"label\": \"重复频率\"\n}\n</script></div>\n\n\n<div class=\"m-t-lg b-l b-info b-3x wrapper bg-light dk\">文档内容有误？欢迎大家一起来编写，文档地址：<i class=\"fa fa-github\"></i><a href=\"https://github.com/baidu/amis/tree/master/docs/renderers/Form/Repeat.md\">/docs/renderers/Form/Repeat.md</a>。</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Repeat",
          "fragment": "repeat",
          "fullPath": "#repeat",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
