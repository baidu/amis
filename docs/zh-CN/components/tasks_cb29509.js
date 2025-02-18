amis.define('docs/zh-CN/components/tasks.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Tasks 任务操作集合",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Tasks",
    "icon": null,
    "order": 69,
    "html": "<div class=\"markdown-body\"><p>任务操作集合，类似于 orp 上线。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tasks\",\n    \"name\": \"tasks\",\n    \"items\": [\n        {\n            \"label\": \"hive 任务\",\n            \"key\": \"hive\",\n            \"status\": 4,\n            \"remark\": \"查看详情<a target=\\\"_blank\\\" href=\\\"http://www.baidu.com\\\">日志</a>。\"\n        },\n        {\n            \"label\": \"小流量\",\n            \"key\": \"partial\",\n            \"status\": 4\n        },\n         {\n             \"label\": \"全量\",\n             \"key\": \"full\",\n             \"status\": 4\n         }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;tasks&quot;</code></td>\n<td>指定为 Tasks 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>tableClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>table Dom 的类名</td>\n</tr>\n<tr>\n<td>items</td>\n<td><code>Array</code></td>\n<td></td>\n<td>任务列表</td>\n</tr>\n<tr>\n<td>items[x].label</td>\n<td><code>string</code></td>\n<td></td>\n<td>任务名称</td>\n</tr>\n<tr>\n<td>items[x].key</td>\n<td><code>string</code></td>\n<td></td>\n<td>任务键值，请唯一区分</td>\n</tr>\n<tr>\n<td>items[x].remark</td>\n<td><code>string</code></td>\n<td></td>\n<td>当前任务状态，支持 html</td>\n</tr>\n<tr>\n<td>items[x].status</td>\n<td><code>string</code></td>\n<td></td>\n<td>任务状态： 0: 初始状态，不可操作。1: 就绪，可操作状态。2: 进行中，还没有结束。3：有错误，不可重试。4: 已正常结束。5：有错误，且可以重试。</td>\n</tr>\n<tr>\n<td>checkApi</td>\n<td><a href=\"../../docs/types/api\">API</a></td>\n<td></td>\n<td>返回任务列表，返回的数据请参考 items。</td>\n</tr>\n<tr>\n<td>submitApi</td>\n<td><a href=\"../../docs/types/api\">API</a></td>\n<td></td>\n<td>提交任务使用的 API</td>\n</tr>\n<tr>\n<td>reSubmitApi</td>\n<td><a href=\"../../docs/types/api\">API</a></td>\n<td></td>\n<td>如果任务失败，且可以重试，提交的时候会使用此 API</td>\n</tr>\n<tr>\n<td>interval</td>\n<td><code>number</code></td>\n<td><code>3000</code></td>\n<td>当有任务进行中，会每隔一段时间再次检测，而时间间隔就是通过此项配置，默认 3s。</td>\n</tr>\n<tr>\n<td>taskNameLabel</td>\n<td><code>string</code></td>\n<td>任务名称</td>\n<td>任务名称列说明</td>\n</tr>\n<tr>\n<td>operationLabel</td>\n<td><code>string</code></td>\n<td>操作</td>\n<td>操作列说明</td>\n</tr>\n<tr>\n<td>statusLabel</td>\n<td><code>string</code></td>\n<td>状态</td>\n<td>状态列说明</td>\n</tr>\n<tr>\n<td>remarkLabel</td>\n<td><code>string</code></td>\n<td>备注</td>\n<td>备注列说明</td>\n</tr>\n<tr>\n<td>btnText</td>\n<td><code>string</code></td>\n<td>上线</td>\n<td>操作按钮文字</td>\n</tr>\n<tr>\n<td>retryBtnText</td>\n<td><code>string</code></td>\n<td>重试</td>\n<td>重试操作按钮文字</td>\n</tr>\n<tr>\n<td>btnClassName</td>\n<td><code>string</code></td>\n<td><code>btn-sm btn-default</code></td>\n<td>配置容器按钮 className</td>\n</tr>\n<tr>\n<td>retryBtnClassName</td>\n<td><code>string</code></td>\n<td><code>btn-sm btn-danger</code></td>\n<td>配置容器重试按钮 className</td>\n</tr>\n<tr>\n<td>statusLabelMap</td>\n<td><code>array</code></td>\n<td><code>[&quot;label-warning&quot;, &quot;label-info&quot;, &quot;label-success&quot;, &quot;label-danger&quot;, &quot;label-default&quot;, &quot;label-danger&quot;]</code></td>\n<td>状态显示对应的类名配置</td>\n</tr>\n<tr>\n<td>statusTextMap</td>\n<td><code>array</code></td>\n<td><code>[&quot;未开始&quot;, &quot;就绪&quot;, &quot;进行中&quot;, &quot;出错&quot;, &quot;已完成&quot;, &quot;出错&quot;]</code></td>\n<td>状态显示对应的文字显示配置</td>\n</tr>\n</tbody></table>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n{\n    \"type\": \"tasks\",\n    \"name\": \"tasks\",\n    \"checkApi\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/task\"\n},\n\n\"为了演示，目前获取的状态都是随机出现的。\"]\n</script></div><div class=\"markdown-body\">\n</div>",
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
