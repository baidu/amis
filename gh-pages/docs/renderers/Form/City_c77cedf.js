define('docs/renderers/Form/City.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"city\" href=\"#city\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>City</h3><p>城市选择器，可用于让用户输入城市。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>city</code></li>\n<li><code>allowDistrict</code> 默认 <code>true</code> 允许输入区域</li>\n<li><code>allowCity</code>  默认 <code>true</code> 允许输入城市</li>\n<li><code>extractValue</code>  默认 <code>true</code> 是否抽取值，如果设置成 <code>false</code> 值格式会变成对象，包含 <code>code</code>、<code>province</code>、<code>city</code> 和 <code>district</code> 文字信息。</li>\n<li><strong>还有更多通用配置请参考</strong> <a href=\"/amis/docs/renderers/Form/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\" scope=\"form\">[\n    {\n      \"name\": \"city\",\n      \"type\": \"city\",\n      \"label\": \"城市选择\"\n    },\n\n    {\n        \"type\": \"static\",\n        \"name\": \"city\",\n        \"label\": \"当前值\"\n    }\n]\n</script></div>\n<p>从配置项可以看出来，通过设置 <code>allowDistrict</code> 和 <code>allowCity</code> 是可以限制用户输入级别的，比如只选择省份。</p>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\" scope=\"form\">[\n    {\n      \"name\": \"city\",\n      \"type\": \"city\",\n      \"label\": \"城市选择\",\n      \"allowDistrict\": false,\n      \"allowCity\": false\n    },\n\n    {\n        \"type\": \"static\",\n        \"name\": \"city\",\n        \"label\": \"当前值\"\n    }\n]\n</script></div>\n<p>从上面的例子可以看出来，值默认格式是编码（即 <code>code</code>），如果你想要详细点的信息，可以把 <code>extractValue</code> 设置成 <code>false</code>。</p>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\" scope=\"form\">[\n    {\n      \"name\": \"city\",\n      \"type\": \"city\",\n      \"label\": \"城市选择\",\n      \"extractValue\": false\n    },\n\n    {\n        \"type\": \"static\",\n        \"name\": \"city\",\n        \"label\": \"当前值\"\n    }\n]\n</script></div>\n\n\n<div class=\"m-t-lg b-l b-info b-3x wrapper bg-light dk\">文档内容有误？欢迎大家一起来编写，文档地址：<i class=\"fa fa-github\"></i><a href=\"https://github.com/baidu/amis/tree/master/docs/renderers/Form/City.md\">/docs/renderers/Form/City.md</a>。</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "City",
          "fragment": "city",
          "fullPath": "#city",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
