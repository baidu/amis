define('docs/renderers/Form/Time.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"time\" href=\"#time\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Time</h3><p>时间类型。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>time</code></li>\n<li><code>format</code> 默认 <code>X</code> 即时间戳格式，用来提交的时间格式。更多格式类型请参考 <a href=\"http://momentjs.com/\">moment</a>.</li>\n<li><code>inputFormat</code> 默认 <code>HH:mm</code> 用来配置显示的时间格式。</li>\n<li><code>timeFormat</code> 默认 <code>HH:mm</code> 用来配置选择的时间格式。</li>\n<li><code>placeholder</code> 默认 <code>请选择日期</code></li>\n<li><code>timeConstraints</code> 请参考： <a href=\"https://github.com/YouCanBookMe/react-datetime\">react-datetime</a></li>\n<li><code>value</code> 这里面 value 需要特殊说明一下，因为支持相对值。如：<ul>\n<li><code>-2mins</code> 2 分钟前</li>\n<li><code>+2days</code> 2 天后</li>\n<li><code>-10week</code> 十周前</li>\n</ul>\n</li>\n<li><strong>还有更多通用配置请参考</strong> <a href=\"/amis/docs/renderers/Form/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 450px\"><script type=\"text/schema\" height=\"450\" scope=\"form\">[\n    {\n      \"type\": \"time\",\n      \"name\": \"select\",\n      \"label\": \"日期\"\n    },\n\n    {\n      \"type\": \"static\",\n      \"name\": \"select\",\n      \"label\": \"当前值\"\n    }\n]\n</script></div>\n\n\n<div class=\"m-t-lg b-l b-info b-3x wrapper bg-light dk\">文档内容有误？欢迎大家一起来编写，文档地址：<i class=\"fa fa-github\"></i><a href=\"https://github.com/baidu/amis/tree/master/docs/renderers/Form/Time.md\">/docs/renderers/Form/Time.md</a>。</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Time",
          "fragment": "time",
          "fullPath": "#time",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
