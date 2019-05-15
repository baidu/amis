define('docs/renderers/Field.md', function(require, exports, module) {

  module.exports = {
    "html": "<h2><a class=\"anchor\" name=\"field\" href=\"#field\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Field</h2><p>主要用在 <a href=\"#/docs/renderers/Table\">Table</a> 的列配置 Column、<a href=\"#/docs/renderers/List\">List</a> 的内容、<a href=\"#/docs/renderers/Card\">Card</a> 卡片的内容和表单的<a href=\"#/docs/renderers/Static#static-xxx\">Static-XXX</a> 中。它主要用来展示数据。</p>\n<div class=\"amis-preview\" style=\"height: 650px\"><script type=\"text/schema\" height=\"650\" scope=\"body\">{\n  \"type\": \"Action.md\",\n  \"api\": \"https://houtai.baidu.com/api/mock2/Action.md/list\",\n  \"affixHeader\": false,\n  \"syncLocation\": false,\n  \"columns\": [\n    {\n      \"name\": \"id\",\n      \"label\": \"ID\",\n      \"type\": \"text\"\n    },\n    {\n      \"name\": \"text\",\n      \"label\": \"文本\",\n      \"type\": \"text\"\n    },\n    {\n      \"type\": \"image\",\n      \"label\": \"图片\",\n      \"name\": \"image\",\n      \"popOver\": {\n        \"title\": \"查看大图\",\n        \"body\": \"<div class=\\\"w-xxl\\\"><img class=\\\"w-full\\\" src=\\\"${image}\\\"/></div>\"\n      }\n    },\n    {\n      \"name\": \"date\",\n      \"type\": \"date\",\n      \"label\": \"日期\"\n    },\n    {\n      \"name\": \"progress\",\n      \"label\": \"进度\",\n      \"type\": \"progress\"\n    },\n    {\n      \"name\": \"boolean\",\n      \"label\": \"状态\",\n      \"type\": \"status\"\n    },\n    {\n      \"name\": \"boolean\",\n      \"label\": \"开关\",\n      \"type\": \"switch\"\n    },\n    {\n      \"name\": \"type\",\n      \"label\": \"映射\",\n      \"type\": \"mapping\",\n      \"map\": {\n        \"1\": \"<span class='label label-info'>漂亮</span>\",\n        \"2\": \"<span class='label label-success'>开心</span>\",\n        \"3\": \"<span class='label label-danger'>惊吓</span>\",\n        \"4\": \"<span class='label label-warning'>紧张</span>\",\n        \"*\": \"其他：${type}\"\n      }\n    },\n    {\n      \"name\": \"list\",\n      \"type\": \"list\",\n      \"label\": \"List\",\n      \"placeholder\": \"-\",\n      \"listItem\": {\n        \"title\": \"${title}\",\n        \"subTitle\": \"${description}\"\n      }\n    }\n  ]\n}\n</script></div>\n<h3><a class=\"anchor\" name=\"field-%E9%80%9A%E7%94%A8%E9%85%8D%E7%BD%AE\" href=\"#field-%E9%80%9A%E7%94%A8%E9%85%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Field 通用配置</h3><ul>\n<li><code>name</code> 绑定变量名。</li>\n<li><code>placeholder</code> 当没有值时的展示内容。</li>\n<li><code>popOver</code> 配置后在内容区增加一个放大按钮，点击后弹出一个详情弹框。\n<code>boolean</code> 简单的开启或者关闭\n<code>Object</code> 弹出的内容配置。请参考 <a href=\"#/docs/renderers/Dialog\">Dialog</a> 配置说明。</li>\n<li><code>quickEdit</code> 配置后在内容区增加一个编辑按钮，点击后弹出一个编辑框。\n<code>boolean</code> 简单的开启或者关闭\n<code>Object</code> 快速编辑详情，请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a> 配置。\n<code>.mode</code> 模式如果设置为 <code>inline</code> 模式，则直接展示输入框，而不需要点击按钮后展示。\n<code>.saveImmediately</code> 开启后，直接保存，而不是等全部操作完后批量保存。</li>\n<li><code>copyable</code> 配置后会在内容区增加一个复制按钮，点击后把内容复制到剪切板。\ntodo</li>\n</ul>\n<h3><a class=\"anchor\" name=\"tpl-field-\" href=\"#tpl-field-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Tpl(Field)</h3><p>请参考<a href=\"#/docs/renderers/Tpl\">tpl</a></p>\n<h3><a class=\"anchor\" name=\"plain-field-\" href=\"#plain-field-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Plain(Field)</h3><p>请参考<a href=\"#/docs/renderers/Plain\">Plain</a></p>\n<h3><a class=\"anchor\" name=\"json-field-\" href=\"#json-field-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Json(Field)</h3><p>todo</p>\n<h3><a class=\"anchor\" name=\"date-field-\" href=\"#date-field-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Date(Field)</h3><p>用来显示日期。</p>\n<ul>\n<li><code>type</code> 请设置为 <code>date</code>。</li>\n<li><code>format</code> 默认为 <code>YYYY-MM-DD</code>，时间格式，请参考 moment 中的格式用法。</li>\n<li><code>valueFormat</code> 默认为 <code>X</code>，时间格式，请参考 moment 中的格式用法。</li>\n</ul>\n<h3><a class=\"anchor\" name=\"mapping-field-\" href=\"#mapping-field-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Mapping(Field)</h3><p>用来对值做映射显示。</p>\n<ul>\n<li><code>type</code> 请设置为 <code>date</code>。</li>\n<li><p><code>map</code> 映射表, 比如</p>\n<pre><code class=\"lang-json\">{\n    <span class=\"hljs-attr\">\"type\"</span>: <span class=\"hljs-string\">\"mapping\"</span>,\n    <span class=\"hljs-attr\">\"name\"</span>: <span class=\"hljs-string\">\"flag\"</span>,\n    <span class=\"hljs-attr\">\"map\"</span>: {\n        <span class=\"hljs-attr\">\"1\"</span>: <span class=\"hljs-string\">\"&lt;span class='label label-default'&gt;One&lt;/span&gt;\"</span>,\n        <span class=\"hljs-attr\">\"*\"</span>: <span class=\"hljs-string\">\"其他 ${flag}\"</span>\n    }\n}\n</code></pre>\n<p>当值为 1 时，显示 One, 当值为其他时会命中 <code>*</code> 所以显示 <code>其他 flag的值</code>。</p>\n</li>\n</ul>\n<h3><a class=\"anchor\" name=\"image-field-\" href=\"#image-field-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Image(Field)</h3><p>用来展示图片。</p>\n<ul>\n<li><code>type</code> 请设置为 <code>image</code>。</li>\n<li><code>description</code> 图片描述。</li>\n<li><code>defaultImage</code> 默认图片地址。</li>\n<li><code>className</code> CSS 类名。</li>\n<li><code>src</code> 图片地址，支持变量。如果想动态显示，请勿配置。</li>\n</ul>\n<h3><a class=\"anchor\" name=\"progress-field-\" href=\"#progress-field-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Progress(Field)</h3><p>用来展示进度条。</p>\n<ul>\n<li><code>type</code> 请设置为 <code>progress</code>。</li>\n<li><code>showLabel</code> 是否显示文字</li>\n<li><p><code>map</code> 等级配置\n默认</p>\n<pre><code class=\"lang-json\">[<span class=\"hljs-string\">\"bg-danger\"</span>, <span class=\"hljs-string\">\"bg-warning\"</span>, <span class=\"hljs-string\">\"bg-info\"</span>, <span class=\"hljs-string\">\"bg-success\"</span>, <span class=\"hljs-string\">\"bg-success\"</span>]\n</code></pre>\n<p>展示的样式取决于当前值在什么区间段，比如以上的配置，把 100 切成了 5 分，前 1/5, 即 25 以前显示 <code>bg-danger</code> 背景。50 ~ 75 显示 <code>bg-info</code> 背景。</p>\n</li>\n<li><p><code>progressClassName</code> 进度外层 CSS 类名 默认为: <code>progress-xs progress-striped active m-t-xs m-b-none</code></p>\n</li>\n<li><code>progressBarClassName</code> 进度条 CSS 类名。</li>\n</ul>\n<h3><a class=\"anchor\" name=\"status-field-\" href=\"#status-field-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Status(Field)</h3><p>用来显示状态，用图表展示。</p>\n<ul>\n<li><code>type</code> 请设置为 <code>status</code>。</li>\n<li><p><code>map</code> 图标配置</p>\n<p>默认:</p>\n<pre><code class=\"lang-json\">[<span class=\"hljs-string\">\"fa fa-times text-danger\"</span>, <span class=\"hljs-string\">\"fa fa-check text-success\"</span>]\n</code></pre>\n<p>即如果值 <code>value % map.length</code> 等于 0 则显示第一个图标。<code>value % map.length</code> 等于 1 则显示第二个图标，无限类推。所以说 map 其实不只是支持 2 个，可以任意个。</p>\n<p>这个例子，当值为 0 、2、4 ... 时显示红 <code>X</code>， 当值为 1, 3, 5 ... \b 绿 <code>√</code></p>\n</li>\n</ul>\n<h3><a class=\"anchor\" name=\"switch-field-\" href=\"#switch-field-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Switch(Field)</h3><p>用来占一个开关。</p>\n<ul>\n<li><code>type</code> 请设置为 <code>switch</code>。</li>\n<li><code>option</code> 选项说明</li>\n<li><code>trueValue</code> 勾选后的值</li>\n<li><code>falseValue</code> 未勾选的值</li>\n</ul>\n<h2><a class=\"anchor\" name=\"tabs\" href=\"#tabs\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Tabs</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;tabs&quot;</code></td>\n<td>指定为 Tabs 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>tabsClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>Tabs Dom 的类名</td>\n</tr>\n<tr>\n<td>tabs</td>\n<td><code>Array</code></td>\n<td></td>\n<td>tabs 内容</td>\n</tr>\n<tr>\n<td>tabs[x].title</td>\n<td><code>string</code></td>\n<td></td>\n<td>Tab 标题</td>\n</tr>\n<tr>\n<td>tabs[x].icon</td>\n<td><code>icon</code></td>\n<td></td>\n<td>Tab 的图标</td>\n</tr>\n<tr>\n<td>tabs[x].tab</td>\n<td><a href=\"#/docs/renderers/Types#Container\">Container</a></td>\n<td></td>\n<td>内容区</td>\n</tr>\n<tr>\n<td>tabs[x].hash</td>\n<td><code>string</code></td>\n<td></td>\n<td>设置以后将跟 url 的 hash 对应</td>\n</tr>\n<tr>\n<td>tabs[x].reload</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>设置以后内容每次都会重新渲染，对于 Action.md 的重新拉取很有用</td>\n</tr>\n<tr>\n<td>tabs[x].className</td>\n<td><code>string</code></td>\n<td><code>&quot;bg-white b-l b-r b-b wrapper-md&quot;</code></td>\n<td>Tab 区域样式</td>\n</tr>\n</tbody>\n</table>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"tabs\",\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"tab\": \"Content 1\"\n        },\n\n        {\n            \"title\": \"Tab 2\",\n            \"tab\": \"Content 2\"\n        }\n    ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Field",
          "fragment": "field",
          "fullPath": "#field",
          "level": 2,
          "children": [
            {
              "label": "Field 通用配置",
              "fragment": "field-%E9%80%9A%E7%94%A8%E9%85%8D%E7%BD%AE",
              "fullPath": "#field-%E9%80%9A%E7%94%A8%E9%85%8D%E7%BD%AE",
              "level": 3
            },
            {
              "label": "Tpl(Field)",
              "fragment": "tpl-field-",
              "fullPath": "#tpl-field-",
              "level": 3
            },
            {
              "label": "Plain(Field)",
              "fragment": "plain-field-",
              "fullPath": "#plain-field-",
              "level": 3
            },
            {
              "label": "Json(Field)",
              "fragment": "json-field-",
              "fullPath": "#json-field-",
              "level": 3
            },
            {
              "label": "Date(Field)",
              "fragment": "date-field-",
              "fullPath": "#date-field-",
              "level": 3
            },
            {
              "label": "Mapping(Field)",
              "fragment": "mapping-field-",
              "fullPath": "#mapping-field-",
              "level": 3
            },
            {
              "label": "Image(Field)",
              "fragment": "image-field-",
              "fullPath": "#image-field-",
              "level": 3
            },
            {
              "label": "Progress(Field)",
              "fragment": "progress-field-",
              "fullPath": "#progress-field-",
              "level": 3
            },
            {
              "label": "Status(Field)",
              "fragment": "status-field-",
              "fullPath": "#status-field-",
              "level": 3
            },
            {
              "label": "Switch(Field)",
              "fragment": "switch-field-",
              "fullPath": "#switch-field-",
              "level": 3
            }
          ]
        },
        {
          "label": "Tabs",
          "fragment": "tabs",
          "fullPath": "#tabs",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
