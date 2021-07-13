amis.define('docs/zh-CN/components/form/input-date-range.md', function(require, exports, module, define) {

  module.exports = {
    "title": "InputDateRange 日期范围",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "InputDateRange",
    "icon": null,
    "order": 15,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"input-date-range\",\n            \"name\": \"select\",\n            \"label\": \"日期范围\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%86%85%E5%B5%8C%E6%A8%A1%E5%BC%8F\" href=\"#%E5%86%85%E5%B5%8C%E6%A8%A1%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>内嵌模式</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"debug\": true,\n    \"body\": [\n        {\n            \"type\": \"input-date-range\",\n            \"name\": \"date\",\n            \"label\": \"日期范围\",\n            \"embed\": true\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>format</td>\n<td><code>string</code></td>\n<td><code>X</code></td>\n<td><a href=\"./date#%E5%80%BC%E6%A0%BC%E5%BC%8F\">日期选择器值格式</a></td>\n</tr>\n<tr>\n<td>inputFormat</td>\n<td><code>string</code></td>\n<td><code>YYYY-DD-MM</code></td>\n<td><a href=\"./date#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F\">日期选择器显示格式</a></td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td><code>&quot;请选择日期范围&quot;</code></td>\n<td>占位文本</td>\n</tr>\n<tr>\n<td>ranges</td>\n<td><code>Array&lt;string&gt; 或 string</code></td>\n<td><code>&quot;yesterday,7daysago,prevweek,thismonth,prevmonth,prevquarter&quot;</code></td>\n<td>日期范围快捷键，可选：today, yesterday, 1dayago, 7daysago, 30daysago, 90daysago, prevweek, thismonth, thisquarter, prevmonth, prevquarter</td>\n</tr>\n<tr>\n<td>minDate</td>\n<td><code>string</code></td>\n<td></td>\n<td>限制最小日期，用法同 <a href=\"./date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4\">限制范围</a></td>\n</tr>\n<tr>\n<td>maxDate</td>\n<td><code>string</code></td>\n<td></td>\n<td>限制最大日期，用法同 <a href=\"./date#%E9%99%90%E5%88%B6%E8%8C%83%E5%9B%B4\">限制范围</a></td>\n</tr>\n<tr>\n<td>minDuration</td>\n<td><code>string</code></td>\n<td></td>\n<td>限制最小跨度，如： 2days</td>\n</tr>\n<tr>\n<td>maxDuration</td>\n<td><code>string</code></td>\n<td></td>\n<td>限制最大跨度，如：1year</td>\n</tr>\n<tr>\n<td>utc</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td><a href=\"./date#utc\">保存 UTC 值</a></td>\n</tr>\n<tr>\n<td>clearable</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否可清除</td>\n</tr>\n<tr>\n<td>embed</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否内联模式</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基本用法",
          "fragment": "%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "fullPath": "#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "level": 2
        },
        {
          "label": "内嵌模式",
          "fragment": "%E5%86%85%E5%B5%8C%E6%A8%A1%E5%BC%8F",
          "fullPath": "#%E5%86%85%E5%B5%8C%E6%A8%A1%E5%BC%8F",
          "level": 2
        },
        {
          "label": "属性表",
          "fragment": "%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "fullPath": "#%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
