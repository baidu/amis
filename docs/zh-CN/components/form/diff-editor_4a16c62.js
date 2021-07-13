amis.define('docs/zh-CN/components/form/diff-editor.md', function(require, exports, module, define) {

  module.exports = {
    "title": "DiffEditor 对比编辑器",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "DiffEditor 对比编辑器",
    "icon": null,
    "order": 17,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" href=\"#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本使用</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"diff-editor\",\n            \"name\": \"diff\",\n            \"label\": \"Diff-Editor\",\n            \"diffValue\": \"hello world\",\n            \"value\": \"hello\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E7%A6%81%E7%94%A8%E7%BC%96%E8%BE%91%E5%99%A8\" href=\"#%E7%A6%81%E7%94%A8%E7%BC%96%E8%BE%91%E5%99%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>禁用编辑器</h2><p>左侧编辑器始终不可编辑，右侧编辑器可以通过设置<code>disabled</code>或<code>disabledOn</code>，控制是否禁用</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"diff-editor\",\n            \"name\": \"diff\",\n            \"label\": \"Diff-Editor\",\n            \"diffValue\": \"hello world\",\n            \"value\": \"hello\",\n            \"disabledOn\": \"this.isDisabled\"\n        },\n        {\n            \"type\": \"switch\",\n            \"name\": \"isDisabled\",\n            \"label\": \"是否禁用\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"diff-%E6%95%B0%E6%8D%AE%E5%9F%9F%E4%B8%AD%E7%9A%84%E4%B8%A4%E4%B8%AA%E5%8F%98%E9%87%8F\" href=\"#diff-%E6%95%B0%E6%8D%AE%E5%9F%9F%E4%B8%AD%E7%9A%84%E4%B8%A4%E4%B8%AA%E5%8F%98%E9%87%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>diff 数据域中的两个变量</h2><p>如下例，左侧编辑器中的值，通过<code>&quot;diffValue&quot;: &quot;${value1}&quot;</code>获取，右侧编辑器的值，通过设置<code>&quot;name&quot;: &quot;value2&quot;</code>，自动映射数据域中<code>value2</code>的值</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"data\": {\n        \"value1\": \"hello world\",\n        \"value2\": \"hello wrold\"\n    },\n    \"body\": [\n        {\n            \"type\": \"diff-editor\",\n            \"name\": \"value2\",\n            \"label\": \"Diff-Editor\",\n            \"diffValue\": \"${value1}\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>language</td>\n<td><code>string</code></td>\n<td><code>javascript</code></td>\n<td>编辑器高亮的语言，可选 <a href=\"./editor#%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%AD%E8%A8%80\">支持的语言</a></td>\n</tr>\n<tr>\n<td>diffValue</td>\n<td><a href=\"../tpl\">Tpl</a></td>\n<td></td>\n<td>左侧值</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基本使用",
          "fragment": "%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8",
          "fullPath": "#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8",
          "level": 2
        },
        {
          "label": "禁用编辑器",
          "fragment": "%E7%A6%81%E7%94%A8%E7%BC%96%E8%BE%91%E5%99%A8",
          "fullPath": "#%E7%A6%81%E7%94%A8%E7%BC%96%E8%BE%91%E5%99%A8",
          "level": 2
        },
        {
          "label": "diff 数据域中的两个变量",
          "fragment": "diff-%E6%95%B0%E6%8D%AE%E5%9F%9F%E4%B8%AD%E7%9A%84%E4%B8%A4%E4%B8%AA%E5%8F%98%E9%87%8F",
          "fullPath": "#diff-%E6%95%B0%E6%8D%AE%E5%9F%9F%E4%B8%AD%E7%9A%84%E4%B8%A4%E4%B8%AA%E5%8F%98%E9%87%8F",
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
