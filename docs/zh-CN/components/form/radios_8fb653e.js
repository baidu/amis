amis.define('docs/zh-CN/components/form/radios.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Radios 单选框",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Radios 单选框",
    "icon": null,
    "order": 36,
    "html": "<div class=\"markdown-body\"><p>用于实现单选。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [\n    {\n      \"name\": \"radios\",\n      \"type\": \"radios\",\n      \"label\": \"radios\",\n      \"options\": [\n        {\n          \"label\": \"OptionA\",\n          \"value\": \"a\"\n        },\n        {\n          \"label\": \"OptionB\",\n          \"value\": \"b\"\n        },\n        {\n          \"label\": \"OptionC\",\n          \"value\": \"c\"\n        },\n        {\n          \"label\": \"OptionD\",\n          \"value\": \"d\"\n        }\n      ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%88%97%E6%98%BE%E7%A4%BA\" href=\"#%E5%88%97%E6%98%BE%E7%A4%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>列显示</h2><p>设置 <code>inline</code> 可以纵向显示，用于显示列很多的情况</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [\n    {\n      \"name\": \"radios\",\n      \"type\": \"radios\",\n      \"label\": \"radios\",\n      \"inline\": false,\n      \"options\": [\n        {\n          \"label\": \"OptionA\",\n          \"value\": \"a\"\n        },\n        {\n          \"label\": \"OptionB\",\n          \"value\": \"b\"\n        },\n        {\n          \"label\": \"OptionC\",\n          \"value\": \"c\"\n        },\n        {\n          \"label\": \"OptionD\",\n          \"value\": \"d\"\n        }\n      ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%8E%A7%E5%88%B6%E5%88%97%E6%98%BE%E7%A4%BA%E7%9A%84%E5%88%86%E8%A3%82\" href=\"#%E6%8E%A7%E5%88%B6%E5%88%97%E6%98%BE%E7%A4%BA%E7%9A%84%E5%88%86%E8%A3%82\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>控制列显示的分裂</h2><p>通过 columnsCount 来设置列显示的列数，比如下面例子是两列。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [\n    {\n      \"name\": \"radios\",\n      \"type\": \"radios\",\n      \"label\": \"radios\",\n      \"inline\": false,\n      \"columnsCount\": 2,\n      \"options\": [\n        {\n          \"label\": \"OptionA\",\n          \"value\": \"a\"\n        },\n        {\n          \"label\": \"OptionB\",\n          \"value\": \"b\"\n        },\n        {\n          \"label\": \"OptionC\",\n          \"value\": \"c\"\n        },\n        {\n          \"label\": \"OptionD\",\n          \"value\": \"d\"\n        }\n      ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>当做选择器表单项使用时，除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>options</td>\n<td><code>Array&lt;object&gt;</code>或<code>Array&lt;string&gt;</code></td>\n<td></td>\n<td><a href=\"./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options\">选项组</a></td>\n</tr>\n<tr>\n<td>source</td>\n<td><code>string</code>或 <a href=\"../../../docs/types/api\">API</a></td>\n<td></td>\n<td><a href=\"./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source\">动态选项组</a></td>\n</tr>\n<tr>\n<td>labelField</td>\n<td><code>boolean</code></td>\n<td><code>&quot;label&quot;</code></td>\n<td><a href=\"./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield\">选项标签字段</a></td>\n</tr>\n<tr>\n<td>valueField</td>\n<td><code>boolean</code></td>\n<td><code>&quot;value&quot;</code></td>\n<td><a href=\"./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield\">选项值字段</a></td>\n</tr>\n<tr>\n<td>columnsCount</td>\n<td><code>number</code></td>\n<td><code>1</code></td>\n<td>选项按几列显示，默认为一列</td>\n</tr>\n<tr>\n<td>inline</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否显示为一行</td>\n</tr>\n<tr>\n<td>autoFill</td>\n<td><code>object</code></td>\n<td></td>\n<td><a href=\"./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill\">自动填充</a></td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "列显示",
          "fragment": "%E5%88%97%E6%98%BE%E7%A4%BA",
          "fullPath": "#%E5%88%97%E6%98%BE%E7%A4%BA",
          "level": 2
        },
        {
          "label": "控制列显示的分裂",
          "fragment": "%E6%8E%A7%E5%88%B6%E5%88%97%E6%98%BE%E7%A4%BA%E7%9A%84%E5%88%86%E8%A3%82",
          "fullPath": "#%E6%8E%A7%E5%88%B6%E5%88%97%E6%98%BE%E7%A4%BA%E7%9A%84%E5%88%86%E8%A3%82",
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
