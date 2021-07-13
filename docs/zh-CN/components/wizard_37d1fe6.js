amis.define('docs/zh-CN/components/wizard.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Wizard 向导",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Wizard 向导",
    "icon": null,
    "order": 73,
    "html": "<div class=\"markdown-body\"><p>表单向导，能够配置多个步骤引导用户一步一步完成表单提交。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" href=\"#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本使用</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"wizard\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm?waitSeconds=2\",\n    \"mode\": \"vertical\",\n    \"steps\": [\n        {\n            \"title\": \"第一步\",\n            \"body\": [\n                {\n                    \"name\": \"website\",\n                    \"label\": \"网址\",\n                    \"type\": \"input-url\",\n                    \"required\": true\n                },\n                {\n                    \"name\": \"email\",\n                    \"label\": \"邮箱\",\n                    \"type\": \"input-email\",\n                    \"required\": true\n                }\n            ]\n        },\n        {\n            \"title\": \"Step 2\",\n            \"body\": [\n                {\n                    \"name\": \"email2\",\n                    \"label\": \"邮箱\",\n                    \"type\": \"input-email\",\n                    \"required\": true\n                }\n            ]\n        },\n        {\n            \"title\": \"Step 3\",\n            \"body\": [\n                \"这是最后一步了\"\n            ]\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;wizard&quot;</code></td>\n<td>指定为 <code>Wizard</code> 组件</td>\n</tr>\n<tr>\n<td>mode</td>\n<td><code>string</code></td>\n<td><code>&quot;horizontal&quot;</code></td>\n<td>展示模式，选择：<code>horizontal</code> 或者 <code>vertical</code></td>\n</tr>\n<tr>\n<td>api</td>\n<td><a href=\"../../docs/types/api\">API</a></td>\n<td></td>\n<td>最后一步保存的接口。</td>\n</tr>\n<tr>\n<td>initApi</td>\n<td><a href=\"../../docs/types/api\">API</a></td>\n<td></td>\n<td>初始化数据接口</td>\n</tr>\n<tr>\n<td>initFetch</td>\n<td><a href=\"../../docs/types/api\">API</a></td>\n<td></td>\n<td>初始是否拉取数据。</td>\n</tr>\n<tr>\n<td>initFetchOn</td>\n<td><a href=\"../../docs/concepts/expression\">表达式</a></td>\n<td></td>\n<td>初始是否拉取数据，通过表达式来配置</td>\n</tr>\n<tr>\n<td>actionPrevLabel</td>\n<td><code>string</code></td>\n<td><code>上一步</code></td>\n<td>上一步按钮文本</td>\n</tr>\n<tr>\n<td>actionNextLabel</td>\n<td><code>string</code></td>\n<td><code>下一步</code></td>\n<td>下一步按钮文本</td>\n</tr>\n<tr>\n<td>actionNextSaveLabel</td>\n<td><code>string</code></td>\n<td><code>保存并下一步</code></td>\n<td>保存并下一步按钮文本</td>\n</tr>\n<tr>\n<td>actionFinishLabel</td>\n<td><code>string</code></td>\n<td><code>完成</code></td>\n<td>完成按钮文本</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>actionClassName</td>\n<td><code>string</code></td>\n<td><code>btn-sm btn-default</code></td>\n<td>按钮 CSS 类名</td>\n</tr>\n<tr>\n<td>reload</td>\n<td><code>string</code></td>\n<td></td>\n<td>操作完后刷新目标对象。请填写目标组件设置的 name 值，如果填写为 <code>window</code> 则让当前页面整体刷新。</td>\n</tr>\n<tr>\n<td>redirect</td>\n<td><a href=\"../../docs/concepts/template\">模板</a></td>\n<td><code>3000</code></td>\n<td>操作完后跳转。</td>\n</tr>\n<tr>\n<td>target</td>\n<td><code>string</code></td>\n<td><code>false</code></td>\n<td>可以把数据提交给别的组件而不是自己保存。请填写目标组件设置的 name 值，如果填写为 <code>window</code> 则把数据同步到地址栏上，同时依赖这些数据的组件会自动重新刷新。</td>\n</tr>\n<tr>\n<td>steps</td>\n<td>Array&lt;<a href=\"#step\">step</a>&gt;</td>\n<td></td>\n<td>数组，配置步骤信息</td>\n</tr>\n<tr>\n<td>startStep</td>\n<td><code>string</code></td>\n<td><code>1</code></td>\n<td>起始默认值，从第几步开始。可支持模版，但是只有在组件创建时渲染模版并设置当前步数，在之后组件被刷新时，当前 step 不会根据 startStep 改变</td>\n</tr>\n</tbody></table>\n<h3><a class=\"anchor\" name=\"step\" href=\"#step\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>step</h3><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>title</td>\n<td><code>string</code></td>\n<td></td>\n<td>步骤标题</td>\n</tr>\n<tr>\n<td>mode</td>\n<td><code>string</code></td>\n<td></td>\n<td>展示默认，跟 <a href=\"/amis./Form/Form\">Form</a> 中的模式一样，选择： <code>normal</code>、<code>horizontal</code>或者<code>inline</code>。</td>\n</tr>\n<tr>\n<td>horizontal</td>\n<td><code>Object</code></td>\n<td></td>\n<td>当为水平模式时，用来控制左右占比</td>\n</tr>\n<tr>\n<td>horizontal.label</td>\n<td><code>number</code></td>\n<td></td>\n<td>左边 label 的宽度占比</td>\n</tr>\n<tr>\n<td>horizontal.right</td>\n<td><code>number</code></td>\n<td></td>\n<td>右边控制器的宽度占比。</td>\n</tr>\n<tr>\n<td>horizontal.offset</td>\n<td><code>number</code></td>\n<td></td>\n<td>当没有设置 label 时，右边控制器的偏移量</td>\n</tr>\n<tr>\n<td>api</td>\n<td><a href=\"../../docs/types/api\">API</a></td>\n<td></td>\n<td>当前步骤保存接口，可以不配置。</td>\n</tr>\n<tr>\n<td>initApi</td>\n<td><a href=\"../../docs/types/api\">API</a></td>\n<td></td>\n<td>当前步骤数据初始化接口。</td>\n</tr>\n<tr>\n<td>initFetch</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>当前步骤数据初始化接口是否初始拉取。</td>\n</tr>\n<tr>\n<td>initFetchOn</td>\n<td><a href=\"../../docs/concepts/expression\">表达式</a></td>\n<td></td>\n<td>当前步骤数据初始化接口是否初始拉取，用表达式来决定。</td>\n</tr>\n<tr>\n<td>body</td>\n<td>Array&lt;<a href=\"./form/formItem\">FormItem</a>&gt;</td>\n<td></td>\n<td>当前步骤的表单项集合，请参考 <a href=\"./form/formItem\">FormItem</a>。</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "属性表",
          "fragment": "%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "fullPath": "#%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "level": 2,
          "children": [
            {
              "label": "step",
              "fragment": "step",
              "fullPath": "#step",
              "level": 3
            }
          ]
        }
      ],
      "level": 0
    }
  };

});
