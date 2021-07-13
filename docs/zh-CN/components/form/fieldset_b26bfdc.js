amis.define('docs/zh-CN/components/form/fieldset.md', function(require, exports, module, define) {

  module.exports = {
    "title": "FieldSet 表单项集合",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "FieldSet",
    "icon": null,
    "order": 20,
    "html": "<div class=\"markdown-body\"><p>FieldSet 是用于分组展示表单项的一种容器型组件，可以折叠。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><p>可以通过配置标题<code>title</code>和表单项数组<code>body</code>，实现多个表单项分组展示</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"body\": [\n    {\n      \"type\": \"fieldSet\",\n      \"title\": \"基本配置\",\n      \"body\": [\n        {\n          \"name\": \"text1\",\n          \"type\": \"input-text\",\n          \"label\": \"文本1\"\n        },\n\n        {\n          \"name\": \"text2\",\n          \"type\": \"input-text\",\n          \"label\": \"文本2\"\n        }\n      ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%95%E7%A4%BA%E6%A8%A1%E5%BC%8F\" href=\"#%E5%B1%95%E7%A4%BA%E6%A8%A1%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>展示模式</h2><p>可以通过设置<code>mode</code>调整展示模式，用法同 <a href=\"./index#%E8%A1%A8%E5%8D%95%E5%B1%95%E7%A4%BA\">Form 展示模式</a></p>\n<p>下面<code>group</code>我们配置了<code>&quot;mode&quot;: &quot;horizontal&quot;</code>，观察显示情况</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [\n    {\n        \"type\": \"input-text\",\n        \"name\": \"text\",\n        \"label\": \"文本\"\n    },\n    {\n        \"type\": \"divider\"\n    },\n    {\n      \"type\": \"fieldSet\",\n      \"title\": \"基本配置\",\n      \"mode\": \"horizontal\",\n      \"body\": [\n        {\n          \"name\": \"text1\",\n          \"type\": \"input-text\",\n          \"label\": \"文本1\"\n        },\n\n        {\n          \"name\": \"text2\",\n          \"type\": \"input-text\",\n          \"label\": \"文本2\"\n        }\n      ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%8F%AF%E6%8A%98%E5%8F%A0\" href=\"#%E5%8F%AF%E6%8A%98%E5%8F%A0\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>可折叠</h2><p>配置<code>&quot;collapsable&quot;: true</code>可以实现点击标题折叠显隐表单项。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"body\": [\n    {\n      \"type\": \"fieldSet\",\n      \"title\": \"基本配置\",\n      \"collapsable\": true,\n      \"body\": [\n        {\n          \"name\": \"text1\",\n          \"type\": \"input-text\",\n          \"label\": \"文本1\"\n        },\n\n        {\n          \"name\": \"text2\",\n          \"type\": \"input-text\",\n          \"label\": \"文本2\"\n        }\n      ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E9%BB%98%E8%AE%A4%E6%98%AF%E5%90%A6%E6%8A%98%E5%8F%A0\" href=\"#%E9%BB%98%E8%AE%A4%E6%98%AF%E5%90%A6%E6%8A%98%E5%8F%A0\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>默认是否折叠</h3><p>默认是展开的，如果想默认折叠，那么配置<code>&quot;collapsed&quot;: true</code>默认折叠。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"body\": [\n    {\n      \"type\": \"fieldSet\",\n      \"title\": \"基本配置\",\n      \"collapsable\": true,\n      \"collapsed\": true,\n      \"body\": [\n        {\n          \"name\": \"text1\",\n          \"type\": \"input-text\",\n          \"label\": \"文本1\"\n        },\n\n        {\n          \"name\": \"text2\",\n          \"type\": \"input-text\",\n          \"label\": \"文本2\"\n        }\n      ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%A0%87%E9%A2%98%E6%94%BE%E5%BA%95%E9%83%A8\" href=\"#%E6%A0%87%E9%A2%98%E6%94%BE%E5%BA%95%E9%83%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>标题放底部</h2><p>fieldSet 的另一种标题展现样式，不同的是展开的时候收起文本是在下方的，如果组件比较多的时候更容易收起。</p>\n<p>设置 <code>&quot;titlePosition&quot;: &quot;bottom&quot;</code>。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"body\": [\n    {\n      \"type\": \"fieldSet\",\n      \"title\": \"展开更多设置\",\n      \"collapseTitle\": \"收起设置\",\n      \"titlePosition\": \"bottom\",\n      \"collapsable\": true,\n      \"collapsed\": true,\n      \"body\": [\n        {\n          \"name\": \"text1\",\n          \"type\": \"input-text\",\n          \"label\": \"文本1\"\n        },\n\n        {\n          \"name\": \"text2\",\n          \"type\": \"input-text\",\n          \"label\": \"文本2\"\n        }\n      ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>CSS 类名</td>\n</tr>\n<tr>\n<td>headingClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>标题 CSS 类名</td>\n</tr>\n<tr>\n<td>bodyClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>内容区域 CSS 类名</td>\n</tr>\n<tr>\n<td>title</td>\n<td><a href=\"../../../docs/types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>标题</td>\n</tr>\n<tr>\n<td>body</td>\n<td>Array&lt;<a href=\"./formitem\">表单项</a>&gt;</td>\n<td></td>\n<td>表单项集合</td>\n</tr>\n<tr>\n<td>mode</td>\n<td><code>string</code></td>\n<td></td>\n<td>展示默认，同 <a href=\"./index#%E8%A1%A8%E5%8D%95%E5%B1%95%E7%A4%BA\">Form</a> 中的模式</td>\n</tr>\n<tr>\n<td>collapsable</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否可折叠</td>\n</tr>\n<tr>\n<td>collapsed</td>\n<td><code>booelan</code></td>\n<td><code>false</code></td>\n<td>默认是否折叠</td>\n</tr>\n<tr>\n<td>collapseTitle</td>\n<td><a href=\"../../../docs/types/schemanode\">SchemaNode</a></td>\n<td><code>收起</code></td>\n<td>收起的标题</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "展示模式",
          "fragment": "%E5%B1%95%E7%A4%BA%E6%A8%A1%E5%BC%8F",
          "fullPath": "#%E5%B1%95%E7%A4%BA%E6%A8%A1%E5%BC%8F",
          "level": 2
        },
        {
          "label": "可折叠",
          "fragment": "%E5%8F%AF%E6%8A%98%E5%8F%A0",
          "fullPath": "#%E5%8F%AF%E6%8A%98%E5%8F%A0",
          "level": 2,
          "children": [
            {
              "label": "默认是否折叠",
              "fragment": "%E9%BB%98%E8%AE%A4%E6%98%AF%E5%90%A6%E6%8A%98%E5%8F%A0",
              "fullPath": "#%E9%BB%98%E8%AE%A4%E6%98%AF%E5%90%A6%E6%8A%98%E5%8F%A0",
              "level": 3
            }
          ]
        },
        {
          "label": "标题放底部",
          "fragment": "%E6%A0%87%E9%A2%98%E6%94%BE%E5%BA%95%E9%83%A8",
          "fullPath": "#%E6%A0%87%E9%A2%98%E6%94%BE%E5%BA%95%E9%83%A8",
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
