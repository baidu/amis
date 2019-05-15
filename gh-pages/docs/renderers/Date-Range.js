define('docs/renderers/Date-Range.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"date-range\" href=\"#date-range\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Date-Range</h3><p>日期范围类型。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>date-range</code></li>\n<li><code>format</code> 默认 <code>X</code> 即时间戳格式，用来提交的时间格式。更多格式类型请参考 moment.</li>\n<li><code>inputFormat</code> 默认 <code>HH:mm</code> 用来配置显示的时间格式。</li>\n<li><code>minDate</code> 限制最小日期，可用 <code>${xxx}</code> 取值，或者输入相对时间，或者时间戳。如：<code>${start}</code>、<code>+3days</code>、<code>+3days+2hours</code>或者 <code>${start|default:-2days}+3days</code></li>\n<li><code>maxDate</code> 限制最小日期，可用 <code>${xxx}</code> 取值，或者输入相对时间，或者时间戳。如：<code>${start}</code>、<code>+3days</code>、<code>+3days+2hours</code>或者 <code>${start|default:-2days}+3days</code></li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 450px\"><script type=\"text/schema\" height=\"450\" scope=\"form\">[\n    {\n      \"type\": \"date-range\",\n      \"name\": \"select\",\n      \"label\": \"日期范围\"\n    },\n\n    {\n      \"type\": \"static\",\n      \"name\": \"select\",\n      \"label\": \"当前值\"\n    }\n]\n</script></div>\n<p>考虑到大家都习惯用两个字段来存储，那么就用 date 来代替吧。</p>\n<div class=\"amis-preview\" style=\"height: 450px\"><script type=\"text/schema\" height=\"450\" scope=\"form\">[\n  [\n    {\n      \"type\": \"date\",\n      \"name\": \"start\",\n      \"label\": \"开始日期\",\n      \"maxDate\": \"$end\"\n    },\n\n    {\n      \"type\": \"date\",\n      \"name\": \"end\",\n      \"label\": \"结束日期\",\n      \"minDate\": \"$start\"\n    }\n  ],\n\n  {\n    \"type\": \"static\",\n    \"name\": \"select\",\n    \"label\": \"当前值\",\n    \"description\": \"包含开始日期和结束日期\",\n    \"tpl\": \"$start - $end\"\n  }\n]\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Date-Range",
          "fragment": "date-range",
          "fullPath": "#date-range",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
