amis.define('docs/zh-CN/components/form/list-select.md', function(require, exports, module, define) {

  module.exports = {
    "title": "ListSelect 列表",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "ListSelect",
    "icon": null,
    "order": 29,
    "html": "<div class=\"markdown-body\"><p>ListSelect 一般用来实现选择，可以单选也可以多选，和 Radio/Checkboxs 最大的不同是在展现方面支持带图片。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"body\": [\n    {\n      \"type\": \"list-select\",\n      \"name\": \"select\",\n      \"label\": \"单选\",\n      \"clearable\": true,\n      \"options\": [\n        {\n          \"label\": \"Option A\",\n          \"value\": \"a\"\n        },\n        {\n          \"label\": \"Option B\",\n          \"value\": \"b\"\n        }\n      ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%80%89%E9%A1%B9%E5%B8%A6%E5%9B%BE%E7%89%87\" href=\"#%E9%80%89%E9%A1%B9%E5%B8%A6%E5%9B%BE%E7%89%87\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>选项带图片</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n      {\n        \"type\": \"list-select\",\n        \"name\": \"select\",\n        \"label\": \"图片\",\n        \"options\": [\n          {\n            \"label\": \"OptionA\",\n            \"value\": \"a\",\n            \"image\": \"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg\"\n          },\n          {\n            \"label\": \"OptionB\",\n            \"value\": \"b\",\n            \"image\": \"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg\"\n          },\n          {\n            \"label\": \"OptionC\",\n            \"value\": \"c\",\n            \"image\": \"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg\"\n          },\n          {\n            \"label\": \"OptionD\",\n            \"value\": \"d\",\n            \"image\": \"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg\"\n          }\n        ]\n      }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>当做选择器表单项使用时，除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>options</td>\n<td><code>Array&lt;object&gt;</code>或<code>Array&lt;string&gt;</code></td>\n<td></td>\n<td><a href=\"./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options\">选项组</a></td>\n</tr>\n<tr>\n<td>source</td>\n<td><code>string</code>或 <a href=\"../../../docs/types/api\">API</a></td>\n<td></td>\n<td><a href=\"./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source\">动态选项组</a></td>\n</tr>\n<tr>\n<td>multiple</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td><a href=\"./options#%E5%A4%9A%E9%80%89-multiple\">多选</a></td>\n</tr>\n<tr>\n<td>labelField</td>\n<td><code>boolean</code></td>\n<td><code>&quot;label&quot;</code></td>\n<td><a href=\"./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield\">选项标签字段</a></td>\n</tr>\n<tr>\n<td>valueField</td>\n<td><code>boolean</code></td>\n<td><code>&quot;value&quot;</code></td>\n<td><a href=\"./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield\">选项值字段</a></td>\n</tr>\n<tr>\n<td>joinValues</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td><a href=\"./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues\">拼接值</a></td>\n</tr>\n<tr>\n<td>extractValue</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td><a href=\"./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue\">提取值</a></td>\n</tr>\n<tr>\n<td>autoFill</td>\n<td><code>object</code></td>\n<td></td>\n<td><a href=\"./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill\">自动填充</a></td>\n</tr>\n<tr>\n<td>listClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>支持配置 list div 的 css 类名。比如: <code>flex justify-between</code></td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "选项带图片",
          "fragment": "%E9%80%89%E9%A1%B9%E5%B8%A6%E5%9B%BE%E7%89%87",
          "fullPath": "#%E9%80%89%E9%A1%B9%E5%B8%A6%E5%9B%BE%E7%89%87",
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
