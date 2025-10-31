amis.define('docs/zh-CN/components/form/input-month.md', function(require, exports, module, define) {

  module.exports = {
    "title": "InputMonth 月份",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "InputMonth 月份",
    "icon": null,
    "order": 81,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"input-month\",\n            \"name\": \"month\",\n            \"label\": \"时间\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F\" href=\"#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>显示格式</h2><p>选中月份，可以看到默认显示月份的格式是像<code>01</code>这样的格式，如果你想要自定义显示格式，那么可以配置<code>displayFormat</code>。</p>\n<p>例如你想显示<code>01月</code>这样的格式，查找 moment 文档可知配置格式应为 <code>MM月</code>，即：</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"input-month\",\n            \"name\": \"month\",\n            \"label\": \"月份\",\n            \"displayFormat\": \"MM月\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>调整月份，观察显示格式</p>\n<h2><a class=\"anchor\" name=\"%E5%80%BC%E6%A0%BC%E5%BC%8F\" href=\"#%E5%80%BC%E6%A0%BC%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>值格式</h2><p>选中任意月份，可以看到默认表单项的值格式是像<code>1582992000</code>这样的时间戳格式。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"input-month\",\n            \"name\": \"month\",\n            \"label\": \"月份\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>如果你想要其他格式的月份值，那么可以配置<code>valueFormat</code>参数用于调整表单项的值格式。</p>\n<p>例如你调整值为<code>01</code>这样的格式，查找 moment 文档可知配置格式应为 <code>MM</code>，即：</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"input-month\",\n            \"name\": \"month\",\n            \"label\": \"月份\",\n            \"valueFormat\": \"MM\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>调整月份，观察数据域中表单项值的变化</p>\n<h2><a class=\"anchor\" name=\"%E9%BB%98%E8%AE%A4%E5%80%BC\" href=\"#%E9%BB%98%E8%AE%A4%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>默认值</h2><p>可以设置<code>value</code>属性，设置月份选择器的默认值</p>\n<h3><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE\" href=\"#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本配置</h3><p>配置符合当前 <a href=\"./date#%E5%80%BC%E6%A0%BC%E5%BC%8F\">值格式</a> 的默认值。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"input-month\",\n            \"name\": \"month\",\n            \"label\": \"月份\",\n            \"value\": \"1582992000\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E7%9B%B8%E5%AF%B9%E5%80%BC\" href=\"#%E7%9B%B8%E5%AF%B9%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>相对值</h3><p><code>value</code> 还支持类似像<code>&quot;+1hours&quot;</code>这样的相对值，更加便捷的配置默认值</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"debug\": true,\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"input-month\",\n            \"name\": \"month\",\n            \"label\": \"月份\",\n            \"value\": \"+1month\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>上例中配置了<code>&quot;value&quot;: &quot;+1month&quot;</code>，默认就会选中一个月后。</p>\n<p>支持的相对值关键字有：</p>\n<ul>\n<li><code>now</code>: 当前时间</li>\n<li><code>hour</code>或<code>hours</code>: 时</li>\n<li><code>minute</code>或<code>minutes</code>: 分</li>\n<li><code>second</code>或<code>seconds</code>: 秒</li>\n</ul>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n<th>版本</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>value</td>\n<td><code>string</code></td>\n<td></td>\n<td><a href=\"./date#%E9%BB%98%E8%AE%A4%E5%80%BC\">默认值</a></td>\n<td></td>\n</tr>\n<tr>\n<td>valueFormat</td>\n<td><code>string</code></td>\n<td><code>X</code></td>\n<td>月份选择器值格式，更多格式类型请参考 <a href=\"http://momentjs.com/\">moment</a></td>\n<td><code>3.4.0</code></td>\n</tr>\n<tr>\n<td>displayFormat</td>\n<td><code>string</code></td>\n<td><code>YYYY-MM</code></td>\n<td>月份选择器显示格式，即时间戳格式，更多格式类型请参考 <a href=\"http://momentjs.com/\">moment</a></td>\n<td><code>3.4.0</code></td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td><code>&quot;请选择月份&quot;</code></td>\n<td>占位文本</td>\n<td></td>\n</tr>\n<tr>\n<td>clearable</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否可清除</td>\n<td></td>\n</tr>\n<tr>\n<td>popOverContainerSelector</td>\n<td><code>string</code></td>\n<td></td>\n<td>弹层挂载位置选择器，会通过<code>querySelector</code>获取</td>\n<td><code>6.4.0</code></td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E4%BA%8B%E4%BB%B6%E8%A1%A8\" href=\"#%E4%BA%8B%E4%BB%B6%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>事件表</h2><p>当前组件会对外派发以下事件，可以通过<code>onEvent</code>来监听这些事件，并通过<code>actions</code>来配置执行的动作，在<code>actions</code>中可以通过<code>${事件参数名}</code>或<code>${event.data.[事件参数名]}</code>来获取事件产生的数据，详细请查看<a href=\"../../docs/concepts/event-action\">事件动作</a>。</p>\n<blockquote>\n<p><code>[name]</code>表示当前组件绑定的名称，即<code>name</code>属性，如果没有配置<code>name</code>属性，则通过<code>value</code>取值。</p>\n</blockquote>\n<table>\n<thead>\n<tr>\n<th>事件名称</th>\n<th>事件参数</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>change</td>\n<td><code>[name]: string</code> 组件的值</td>\n<td>时间值变化时触发</td>\n</tr>\n<tr>\n<td>focus</td>\n<td><code>[name]: string</code> 组件的值</td>\n<td>输入框获取焦点(非内嵌模式)时触发</td>\n</tr>\n<tr>\n<td>blur</td>\n<td><code>[name]: string</code> 组件的值</td>\n<td>输入框失去焦点(非内嵌模式)时触发</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E4%BD%9C%E8%A1%A8\" href=\"#%E5%8A%A8%E4%BD%9C%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动作表</h2><p>当前组件对外暴露以下特性动作，其他组件可以通过指定<code>actionType: 动作名称</code>、<code>componentId: 该组件id</code>来触发这些动作，动作配置可以通过<code>args: {动作配置项名称: xxx}</code>来配置具体的参数，详细请查看<a href=\"../../docs/concepts/event-action#触发其他组件的动作\">事件动作</a>。</p>\n<table>\n<thead>\n<tr>\n<th>动作名称</th>\n<th>动作配置</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>clear</td>\n<td>-</td>\n<td>清空</td>\n</tr>\n<tr>\n<td>reset</td>\n<td>-</td>\n<td>将值重置为初始值。6.3.0 及以下版本为<code>resetValue</code></td>\n</tr>\n<tr>\n<td>setValue</td>\n<td><code>value: string</code> 更新的时间值</td>\n<td>更新数据，依赖格式<code>valueFormat</code>，例如：&#39;1646064000&#39;</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "显示格式",
          "fragment": "%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F",
          "fullPath": "#%E6%98%BE%E7%A4%BA%E6%A0%BC%E5%BC%8F",
          "level": 2
        },
        {
          "label": "值格式",
          "fragment": "%E5%80%BC%E6%A0%BC%E5%BC%8F",
          "fullPath": "#%E5%80%BC%E6%A0%BC%E5%BC%8F",
          "level": 2
        },
        {
          "label": "默认值",
          "fragment": "%E9%BB%98%E8%AE%A4%E5%80%BC",
          "fullPath": "#%E9%BB%98%E8%AE%A4%E5%80%BC",
          "level": 2,
          "children": [
            {
              "label": "基本配置",
              "fragment": "%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE",
              "fullPath": "#%E5%9F%BA%E6%9C%AC%E9%85%8D%E7%BD%AE",
              "level": 3
            },
            {
              "label": "相对值",
              "fragment": "%E7%9B%B8%E5%AF%B9%E5%80%BC",
              "fullPath": "#%E7%9B%B8%E5%AF%B9%E5%80%BC",
              "level": 3
            }
          ]
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
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
