define('docs/renderers/Datetime.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"datetime\" href=\"#datetime\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Datetime</h3><p>日期时间类型。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>datetime</code></li>\n<li><code>format</code> 默认 <code>X</code> 即时间戳格式，用来提交的时间格式。更多格式类型请参考 moment.</li>\n<li><code>inputFormat</code> 默认 <code>YYYY-MM-DD HH:mm:ss</code> 用来配置显示的时间格式。</li>\n<li><code>placeholder</code> 默认 <code>请选择日期</code></li>\n<li><code>timeConstraints</code> 请参考： <a href=\"https://github.com/YouCanBookMe/react-datetime\">https://github.com/YouCanBookMe/react-datetime</a></li>\n<li><code>value</code> 这里面 value 需要特殊说明一下，因为支持相对值。如：<ul>\n<li><code>-2mins</code> 2 分钟前</li>\n<li><code>+2days</code> 2 天后</li>\n<li><code>-10week</code> 十周前</li>\n</ul>\n</li>\n<li><code>minDate</code> 限制最小日期，可用 <code>${xxx}</code> 取值，或者输入相对时间，或者时间戳。如：<code>${start}</code>、<code>+3days</code>、<code>+3days+2hours</code>或者 <code>${start|default:-2days}+3days</code></li>\n<li><code>maxDate</code> 限制最小日期，可用 <code>${xxx}</code> 取值，或者输入相对时间，或者时间戳。如：<code>${start}</code>、<code>+3days</code>、<code>+3days+2hours</code>或者 <code>${start|default:-2days}+3days</code></li>\n<li><code>minTime</code> 限制最小时间，可用 <code>${xxx}</code> 取值，或者输入相对时间，或者时间戳。如：<code>${start}</code>、<code>+3days</code>、<code>+3days+2hours</code>或者 <code>${start|default:-2days}+3days</code></li>\n<li><p><code>maxTime</code> 限制最大时间，可用 <code>${xxx}</code> 取值，或者输入相对时间，或者时间戳。如：<code>${start}</code>、<code>+3days</code>、<code>+3days+2hours</code>或者 <code>${start|default:-2days}+3days</code></p>\n<p>可用单位： <code>min</code>、<code>hour</code>、<code>day</code>、<code>week</code>、<code>month</code>、<code>year</code>。所有单位支持复数形式。</p>\n</li>\n<li><p>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></p>\n</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 450px\"><script type=\"text/schema\" height=\"450\" scope=\"form\">[\n    {\n      \"type\": \"datetime\",\n      \"name\": \"select\",\n      \"label\": \"日期\"\n    },\n\n    {\n      \"type\": \"static\",\n      \"name\": \"select\",\n      \"label\": \"当前值\"\n    }\n]\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Datetime",
          "fragment": "datetime",
          "fullPath": "#datetime",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
