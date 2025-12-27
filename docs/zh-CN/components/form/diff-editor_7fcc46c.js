amis.define('docs/zh-CN/components/form/diff-editor.md', function(require, exports, module, define) {

  module.exports = {
    "title": "DiffEditor 对比编辑器",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "DiffEditor 对比编辑器",
    "icon": null,
    "order": 17,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" href=\"#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本使用</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"diff-editor\",\n            \"name\": \"diff\",\n            \"label\": \"Diff-Editor\",\n            \"diffValue\": \"hello world\",\n            \"value\": \"hello\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E7%A6%81%E7%94%A8%E7%BC%96%E8%BE%91%E5%99%A8\" href=\"#%E7%A6%81%E7%94%A8%E7%BC%96%E8%BE%91%E5%99%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>禁用编辑器</h2><p>左侧编辑器始终不可编辑，右侧编辑器可以通过设置<code>disabled</code>或<code>disabledOn</code>，控制是否禁用</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"diff-editor\",\n            \"name\": \"diff\",\n            \"label\": \"Diff-Editor\",\n            \"diffValue\": \"hello world\",\n            \"value\": \"hello\",\n            \"disabledOn\": \"this.isDisabled\"\n        },\n        {\n            \"type\": \"switch\",\n            \"name\": \"isDisabled\",\n            \"label\": \"是否禁用\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"diff-%E6%95%B0%E6%8D%AE%E5%9F%9F%E4%B8%AD%E7%9A%84%E4%B8%A4%E4%B8%AA%E5%8F%98%E9%87%8F\" href=\"#diff-%E6%95%B0%E6%8D%AE%E5%9F%9F%E4%B8%AD%E7%9A%84%E4%B8%A4%E4%B8%AA%E5%8F%98%E9%87%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>diff 数据域中的两个变量</h2><p>如下例，左侧编辑器中的值，通过<code>&quot;diffValue&quot;: &quot;${value1}&quot;</code>获取，右侧编辑器的值，通过设置<code>&quot;name&quot;: &quot;value2&quot;</code>，自动映射数据域中<code>value2</code>的值</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"data\": {\n        \"value1\": \"hello world\",\n        \"value2\": \"hello wrold\"\n    },\n    \"body\": [\n        {\n            \"type\": \"diff-editor\",\n            \"name\": \"value2\",\n            \"label\": \"Diff-Editor\",\n            \"diffValue\": \"${value1}\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>language</td>\n<td><code>string</code></td>\n<td><code>javascript</code></td>\n<td>编辑器高亮的语言，可选 <a href=\"./editor#%E6%94%AF%E6%8C%81%E7%9A%84%E8%AF%AD%E8%A8%80\">支持的语言</a></td>\n</tr>\n<tr>\n<td>diffValue</td>\n<td><a href=\"../tpl\">Tpl</a></td>\n<td></td>\n<td>左侧值</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E4%BA%8B%E4%BB%B6%E8%A1%A8\" href=\"#%E4%BA%8B%E4%BB%B6%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>事件表</h2><p>当前组件会对外派发以下事件，可以通过<code>onEvent</code>来监听这些事件，并通过<code>actions</code>来配置执行的动作，在<code>actions</code>中可以通过<code>${事件参数名}</code>或<code>${event.data.[事件参数名]}</code>来获取事件产生的数据，详细请查看<a href=\"../../docs/concepts/event-action\">事件动作</a>。</p>\n<blockquote>\n<p><code>[name]</code>表示当前组件绑定的名称，即<code>name</code>属性，如果没有配置<code>name</code>属性，则通过<code>value</code>取值。</p>\n</blockquote>\n<table>\n<thead>\n<tr>\n<th>事件名称</th>\n<th>事件参数</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>change</td>\n<td><code>[name]: string</code> 组件的值</td>\n<td>代码变化时触发</td>\n</tr>\n<tr>\n<td>focus</td>\n<td><code>[name]: string</code> 组件的值</td>\n<td>右侧输入框获取焦点时触发</td>\n</tr>\n<tr>\n<td>blur</td>\n<td><code>[name]: string</code> 组件的值</td>\n<td>右侧输入框失去焦点时触发</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E4%BD%9C%E8%A1%A8\" href=\"#%E5%8A%A8%E4%BD%9C%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动作表</h2><p>当前组件对外暴露以下特性动作，其他组件可以通过指定<code>actionType: 动作名称</code>、<code>componentId: 该组件id</code>来触发这些动作，动作配置可以通过<code>args: {动作配置项名称: xxx}</code>来配置具体的参数，详细请查看<a href=\"../../docs/concepts/event-action#触发其他组件的动作\">事件动作</a>。</p>\n<table>\n<thead>\n<tr>\n<th>动作名称</th>\n<th>动作配置</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>clear</td>\n<td>-</td>\n<td>清空</td>\n</tr>\n<tr>\n<td>reset</td>\n<td>-</td>\n<td>将值重置为初始值。6.3.0 及以下版本为<code>resetValue</code></td>\n</tr>\n<tr>\n<td>focus</td>\n<td>-</td>\n<td>获取焦点，焦点落在右侧编辑面板</td>\n</tr>\n<tr>\n<td>setValue</td>\n<td><code>value: string</code> 更新的右侧编辑面板中的值</td>\n<td>更新数据</td>\n</tr>\n</tbody></table>\n<h3><a class=\"anchor\" name=\"clear\" href=\"#clear\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>clear</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"body\": [\n        {\n            \"type\": \"diff-editor\",\n            \"name\": \"diff\",\n            \"id\": \"clear_text\",\n            \"label\": \"Diff-Editor\",\n            \"diffValue\": \"hello world\",\n            \"value\": \"hello\"\n        },\n        {\n            \"type\": \"button\",\n            \"label\": \"清空\",\n            \"onEvent\": {\n                \"click\": {\n                    \"actions\": [\n                        {\n                            \"actionType\": \"clear\",\n                            \"componentId\": \"clear_text\"\n                        }\n                    ]\n                }\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"reset\" href=\"#reset\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>reset</h3><p>如果配置了<code>resetValue</code>，则重置时使用<code>resetValue</code>的值，否则使用初始值。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"body\": [\n        {\n            \"id\": \"reset_text\",\n            \"type\": \"diff-editor\",\n            \"name\": \"diff\",\n            \"label\": \"Diff-Editor\",\n            \"diffValue\": \"hello world\",\n            \"value\": \"hello\"\n        },\n        {\n            \"type\": \"button\",\n            \"label\": \"重置\",\n            \"onEvent\": {\n                \"click\": {\n                    \"actions\": [\n                        {\n                            \"actionType\": \"reset\",\n                            \"componentId\": \"reset_text\"\n                        }\n                    ]\n                }\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"focus\" href=\"#focus\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>focus</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"body\": [\n        {\n            \"id\": \"focus_text\",\n            \"type\": \"diff-editor\",\n            \"name\": \"diff\",\n            \"label\": \"Diff-Editor\",\n            \"diffValue\": \"hello world\",\n            \"value\": \"hello\"\n        },\n        {\n            \"type\": \"button\",\n            \"label\": \"聚焦\",\n            \"onEvent\": {\n                \"click\": {\n                    \"actions\": [\n                        {\n                            \"actionType\": \"focus\",\n                            \"componentId\": \"focus_text\"\n                        }\n                    ]\n                }\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"setvalue\" href=\"#setvalue\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>setValue</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"body\": [\n        {\n            \"id\": \"setvalue_text\",\n            \"type\": \"diff-editor\",\n            \"name\": \"diff\",\n            \"label\": \"Diff-Editor\",\n            \"diffValue\": \"hello world\",\n            \"value\": \"hello\"\n        },\n        {\n            \"type\": \"button\",\n            \"label\": \"赋值\",\n            \"onEvent\": {\n                \"click\": {\n                    \"actions\": [\n                        {\n                            \"actionType\": \"setValue\",\n                            \"componentId\": \"setvalue_text\",\n                            \"args\": {\n                                \"value\": \"amis go go go!\"\n                            }\n                        }\n                    ]\n                }\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n</div>",
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
        },
        {
          "label": "事件表",
          "fragment": "%E4%BA%8B%E4%BB%B6%E8%A1%A8",
          "fullPath": "#%E4%BA%8B%E4%BB%B6%E8%A1%A8",
          "level": 2
        },
        {
          "label": "动作表",
          "fragment": "%E5%8A%A8%E4%BD%9C%E8%A1%A8",
          "fullPath": "#%E5%8A%A8%E4%BD%9C%E8%A1%A8",
          "level": 2,
          "children": [
            {
              "label": "clear",
              "fragment": "clear",
              "fullPath": "#clear",
              "level": 3
            },
            {
              "label": "reset",
              "fragment": "reset",
              "fullPath": "#reset",
              "level": 3
            },
            {
              "label": "focus",
              "fragment": "focus",
              "fullPath": "#focus",
              "level": 3
            },
            {
              "label": "setValue",
              "fragment": "setvalue",
              "fullPath": "#setvalue",
              "level": 3
            }
          ]
        }
      ],
      "level": 0
    }
  };

});
