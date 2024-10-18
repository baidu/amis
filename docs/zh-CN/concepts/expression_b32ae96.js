amis.define('docs/zh-CN/concepts/expression.md', function(require, exports, module, define) {

  module.exports = {
    "title": "表达式",
    "description": null,
    "type": 0,
    "group": "💡 概念",
    "menuName": "表达式",
    "icon": null,
    "order": 13,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF\" href=\"#%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>使用场景</h2><p>amis 中有很多场景会用到表达式。</p>\n<ul>\n<li><p>模板中变量取值。 如：<code>my name is ${xxx}</code></p>\n</li>\n<li><p>api 地址参数取值 如 <code>http://mydomain.com/api/xxx?id=${id}</code></p>\n</li>\n<li><p>api 发送&amp;接收数据映射</p>\n<pre><code>{\n  &quot;type&quot;: &quot;crud&quot;,\n  &quot;api&quot;: {\n    method: &quot;post&quot;\n    url: &quot;http://mydomain.com/api/xxx&quot;,\n    data: {\n      skip: &quot;${(page - 1) * perPage}&quot;,\n      take: &quot;${perPage}&quot;\n    }\n  },\n  ...\n}\n</code></pre>\n</li>\n<li><p>组件显示与隐藏条件</p>\n<pre><code>{\n  &quot;name&quot;: &quot;xxxText&quot;,\n  &quot;type&quot;: &quot;input-text&quot;,\n  &quot;visibleOn&quot;: &quot;${ xxxFeature.on }&quot;\n}\n</code></pre>\n</li>\n<li><p>表单默认值</p>\n<pre><code>{\n  &quot;name&quot;: &quot;xxxText&quot;,\n  &quot;type&quot;: &quot;input-text&quot;,\n  &quot;value&quot;: &quot;${ TODAY() }&quot;\n}\n</code></pre>\n</li>\n<li><p>等等</p>\n</li>\n</ul>\n<p>amis 中表达式有两种语法：</p>\n<ul>\n<li>一种是纯 js 表达式，如 <code>data.xxx === 1</code>。</li>\n<li>另一种是用 <code>${</code> 和 <code>}</code> 包裹的表达式。如：<code>${ xxx === 1}</code>。</li>\n</ul>\n<pre><code class=\"language-json\"><span class=\"token punctuation\">{</span>\n  <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"tpl\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"tpl\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"当前作用域中变量 show 是 1 的时候才可以看得到我哦~\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"visibleOn\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"${show === 1}\"</span>\n<span class=\"token punctuation\">}</span>\n</code></pre>\n<p>第一种是早期的版本，偷懒直接用的 <a href=\"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript\">Javascript</a>，灵活性虽高，但是安全性欠佳。建议使用新版本规则，新规则跟 tpl 模板取值规则完全一样，不用来回切换语法。</p>\n<h2><a class=\"anchor\" name=\"%E8%A1%A8%E8%BE%BE%E5%BC%8F%E8%AF%AD%E6%B3%95\" href=\"#%E8%A1%A8%E8%BE%BE%E5%BC%8F%E8%AF%AD%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>表达式语法</h2><p>表达式主要由三部分组成：开始字符、表达式内容和结束字符。其中开始字符固定是 <code>${</code> 结束字符固定是 <code>}</code>，中间内容才是表达式正文。这里说的语法主要还是表达式正文的语法。</p>\n<p>规则主要包含：</p>\n<ul>\n<li><p>变量名： <code>xxx变量</code>、<code>xxx变量.xxx属性</code>、<code>xxx变量[xxx属性]</code></p>\n</li>\n<li><p>布尔值： <code>true</code> 或者 <code>false</code></p>\n</li>\n<li><p>null：<code>null</code></p>\n</li>\n<li><p>undefined: <code>undefined</code></p>\n</li>\n<li><p>数字： <code>123</code> 或者 <code>123.23</code></p>\n</li>\n<li><p>字符串： <code>&quot;string&quot;</code> 或者 <code>&#39;string&#39;</code></p>\n</li>\n<li><p>字符模板</p>\n<pre><code>`my name is ${name}`\n</code></pre>\n</li>\n<li><p>数组： <code>[1, 2, 3]</code></p>\n</li>\n<li><p>对象： <code>{a: 1, b: 2}</code></p>\n</li>\n<li><p>组合使用如： <code>{a: 1: b: [1, 2, 3], [key]: yyy变量}</code></p>\n</li>\n<li><p>三元表达式： <code>xx变量 == 1 ? 2 : 3</code></p>\n</li>\n<li><p>二元表达式： <code>xx变量 &amp;&amp; yy 变量</code> 、 <code>xx变量 || yy 变量</code>、 <code>xx变量 == 123</code></p>\n<ul>\n<li><code>+</code> 相加</li>\n<li><code>-</code> 相减</li>\n<li><code>*</code> 乘</li>\n<li><code>/</code> 除</li>\n<li><code>**</code> pow 运算</li>\n<li><code>||</code> 或者</li>\n<li><code>&amp;&amp;</code> 并且</li>\n<li><code>|</code> 或运算</li>\n<li><code>^</code> 异或运算</li>\n<li><code>&amp;</code> 与运算</li>\n<li><code>==</code> 等于比较</li>\n<li><code>!=</code> 不等于</li>\n<li><code>===</code> 恒等于</li>\n<li><code>!==</code> 不恒等于</li>\n<li><code>&lt;</code> 小于</li>\n<li><code>&lt;=</code> 小于或等于</li>\n<li><code>&gt;</code> 大于</li>\n<li><code>&gt;=</code> 大于或等于</li>\n<li><code>&lt;&lt;</code> 左移</li>\n<li><code>&gt;&gt;</code> 右移</li>\n<li><code>&gt;&gt;&gt;</code> 带符号位的右移运算符</li>\n</ul>\n</li>\n<li><p>一元表达式： <code>!xx变量</code>、<code>~xx变量</code></p>\n</li>\n</ul>\n<ul>\n<li><code>+</code> 一元加法</li>\n<li><code>-</code> 一元减法</li>\n<li><code>~</code> 否运算符，加 1 取反</li>\n<li><code>!</code> 取反</li>\n</ul>\n<ul>\n<li>函数调用：<code>SUM(1, 2, 3)</code></li>\n<li>箭头函数：<code>() =&gt; abc</code> 注意这个箭头函数只支持单表达式，不支持多条语句。主要配置其他函数使用如：<code>ARRAY_MAP(arr, item =&gt; item.abc)</code></li>\n<li>括号包裹，修改运算优先级：<code>(10 - 2) * 3</code></li>\n</ul>\n<p>示例：</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"type\": \"page\",\n  \"data\": {\n    \"a\": 1,\n    \"key\": \"y\",\n    \"obj\": {\n      \"x\": 2,\n      \"y\": 3\n    },\n    \"arr\": [1, 2, 3]\n  },\n  \"body\": [\n    \"a is ${a} <br />\",\n    \"a + 1 is ${a + 1} <br />\",\n    \"obj.x is ${obj.x} <br />\",\n    \"obj['x'] is ${obj['x']} <br />\",\n    \"obj[key] is ${obj[key]} <br />\",\n    \"arr[0] is ${arr[0]} <br />\",\n    \"arr[a] is ${arr[a]} <br />\",\n    \"arr[a + 1] is ${arr[a + 1]} <br />\"\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<p><em>特殊字符变量名</em></p>\n<blockquote>\n<p>1.6.1 及以上版本</p>\n</blockquote>\n<p>默认变量名不支持特殊字符比如 <code>${ xxx.yyy }</code> 意思取 xxx 变量的 yyy 属性，如果变量名就是 <code>xxx.yyy</code> 怎么获取？这个时候需要用到转义语法，如：<code>${ xxx\\.yyy }</code></p>\n<h3><a class=\"anchor\" name=\"%E5%85%AC%E5%BC%8F\" href=\"#%E5%85%AC%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>公式</h3><p>除了支持简单表达式外，还集成了很多公式(函数)如 <code>${ AVG(1, 2, 3, 4)}</code>：</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"type\": \"page\",\n  \"data\": {\n    \"a\": \"\",\n    \"语文成绩\": 81\n  },\n  \"body\": [\n    \"1, 2, 3, 4 的平均数位 ${ AVG(1, 2, 3, 4)}\",\n\n    \"当前成绩：${IF(语文成绩 > 80, '优秀', '继续努力')}\"\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E7%A4%BA%E4%BE%8B\" href=\"#%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E7%A4%BA%E4%BE%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>函数调用示例</h2><p>函数支持嵌套，参数支持常量及变量</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"type\": \"page\",\n  \"body\": [\n    {\n      \"type\": \"form\",\n      \"wrapWithPanel\": false,\n      \"data\": {\n        \"val\": 3.5\n      },\n      \"body\": [\n        {\n          \"type\": \"static\",\n          \"label\": \"IF(true, 2, 3)\",\n          \"tpl\": \"${IF(true, 2, 3)}\"\n        },\n        {\n          \"type\": \"static\",\n          \"label\": \"MAX(1, -1, 2, 3, 5, -9)\",\n          \"tpl\": \"${MAX(1, -1, 2, 3, 5, -9)}\"\n        },\n        {\n          \"type\": \"static\",\n          \"label\": \"ROUND(3.5)\",\n          \"tpl\": \"${ROUND(3.5)}\"\n        },\n        {\n          \"type\": \"static\",\n          \"label\": \"ROUND(val)\",\n          \"tpl\": \"${ROUND(val)}\"\n        },\n        {\n          \"type\": \"static\",\n          \"label\": \"AVG(4, 6, 10, 10, 10)\",\n          \"tpl\": \"${AVG(4, 6, 10, 10, 10)}\"\n        },\n        {\n          \"type\": \"static\",\n          \"label\": \"UPPERMONEY(7682.01)\",\n          \"tpl\": \"${UPPERMONEY(7682.01)}\"\n        },\n        {\n          \"type\": \"static\",\n          \"label\": \"TIMESTAMP(DATE(2021, 11, 21, 0, 0, 0), 'x')\",\n          \"tpl\": \"${TIMESTAMP(DATE(2021, 11, 21, 0, 0, 0), 'x')}\"\n        },\n        {\n          \"type\": \"static\",\n          \"label\": \"DATETOSTR(NOW(), 'YYYY-MM-DD')\",\n          \"tpl\": \"${DATETOSTR(NOW(), 'YYYY-MM-DD')}\"\n        }\n      ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<p>下面是目前所支持函数的使用手册</p>\n<h2><a class=\"anchor\" name=\"%E9%80%BB%E8%BE%91%E5%87%BD%E6%95%B0\" href=\"#%E9%80%BB%E8%BE%91%E5%87%BD%E6%95%B0\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>逻辑函数</h2><h3><a class=\"anchor\" name=\"if\" href=\"#if\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>IF</h3><p>用法：<code>IF(condition, consequent, alternate)</code></p>\n<ul>\n<li><code>condition:expression</code> 条件表达式。例如：语文成绩&gt;80</li>\n<li><code>consequent:any</code> 条件判断通过的返回结果</li>\n<li><code>alternate:any</code> 条件判断不通过的返回结果</li>\n</ul>\n<p>返回：<code>any</code> 根据条件返回不同的结果</p>\n<p>如果满足条件condition，则返回consequent，否则返回alternate，支持多层嵌套IF函数。</p>\n<p>等价于直接用JS表达式如：condition ? consequent : alternate。</p>\n<h3><a class=\"anchor\" name=\"and\" href=\"#and\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>AND</h3><p>用法：<code>AND(expression1, expression2, ...expressionN)</code></p>\n<ul>\n<li><code>conditions:...expression</code> 条件表达式，多个用逗号隔开。例如：语文成绩&gt;80, 数学成绩&gt;80</li>\n</ul>\n<p>返回：<code>boolean</code> </p>\n<p>条件全部符合，返回 true，否则返回 false。</p>\n<p>示例：AND(语文成绩&gt;80, 数学成绩&gt;80)，</p>\n<p>语文成绩和数学成绩都大于 80，则返回 true，否则返回 false，</p>\n<p>等价于直接用JS表达式如：语文成绩&gt;80 &amp;&amp; 数学成绩&gt;80。</p>\n<h3><a class=\"anchor\" name=\"or\" href=\"#or\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>OR</h3><p>用法：<code>OR(expression1, expression2, ...expressionN)</code></p>\n<ul>\n<li><code>conditions:...expression</code> 条件表达式，多个用逗号隔开。例如：语文成绩&gt;80, 数学成绩&gt;80</li>\n</ul>\n<p>返回：<code>boolean</code> </p>\n<p>条件任意一个满足条件，返回 true，否则返回 false。</p>\n<p>示例：OR(语文成绩&gt;80, 数学成绩&gt;80)，</p>\n<p>语文成绩和数学成绩任意一个大于 80，则返回 true，否则返回 false，</p>\n<p>等价于直接用JS表达式如：语文成绩&gt;80 || 数学成绩&gt;80。</p>\n<h3><a class=\"anchor\" name=\"xor\" href=\"#xor\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>XOR</h3><p>用法：<code>XOR(condition1, condition2, ...expressionN)</code></p>\n<ul>\n<li><code>condition:...expression</code> 条件表达式，多个用逗号隔开。例如：语文成绩&gt;80, 数学成绩&gt;80</li>\n</ul>\n<p>返回：<code>boolean</code> </p>\n<p>异或处理，多个表达式组中存在奇数个真时认为真。</p>\n<p>示例：XOR(语文成绩 &gt; 80, 数学成绩 &gt; 80, 英语成绩 &gt; 80)</p>\n<p>三门成绩中有一门或者三门大于 80，则返回 true，否则返回 false。</p>\n<h3><a class=\"anchor\" name=\"ifs\" href=\"#ifs\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>IFS</h3><p>用法：<code>IFS(condition1, result1, condition2, result2,...conditionN, resultN)</code></p>\n<ul>\n<li><code>condition:...expression</code> 条件表达式</li>\n<li><code>result:...any</code> 返回值</li>\n</ul>\n<p>返回：<code>any</code> 第一个满足条件的结果，没有命中的返回 false。</p>\n<p>判断函数集合，相当于多个 else if 合并成一个。</p>\n<p>示例：IFS(语文成绩 &gt; 80, &quot;优秀&quot;, 语文成绩 &gt; 60, &quot;良&quot;, &quot;继续努力&quot;)，</p>\n<p>如果语文成绩大于 80，则返回优秀，否则判断大于 60 分，则返回良，否则返回继续努力。</p>\n<h2><a class=\"anchor\" name=\"%E6%95%B0%E5%AD%A6%E5%87%BD%E6%95%B0\" href=\"#%E6%95%B0%E5%AD%A6%E5%87%BD%E6%95%B0\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>数学函数</h2><h3><a class=\"anchor\" name=\"abs\" href=\"#abs\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ABS</h3><p>用法：<code>ABS(num)</code></p>\n<ul>\n<li><code>num:number</code> 数值</li>\n</ul>\n<p>返回：<code>number</code> 传入数值的绝对值</p>\n<p>返回传入数字的绝对值。</p>\n<h3><a class=\"anchor\" name=\"max\" href=\"#max\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>MAX</h3><p>用法：<code>MAX(num1, num2, ...numN)</code></p>\n<ul>\n<li><code>num:...number</code> 数值</li>\n</ul>\n<p>返回：<code>number</code> 所有传入值中最大的那个</p>\n<p>获取最大值，如果只有一个参数且是数组，则计算这个数组内的值。</p>\n<h3><a class=\"anchor\" name=\"min\" href=\"#min\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>MIN</h3><p>用法：<code>MIN(num1, num2, ...numN)</code></p>\n<ul>\n<li><code>num:...number</code> 数值</li>\n</ul>\n<p>返回：<code>number</code> 所有传入值中最小的那个</p>\n<p>获取最小值，如果只有一个参数且是数组，则计算这个数组内的值。</p>\n<h3><a class=\"anchor\" name=\"sum\" href=\"#sum\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>SUM</h3><p>用法：<code>SUM(num1, num2, ...numN)</code></p>\n<ul>\n<li><code>num:...number</code> 数值</li>\n</ul>\n<p>返回：<code>number</code> 所有传入数值的总和</p>\n<p>求和，如果只有一个参数且是数组，则计算这个数组内的值。</p>\n<h3><a class=\"anchor\" name=\"int\" href=\"#int\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>INT</h3><p>用法：<code>INT(num)</code></p>\n<ul>\n<li><code>num:number</code> 数值</li>\n</ul>\n<p>返回：<code>number</code> 数值对应的整形</p>\n<p>将数值向下取整为最接近的整数。</p>\n<h3><a class=\"anchor\" name=\"mod\" href=\"#mod\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>MOD</h3><p>用法：<code>MOD(num, divisor)</code></p>\n<ul>\n<li><code>num:number</code> 被除数</li>\n<li><code>divisor:number</code> 除数</li>\n</ul>\n<p>返回：<code>number</code> 两数相除的余数</p>\n<p>返回两数相除的余数，参数 number 是被除数，divisor 是除数。</p>\n<h3><a class=\"anchor\" name=\"pi\" href=\"#pi\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>PI</h3><p>用法：<code>PI()</code></p>\n<p>圆周率 3.1415...。</p>\n<h3><a class=\"anchor\" name=\"round\" href=\"#round\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ROUND</h3><p>用法：<code>ROUND(num[, numDigits = 2])</code></p>\n<ul>\n<li><code>num:number</code> 要处理的数字</li>\n<li><code>numDigits:number</code> 小数位数，默认为2</li>\n</ul>\n<p>返回：<code>number</code> 传入数值四舍五入后的结果</p>\n<p>将数字四舍五入到指定的位数，可以设置小数位。</p>\n<h3><a class=\"anchor\" name=\"floor\" href=\"#floor\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>FLOOR</h3><p>用法：<code>FLOOR(num[, numDigits=2])</code></p>\n<ul>\n<li><code>num:number</code> 要处理的数字</li>\n<li><code>numDigits:number</code> 小数位数，默认为2</li>\n</ul>\n<p>返回：<code>number</code> 传入数值向下取整后的结果</p>\n<p>将数字向下取整到指定的位数，可以设置小数位。</p>\n<h3><a class=\"anchor\" name=\"ceil\" href=\"#ceil\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>CEIL</h3><p>用法：<code>CEIL(num[, numDigits=2])</code></p>\n<ul>\n<li><code>num:number</code> 要处理的数字</li>\n<li><code>numDigits:number</code> 小数位数，默认为2</li>\n</ul>\n<p>返回：<code>number</code> 传入数值向上取整后的结果</p>\n<p>将数字向上取整到指定的位数，可以设置小数位。</p>\n<h3><a class=\"anchor\" name=\"sqrt\" href=\"#sqrt\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>SQRT</h3><p>用法：<code>SQRT(num)</code></p>\n<ul>\n<li><code>num:number</code> 要处理的数字</li>\n</ul>\n<p>返回：<code>number</code> 开平方的结果</p>\n<p>开平方，参数 number 为非负数</p>\n<h3><a class=\"anchor\" name=\"avg\" href=\"#avg\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>AVG</h3><p>用法：<code>AVG(num1, num2, ...numN)</code></p>\n<ul>\n<li><code>num:...number</code> 要处理的数字</li>\n</ul>\n<p>返回：<code>number</code> 所有数值的平均值</p>\n<p>返回所有参数的平均值，如果只有一个参数且是数组，则计算这个数组内的值。</p>\n<h3><a class=\"anchor\" name=\"devsq\" href=\"#devsq\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>DEVSQ</h3><p>用法：<code>DEVSQ(num1, num2, ...numN)</code></p>\n<ul>\n<li><code>num:...number</code> 要处理的数字</li>\n</ul>\n<p>返回：<code>number</code> 所有数值的平均值</p>\n<p>返回数据点与数据均值点之差（数据偏差）的平方和，如果只有一个参数且是数组，则计算这个数组内的值。</p>\n<h3><a class=\"anchor\" name=\"avedev\" href=\"#avedev\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>AVEDEV</h3><p>用法：<code>AVEDEV(num1, num2, ...numN)</code></p>\n<ul>\n<li><code>num:...number</code> 要处理的数字</li>\n</ul>\n<p>返回：<code>number</code> 所有数值的平均值</p>\n<p>数据点到其算术平均值的绝对偏差的平均值。</p>\n<h3><a class=\"anchor\" name=\"harmean\" href=\"#harmean\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>HARMEAN</h3><p>用法：<code>HARMEAN(num1, num2, ...numN)</code></p>\n<ul>\n<li><code>num:...number</code> 要处理的数字</li>\n</ul>\n<p>返回：<code>number</code> 所有数值的平均值</p>\n<p>数据点的调和平均值，如果只有一个参数且是数组，则计算这个数组内的值。</p>\n<h3><a class=\"anchor\" name=\"large\" href=\"#large\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>LARGE</h3><p>用法：<code>LARGE(array, k)</code></p>\n<ul>\n<li><code>nums:array</code> 要处理的数字</li>\n<li><code>k:number</code> 第几大</li>\n</ul>\n<p>返回：<code>number</code> 所有数值的平均值</p>\n<p>数据集中第 k 个最大值。</p>\n<h3><a class=\"anchor\" name=\"uppermoney\" href=\"#uppermoney\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>UPPERMONEY</h3><p>用法：<code>UPPERMONEY(num)</code></p>\n<ul>\n<li><code>num:number</code> 要处理的数字</li>\n</ul>\n<p>返回：<code>string</code> 数值中文大写字符</p>\n<p>将数值转为中文大写金额。</p>\n<h3><a class=\"anchor\" name=\"rand\" href=\"#rand\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>RAND</h3><p>用法：<code>RAND()</code></p>\n<p>返回大于等于 0 且小于 1 的均匀分布随机实数。每一次触发计算都会变化。</p>\n<p>示例：<code>RAND()*100</code>，</p>\n<p>返回 0-100 之间的随机数。</p>\n<h3><a class=\"anchor\" name=\"last\" href=\"#last\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>LAST</h3><p>用法：<code>LAST(array)</code></p>\n<ul>\n<li><code>arr:...number</code> 要处理的数组</li>\n</ul>\n<p>返回：<code>any</code> 最后一个值</p>\n<p>取数据最后一个。</p>\n<h3><a class=\"anchor\" name=\"pow\" href=\"#pow\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>POW</h3><p>用法：<code>POW(base, exponent)</code></p>\n<ul>\n<li><code>base:number</code> 基数</li>\n<li><code>exponent:number</code> 指数</li>\n</ul>\n<p>返回：<code>number</code> 基数的指数次幂</p>\n<p>返回基数的指数次幂，参数base为基数，exponent为指数，如果参数值不合法则返回基数本身，计算结果不合法，则返回NaN。</p>\n<h2><a class=\"anchor\" name=\"%E6%96%87%E6%9C%AC%E5%87%BD%E6%95%B0\" href=\"#%E6%96%87%E6%9C%AC%E5%87%BD%E6%95%B0\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>文本函数</h2><h3><a class=\"anchor\" name=\"left\" href=\"#left\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>LEFT</h3><p>用法：<code>LEFT(text, len)</code></p>\n<ul>\n<li><code>text:string</code> 要处理的文本</li>\n<li><code>len:number</code> 要处理的长度</li>\n</ul>\n<p>返回：<code>string</code> 对应字符串</p>\n<p>返回传入文本左侧的指定长度字符串。</p>\n<h3><a class=\"anchor\" name=\"right\" href=\"#right\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>RIGHT</h3><p>用法：<code>RIGHT(text, len)</code></p>\n<ul>\n<li><code>text:string</code> 要处理的文本</li>\n<li><code>len:number</code> 要处理的长度</li>\n</ul>\n<p>返回：<code>string</code> 对应字符串</p>\n<p>返回传入文本右侧的指定长度字符串。</p>\n<h3><a class=\"anchor\" name=\"len\" href=\"#len\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>LEN</h3><p>用法：<code>LEN(text)</code></p>\n<ul>\n<li><code>text:string</code> 要处理的文本</li>\n</ul>\n<p>返回：<code>number</code> 长度</p>\n<p>计算文本的长度。</p>\n<h3><a class=\"anchor\" name=\"length\" href=\"#length\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>LENGTH</h3><p>用法：<code>LENGTH(textArr)</code></p>\n<ul>\n<li><code>textArr:Array&lt;string&gt;</code> 要处理的文本集合</li>\n</ul>\n<p>返回：<code>Array&lt;number&gt;</code> 长度集合</p>\n<p>计算文本集合中所有文本的长度。</p>\n<h3><a class=\"anchor\" name=\"isempty\" href=\"#isempty\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ISEMPTY</h3><p>用法：<code>ISEMPTY(text)</code></p>\n<ul>\n<li><code>text:string</code> 要处理的文本</li>\n</ul>\n<p>返回：<code>boolean</code> 判断结果</p>\n<p>判断文本是否为空。</p>\n<h3><a class=\"anchor\" name=\"concatenate\" href=\"#concatenate\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>CONCATENATE</h3><p>用法：<code>CONCATENATE(text1, text2, ...textN)</code></p>\n<ul>\n<li><code>text:...string</code> 文本集合</li>\n</ul>\n<p>返回：<code>string</code> 连接后的文本</p>\n<p>将多个传入值连接成文本。</p>\n<h3><a class=\"anchor\" name=\"char\" href=\"#char\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>CHAR</h3><p>用法：<code>CHAR(code)</code></p>\n<ul>\n<li><code>code:number</code> 编码值</li>\n</ul>\n<p>返回：<code>string</code> 指定位置的字符</p>\n<p>返回计算机字符集的数字代码所对应的字符。</p>\n<p>示例：<code>CHAR(97)</code> 等价于 &quot;a&quot;。</p>\n<h3><a class=\"anchor\" name=\"lower\" href=\"#lower\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>LOWER</h3><p>用法：<code>LOWER(text)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n</ul>\n<p>返回：<code>string</code> 结果文本</p>\n<p>将传入文本转成小写。</p>\n<h3><a class=\"anchor\" name=\"upper\" href=\"#upper\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>UPPER</h3><p>用法：<code>UPPER(text)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n</ul>\n<p>返回：<code>string</code> 结果文本</p>\n<p>将传入文本转成大写。</p>\n<h3><a class=\"anchor\" name=\"upperfirst\" href=\"#upperfirst\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>UPPERFIRST</h3><p>用法：<code>UPPERFIRST(text)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n</ul>\n<p>返回：<code>string</code> 结果文本</p>\n<p>将传入文本首字母转成大写。</p>\n<h3><a class=\"anchor\" name=\"padstart\" href=\"#padstart\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>PADSTART</h3><p>用法：<code>PADSTART(text)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n<li><code>num:number</code> 目标长度</li>\n<li><code>pad:string</code> 用于补齐的文本</li>\n</ul>\n<p>返回：<code>string</code> 结果文本</p>\n<p>向前补齐文本长度。</p>\n<p>示例 <code>PADSTART(&quot;6&quot;, 2, &quot;0&quot;)</code>，</p>\n<p>返回 <code>06</code>。</p>\n<h3><a class=\"anchor\" name=\"capitalize\" href=\"#capitalize\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>CAPITALIZE</h3><p>用法：<code>CAPITALIZE(text)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n</ul>\n<p>返回：<code>string</code> 结果文本</p>\n<p>将文本转成标题。</p>\n<p>示例 <code>CAPITALIZE(&quot;star&quot;)</code>，</p>\n<p>返回 <code>Star</code>。</p>\n<h3><a class=\"anchor\" name=\"escape\" href=\"#escape\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ESCAPE</h3><p>用法：<code>ESCAPE(text)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n</ul>\n<p>返回：<code>string</code> 结果文本</p>\n<p>对文本进行 HTML 转义。</p>\n<p>示例 <code>ESCAPE(&quot;&lt;star&gt;&amp;&quot;)</code>，</p>\n<p>返回 <code>&amp;lt;start&amp;gt;&amp;amp;</code>。</p>\n<h3><a class=\"anchor\" name=\"truncate\" href=\"#truncate\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>TRUNCATE</h3><p>用法：<code>TRUNCATE(text, 6)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n<li><code>text:number</code> 最长长度</li>\n</ul>\n<p>返回：<code>string</code> 结果文本</p>\n<p>对文本长度进行截断。</p>\n<p>示例 <code>TRUNCATE(&quot;amis.baidu.com&quot;, 6)</code>，</p>\n<p>返回 <code>amis...</code>。</p>\n<h3><a class=\"anchor\" name=\"beforelast\" href=\"#beforelast\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>BEFORELAST</h3><p>用法：<code>BEFORELAST(text, &#39;.&#39;)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n<li><code>delimiter:string</code> 结束文本</li>\n</ul>\n<p>返回：<code>string</code> 判断结果</p>\n<p>取在某个分隔符之前的所有字符串。</p>\n<h3><a class=\"anchor\" name=\"split\" href=\"#split\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>SPLIT</h3><p>用法：<code>SPLIT(text, &#39;,&#39;)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n<li><code>delimiter:string</code> 文本片段</li>\n</ul>\n<p>返回：<code>Array&lt;string&gt;</code> 文本集</p>\n<p>将文本根据指定片段分割成数组。</p>\n<p>示例：<code>SPLIT(&quot;a,b,c&quot;, &quot;,&quot;)</code>，</p>\n<p>返回 <code>[&quot;a&quot;, &quot;b&quot;, &quot;c&quot;]</code>。</p>\n<h3><a class=\"anchor\" name=\"trim\" href=\"#trim\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>TRIM</h3><p>用法：<code>TRIM(text)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n</ul>\n<p>返回：<code>string</code> 处理后的文本</p>\n<p>将文本去除前后空格。</p>\n<h3><a class=\"anchor\" name=\"striptag\" href=\"#striptag\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>STRIPTAG</h3><p>用法：<code>STRIPTAG(text)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n</ul>\n<p>返回：<code>string</code> 处理后的文本</p>\n<p>去除文本中的 HTML 标签。</p>\n<p>示例：<code>STRIPTAG(&quot;&lt;b&gt;amis&lt;/b&gt;&quot;)</code>，</p>\n<p>返回：<code>amis</code>。</p>\n<h3><a class=\"anchor\" name=\"linebreak\" href=\"#linebreak\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>LINEBREAK</h3><p>用法：<code>LINEBREAK(text)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n</ul>\n<p>返回：<code>string</code> 处理后的文本</p>\n<p>将字符串中的换行转成 HTML <code>&lt;br&gt;</code>，用于简单换行的场景。</p>\n<p>示例：<code>LINEBREAK(&quot;\\n&quot;)</code>，</p>\n<p>返回：<code>&lt;br/&gt;</code>。</p>\n<h3><a class=\"anchor\" name=\"startswith\" href=\"#startswith\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>STARTSWITH</h3><p>用法：<code>STARTSWITH(text, &#39;片段&#39;)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n<li><code>startString:string</code> 起始文本</li>\n</ul>\n<p>返回：<code>string</code> 判断结果</p>\n<p>判断字符串(text)是否以特定字符串(startString)开始，是则返回 true，否则返回 false。</p>\n<h3><a class=\"anchor\" name=\"endswith\" href=\"#endswith\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ENDSWITH</h3><p>用法：<code>ENDSWITH(text, &#39;片段&#39;)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n<li><code>endString:string</code> 结束文本</li>\n</ul>\n<p>返回：<code>string</code> 判断结果</p>\n<p>判断字符串(text)是否以特定字符串(endString)结束，是则返回 true，否则返回 false。</p>\n<h3><a class=\"anchor\" name=\"contains\" href=\"#contains\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>CONTAINS</h3><p>用法：<code>CONTAINS(text, searchText)</code></p>\n<ul>\n<li><code>text:string</code> 文本</li>\n<li><code>searchText:string</code> 搜索文本</li>\n</ul>\n<p>返回：<code>string</code> 判断结果</p>\n<p>判断参数 1 中的文本是否包含参数 2 中的文本，是则返回 true，否则返回 false。</p>\n<h3><a class=\"anchor\" name=\"replace\" href=\"#replace\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>REPLACE</h3><p>用法：<code>REPLACE(text, search, replace)</code></p>\n<ul>\n<li><code>text:string</code> 要处理的文本</li>\n<li><code>search:string</code> 要被替换的文本</li>\n<li><code>replace:string</code> 要替换的文本</li>\n</ul>\n<p>返回：<code>string</code> 处理结果</p>\n<p>对文本进行全量替换。</p>\n<h3><a class=\"anchor\" name=\"search\" href=\"#search\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>SEARCH</h3><p>用法：<code>SEARCH(text, search, 0)</code></p>\n<ul>\n<li><code>text:string</code> 要处理的文本</li>\n<li><code>search:string</code> 用来搜索的文本</li>\n<li><code>start:number</code> 起始位置</li>\n</ul>\n<p>返回：<code>number</code> 命中的位置</p>\n<p>对文本进行搜索，返回命中的位置。</p>\n<h3><a class=\"anchor\" name=\"mid\" href=\"#mid\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>MID</h3><p>用法：<code>MID(text, from, len)</code></p>\n<ul>\n<li><code>text:string</code> 要处理的文本</li>\n<li><code>from:number</code> 起始位置</li>\n<li><code>len:number</code> 处理长度</li>\n</ul>\n<p>返回：<code>number</code> 命中的位置</p>\n<p>返回文本字符串中从指定位置开始的特定数目的字符。</p>\n<h3><a class=\"anchor\" name=\"basename\" href=\"#basename\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>BASENAME</h3><p>用法：<code>BASENAME(text)</code></p>\n<ul>\n<li><code>text:string</code> 要处理的文本</li>\n</ul>\n<p>返回：<code>string</code> 文件名</p>\n<p>返回路径中的文件名。</p>\n<p>示例：<code>/home/amis/a.json</code>，</p>\n<p>返回：a.json`。</p>\n<h3><a class=\"anchor\" name=\"uuid\" href=\"#uuid\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>UUID</h3><p>用法：<code>UUID(8)</code></p>\n<ul>\n<li><code>length:number</code> 生成的UUID字符串长度，默认为32位</li>\n</ul>\n<p>返回：<code>string</code> 生成的UUID字符串</p>\n<p>生成UUID字符串</p>\n<h2><a class=\"anchor\" name=\"%E6%97%A5%E6%9C%9F%E5%87%BD%E6%95%B0\" href=\"#%E6%97%A5%E6%9C%9F%E5%87%BD%E6%95%B0\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>日期函数</h2><h3><a class=\"anchor\" name=\"date\" href=\"#date\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>DATE</h3><p>用法：<code>DATE(&#39;2021-12-06 08:20:00&#39;)</code></p>\n<p>创建日期对象，可以通过特定格式的字符串，或者数值。</p>\n<p>需要注意的是，其中月份的数值是从0开始的，\n即如果是12月份，你应该传入数值11。</p>\n<h3><a class=\"anchor\" name=\"timestamp\" href=\"#timestamp\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>TIMESTAMP</h3><p>用法：<code>TIMESTAMP(date[, format = &quot;X&quot;])</code></p>\n<ul>\n<li><code>date:date</code> 日期对象</li>\n<li><code>format:string</code> 时间戳格式，带毫秒传入 &#39;x&#39;。默认为 &#39;X&#39; 不带毫秒的。</li>\n</ul>\n<p>返回：<code>number</code> 时间戳</p>\n<p>返回时间的时间戳。</p>\n<h3><a class=\"anchor\" name=\"today\" href=\"#today\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>TODAY</h3><p>用法：<code>TODAY()</code></p>\n<p>返回今天的日期。</p>\n<h3><a class=\"anchor\" name=\"now\" href=\"#now\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>NOW</h3><p>用法：<code>NOW()</code></p>\n<p>返回现在的日期</p>\n<h3><a class=\"anchor\" name=\"weekday\" href=\"#weekday\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>WEEKDAY</h3><p>用法：<code>WEEKDAY(date)</code></p>\n<ul>\n<li><code>date:any</code> 日期</li>\n<li><code>type:number</code> 星期定义类型，默认为1，1表示0至6代表星期一到星期日，2表示1至7代表星期一到星期日</li>\n</ul>\n<p>返回：<code>number</code> 星期几的数字标识</p>\n<p>获取日期的星期几。</p>\n<p>示例</p>\n<p>WEEKDAY(&#39;2023-02-27&#39;) 得到 0。\nWEEKDAY(&#39;2023-02-27&#39;, 2) 得到 1。</p>\n<h3><a class=\"anchor\" name=\"week\" href=\"#week\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>WEEK</h3><p>用法：<code>WEEK(date)</code></p>\n<ul>\n<li><code>date:any</code> 日期</li>\n<li><code>isISO:boolean</code> 是否ISO星期</li>\n</ul>\n<p>返回：<code>number</code> 星期几的数字标识</p>\n<p>获取年份的星期，即第几周。</p>\n<p>示例</p>\n<p>WEEK(&#39;2023-03-05&#39;) 得到 9。</p>\n<h3><a class=\"anchor\" name=\"datetostr\" href=\"#datetostr\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>DATETOSTR</h3><p>用法：<code>DATETOSTR(date, &#39;YYYY-MM-DD&#39;)</code></p>\n<ul>\n<li><code>date:any</code> 日期对象、日期字符串、时间戳</li>\n<li><code>format:string</code> 日期格式，默认为 &quot;YYYY-MM-DD HH:mm:ss&quot;</li>\n</ul>\n<p>返回：<code>string</code> 日期字符串</p>\n<p>对日期、日期字符串、时间戳进行格式化。</p>\n<p>示例</p>\n<p>DATETOSTR(&#39;12/25/2022&#39;, &#39;YYYY-MM-DD&#39;) 得到 &#39;2022.12.25&#39;，\nDATETOSTR(1676563200, &#39;YYYY.MM.DD&#39;) 得到 &#39;2023.02.17&#39;，\nDATETOSTR(1676563200000, &#39;YYYY.MM.DD hh:mm:ss&#39;) 得到 &#39;2023.02.17 12:00:00&#39;，\nDATETOSTR(DATE(&#39;2021-12-21&#39;), &#39;YYYY.MM.DD hh:mm:ss&#39;) 得到 &#39;2021.12.21 08:00:00&#39;。</p>\n<h3><a class=\"anchor\" name=\"daterangesplit\" href=\"#daterangesplit\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>DATERANGESPLIT</h3><p>用法：<code>DATERANGESPLIT(date, &#39;YYYY-MM-DD&#39;)</code></p>\n<ul>\n<li><code>date:string</code> 日期范围字符串</li>\n<li><code>key:string</code> 取值标识，0或&#39;start&#39;表示获取开始时间，1或&#39;end&#39;表示获取结束时间</li>\n<li><code>format:string</code> 日期格式，可选</li>\n<li><code>delimiter:string</code> 分隔符，可选，默认为&#39;,&#39;</li>\n</ul>\n<p>返回：<code>string</code> 日期字符串</p>\n<p>获取日期范围字符串中的开始时间、结束时间。</p>\n<p>示例：</p>\n<p>DATERANGESPLIT(&#39;1676563200, 1676735999&#39;) 得到 [1676563200, 1676735999]，\nDATERANGESPLIT(&#39;1676563200, 1676735999&#39;, undefined , &#39;YYYY.MM.DD hh:mm:ss&#39;) 得到 [2023.02.17 12:00:00, 2023.02.18 11:59:59]，\nDATERANGESPLIT(&#39;1676563200, 1676735999&#39;, 0 , &#39;YYYY.MM.DD hh:mm:ss&#39;) 得到 &#39;2023.02.17 12:00:00&#39;，\nDATERANGESPLIT(&#39;1676563200, 1676735999&#39;, &#39;start&#39; , &#39;YYYY.MM.DD hh:mm:ss&#39;) 得到 &#39;2023.02.17 12:00:00&#39;，\nDATERANGESPLIT(&#39;1676563200, 1676735999&#39;, 1 , &#39;YYYY.MM.DD hh:mm:ss&#39;) 得到 &#39;2023.02.18 11:59:59&#39;，\nDATERANGESPLIT(&#39;1676563200, 1676735999&#39;, &#39;end&#39; , &#39;YYYY.MM.DD hh:mm:ss&#39;) 得到 &#39;2023.02.18 11:59:59&#39;。</p>\n<h3><a class=\"anchor\" name=\"startof\" href=\"#startof\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>STARTOF</h3><p>用法：<code>STARTOF(date[unit = &quot;day&quot;])</code></p>\n<ul>\n<li><code>date:date</code> 日期对象</li>\n<li><code>unit:string</code> 比如可以传入 &#39;day&#39;、&#39;month&#39;、&#39;year&#39; 或者 <code>week</code> 等等</li>\n<li><code>format:string</code> 日期格式，可选</li>\n</ul>\n<p>返回：<code>date</code> 新的日期对象</p>\n<p>返回日期的指定范围的开端。</p>\n<h3><a class=\"anchor\" name=\"endof\" href=\"#endof\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ENDOF</h3><p>用法：<code>ENDOF(date[unit = &quot;day&quot;])</code></p>\n<ul>\n<li><code>date:date</code> 日期对象</li>\n<li><code>unit:string</code> 比如可以传入 &#39;day&#39;、&#39;month&#39;、&#39;year&#39; 或者 <code>week</code> 等等</li>\n<li><code>format:string</code> 日期格式，可选</li>\n</ul>\n<p>返回：<code>date</code> 新的日期对象</p>\n<p>返回日期的指定范围的末尾。</p>\n<h3><a class=\"anchor\" name=\"year\" href=\"#year\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>YEAR</h3><p>用法：<code>YEAR(date)</code></p>\n<ul>\n<li><code>date:date</code> 日期对象</li>\n</ul>\n<p>返回：<code>number</code> 数值</p>\n<p>返回日期的年份。</p>\n<h3><a class=\"anchor\" name=\"month\" href=\"#month\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>MONTH</h3><p>用法：<code>MONTH(date)</code></p>\n<ul>\n<li><code>date:date</code> 日期对象</li>\n</ul>\n<p>返回：<code>number</code> 数值</p>\n<p>返回日期的月份，这里就是自然月份。</p>\n<h3><a class=\"anchor\" name=\"day\" href=\"#day\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>DAY</h3><p>用法：<code>DAY(date)</code></p>\n<ul>\n<li><code>date:date</code> 日期对象</li>\n</ul>\n<p>返回：<code>number</code> 数值</p>\n<p>返回日期的天。</p>\n<h3><a class=\"anchor\" name=\"hour\" href=\"#hour\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>HOUR</h3><p>用法：<code>HOUR(date)</code></p>\n<ul>\n<li><code>date:date</code> 日期对象</li>\n</ul>\n<p>返回：<code>number</code> 数值</p>\n<p>返回日期的小时。</p>\n<h3><a class=\"anchor\" name=\"minute\" href=\"#minute\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>MINUTE</h3><p>用法：<code>MINUTE(date)</code></p>\n<ul>\n<li><code>date:date</code> 日期对象</li>\n</ul>\n<p>返回：<code>number</code> 数值</p>\n<p>返回日期的分。</p>\n<h3><a class=\"anchor\" name=\"second\" href=\"#second\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>SECOND</h3><p>用法：<code>SECOND(date)</code></p>\n<ul>\n<li><code>date:date</code> 日期对象</li>\n</ul>\n<p>返回：<code>number</code> 数值</p>\n<p>返回日期的秒。</p>\n<h3><a class=\"anchor\" name=\"years\" href=\"#years\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>YEARS</h3><p>用法：<code>YEARS(endDate, startDate)</code></p>\n<ul>\n<li><code>endDate:date</code> 日期对象</li>\n<li><code>startDate:date</code> 日期对象</li>\n</ul>\n<p>返回：<code>number</code> 数值</p>\n<p>返回两个日期相差多少年。</p>\n<h3><a class=\"anchor\" name=\"minutes\" href=\"#minutes\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>MINUTES</h3><p>用法：<code>MINUTES(endDate, startDate)</code></p>\n<ul>\n<li><code>endDate:date</code> 日期对象</li>\n<li><code>startDate:date</code> 日期对象</li>\n</ul>\n<p>返回：<code>number</code> 数值</p>\n<p>返回两个日期相差多少分钟。</p>\n<h3><a class=\"anchor\" name=\"days\" href=\"#days\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>DAYS</h3><p>用法：<code>DAYS(endDate, startDate)</code></p>\n<ul>\n<li><code>endDate:date</code> 日期对象</li>\n<li><code>startDate:date</code> 日期对象</li>\n</ul>\n<p>返回：<code>number</code> 数值</p>\n<p>返回两个日期相差多少天。</p>\n<h3><a class=\"anchor\" name=\"hours\" href=\"#hours\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>HOURS</h3><p>用法：<code>HOURS(endDate, startDate)</code></p>\n<ul>\n<li><code>endDate:date</code> 日期对象</li>\n<li><code>startDate:date</code> 日期对象</li>\n</ul>\n<p>返回：<code>number</code> 数值</p>\n<p>返回两个日期相差多少小时。</p>\n<h3><a class=\"anchor\" name=\"datemodify\" href=\"#datemodify\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>DATEMODIFY</h3><p>用法：<code>DATEMODIFY(date, 2, &#39;days&#39;)</code></p>\n<ul>\n<li><code>date:date</code> 日期对象</li>\n<li><code>num:number</code> 数值</li>\n<li><code>unit:string</code> 单位：支持年、月、天等等</li>\n</ul>\n<p>返回：<code>date</code> 日期对象</p>\n<p>修改日期，对日期进行加减天、月份、年等操作。</p>\n<p>示例：</p>\n<p>DATEMODIFY(A, -2, &#39;month&#39;)，</p>\n<p>对日期 A 进行往前减2月的操作。</p>\n<h3><a class=\"anchor\" name=\"strtodate\" href=\"#strtodate\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>STRTODATE</h3><p>用法：<code>STRTODATE(value[, format=&quot;&quot;])</code></p>\n<ul>\n<li><code>value:string</code> 日期字符</li>\n<li><code>format:string</code> 日期格式</li>\n</ul>\n<p>返回：<code>date</code> 日期对象</p>\n<p>将字符日期转成日期对象，可以指定日期格式。</p>\n<p>示例：STRTODATE(&#39;2021/12/6&#39;, &#39;YYYY/MM/DD&#39;)</p>\n<h3><a class=\"anchor\" name=\"isbefore\" href=\"#isbefore\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ISBEFORE</h3><p>用法：<code>ISBEFORE(a, b)</code></p>\n<ul>\n<li><code>a:date</code> 第一个日期</li>\n<li><code>b:date</code> 第二个日期</li>\n<li><code>unit:string</code> 单位，默认是 &#39;day&#39;， 即之比较到天</li>\n</ul>\n<p>返回：<code>boolean</code> 判断结果</p>\n<p>判断两个日期，是否第一个日期在第二个日期的前面，是则返回 true，否则返回 false。</p>\n<h3><a class=\"anchor\" name=\"isafter\" href=\"#isafter\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ISAFTER</h3><p>用法：<code>ISAFTER(a, b)</code></p>\n<ul>\n<li><code>a:date</code> 第一个日期</li>\n<li><code>b:date</code> 第二个日期</li>\n<li><code>unit:string</code> 单位，默认是 &#39;day&#39;， 即之比较到天</li>\n</ul>\n<p>返回：<code>boolean</code> 判断结果</p>\n<p>判断两个日期，是否第一个日期在第二个日期的后面，是则返回 true，否则返回 false。</p>\n<h3><a class=\"anchor\" name=\"betweenrange\" href=\"#betweenrange\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>BETWEENRANGE</h3><p>用法：<code>BETWEENRANGE(date, [start, end])</code></p>\n<ul>\n<li><code>date:any</code> 第一个日期</li>\n<li><code>daterange:Array&lt;any&gt;</code> 日期范围</li>\n<li><code>unit:string</code> 单位，默认是 &#39;day&#39;， 即之比较到天</li>\n<li><code>inclusivity:string</code> 包容性规则，默认为&#39;[]&#39;。[ 表示包含、( 表示排除，如果使用包容性参数，则必须传入两个指示符，如&#39;()&#39;表示左右范围都排除</li>\n</ul>\n<p>返回：<code>boolean</code> 判断结果</p>\n<p>判断日期是否在指定范围内，是则返回 true，否则返回 false。</p>\n<p>示例：BETWEENRANGE(&#39;2021/12/6&#39;, [&#39;2021/12/5&#39;,&#39;2021/12/7&#39;])。</p>\n<h3><a class=\"anchor\" name=\"issameorbefore\" href=\"#issameorbefore\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ISSAMEORBEFORE</h3><p>用法：<code>ISSAMEORBEFORE(a, b)</code></p>\n<ul>\n<li><code>a:date</code> 第一个日期</li>\n<li><code>b:date</code> 第二个日期</li>\n<li><code>unit:string</code> 单位，默认是 &#39;day&#39;， 即之比较到天</li>\n</ul>\n<p>返回：<code>boolean</code> 判断结果</p>\n<p>判断两个日期，是否第一个日期在第二个日期的前面或者相等，是则返回 true，否则返回 false。</p>\n<h3><a class=\"anchor\" name=\"issameorafter\" href=\"#issameorafter\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ISSAMEORAFTER</h3><p>用法：<code>ISSAMEORAFTER(a, b)</code></p>\n<ul>\n<li><code>a:date</code> 第一个日期</li>\n<li><code>b:date</code> 第二个日期</li>\n<li><code>unit:string</code> 单位，默认是 &#39;day&#39;， 即之比较到天</li>\n</ul>\n<p>返回：<code>boolean</code> 判断结果</p>\n<p>判断两个日期，是否第一个日期在第二个日期的后面或者相等，是则返回 true，否则返回 false。</p>\n<h2><a class=\"anchor\" name=\"%E6%95%B0%E7%BB%84\" href=\"#%E6%95%B0%E7%BB%84\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>数组</h2><h3><a class=\"anchor\" name=\"count\" href=\"#count\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>COUNT</h3><p>用法：<code>COUNT(arr)</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n</ul>\n<p>返回：<code>boolean</code> 结果</p>\n<p>返回数组的长度。</p>\n<h3><a class=\"anchor\" name=\"arraymap\" href=\"#arraymap\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ARRAYMAP</h3><p>用法：<code>ARRAYMAP(arr, item =&gt; item)</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n<li><code>iterator:Array&lt;any&gt;</code> 箭头函数</li>\n</ul>\n<p>返回：<code>boolean</code> 结果</p>\n<p>数组做数据转换，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。</p>\n<h3><a class=\"anchor\" name=\"arrayfilter\" href=\"#arrayfilter\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ARRAYFILTER</h3><p>用法：<code>ARRAYFILTER(arr, item =&gt; item)</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n<li><code>iterator:Array&lt;any&gt;</code> 箭头函数</li>\n</ul>\n<p>返回：<code>boolean</code> 结果</p>\n<p>数据做数据过滤，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。\n将第二个箭头函数返回为 false 的成员过滤掉。</p>\n<h3><a class=\"anchor\" name=\"arrayfindindex\" href=\"#arrayfindindex\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ARRAYFINDINDEX</h3><p>用法：<code>ARRAYFINDINDEX(arr, item =&gt; item === 2)</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n<li><code>iterator:Array&lt;any&gt;</code> 箭头函数</li>\n</ul>\n<p>返回：<code>number</code> 结果</p>\n<p>数据做数据查找，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。\n找出第二个箭头函数返回为 true 的成员的索引。</p>\n<p>示例：</p>\n<p>ARRAYFINDINDEX([0, 2, false], item =&gt; item === 2) 得到 1。</p>\n<h3><a class=\"anchor\" name=\"arrayfind\" href=\"#arrayfind\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ARRAYFIND</h3><p>用法：<code>ARRAYFIND(arr, item =&gt; item === 2)</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n<li><code>iterator:Array&lt;any&gt;</code> 箭头函数</li>\n</ul>\n<p>返回：<code>any</code> 结果</p>\n<p>数据做数据查找，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。\n找出第二个箭头函数返回为 true 的成员。</p>\n<p>示例：</p>\n<p>ARRAYFIND([0, 2, false], item =&gt; item === 2) 得到 2。</p>\n<h3><a class=\"anchor\" name=\"arraysome\" href=\"#arraysome\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ARRAYSOME</h3><p>用法：<code>ARRAYSOME(arr, item =&gt; item === 2)</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n<li><code>iterator:Array&lt;any&gt;</code> 箭头函数</li>\n</ul>\n<p>返回：<code>boolean</code> 结果</p>\n<p>数据做数据遍历判断，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。\n判断第二个箭头函数是否存在返回为 true 的成员，是则返回 true，否则返回 false。</p>\n<p>示例：</p>\n<p>ARRAYSOME([0, 2, false], item =&gt; item === 2) 得到 true。</p>\n<h3><a class=\"anchor\" name=\"arrayevery\" href=\"#arrayevery\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ARRAYEVERY</h3><p>用法：<code>ARRAYEVERY(arr, item =&gt; item === 2)</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n<li><code>iterator:Array&lt;any&gt;</code> 箭头函数</li>\n</ul>\n<p>返回：<code>boolean</code> 结果</p>\n<p>数据做数据遍历判断，需要搭配箭头函数一起使用，注意箭头函数只支持单表达式用法。\n判断第二个箭头函数返回是否都为 true，是则返回 true，否则返回 false。</p>\n<p>示例：</p>\n<p>ARRAYEVERY([0, 2, false], item =&gt; item === 2) 得到 false</p>\n<h3><a class=\"anchor\" name=\"arrayincludes\" href=\"#arrayincludes\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ARRAYINCLUDES</h3><p>用法：<code>ARRAYINCLUDES(arr, 2)</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n<li><code>item:any</code> 元素</li>\n</ul>\n<p>返回：<code>any</code> 结果</p>\n<p>判断数据中是否存在指定元素。</p>\n<p>示例：</p>\n<p>ARRAYINCLUDES([0, 2, false], 2) 得到 true。</p>\n<h3><a class=\"anchor\" name=\"compact\" href=\"#compact\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>COMPACT</h3><p>用法：<code>COMPACT(arr)</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n</ul>\n<p>返回：<code>Array&lt;any&gt;</code> 结果</p>\n<p>数组过滤掉 false、null、0 和 &quot;&quot;。</p>\n<p>示例：</p>\n<p>COMPACT([0, 1, false, 2, &#39;&#39;, 3]) 得到 [1, 2, 3]。</p>\n<h3><a class=\"anchor\" name=\"join\" href=\"#join\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>JOIN</h3><p>用法：<code>JOIN(arr, string)</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n<li><code>separator:String</code> 分隔符</li>\n</ul>\n<p>返回：<code>String</code> 结果</p>\n<p>数组转成字符串。</p>\n<p>示例：</p>\n<p>JOIN([&#39;a&#39;, &#39;b&#39;, &#39;c&#39;], &#39;=&#39;) 得到 &#39;a=b=c&#39;。</p>\n<h3><a class=\"anchor\" name=\"concat\" href=\"#concat\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>CONCAT</h3><p>用法：<code>CONCAT([&#39;a&#39;, &#39;b&#39;, &#39;c&#39;], [&#39;1&#39;], [&#39;3&#39;])</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n</ul>\n<p>返回：<code>Array&lt;any&gt;</code> 结果</p>\n<p>数组合并。</p>\n<p>示例：</p>\n<p>CONCAT([&#39;a&#39;, &#39;b&#39;, &#39;c&#39;], [&#39;1&#39;], [&#39;3&#39;]) 得到 [&#39;a&#39;, &#39;b&#39;, &#39;c&#39;, &#39;1&#39;, &#39;3&#39;]。</p>\n<h3><a class=\"anchor\" name=\"uniq\" href=\"#uniq\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>UNIQ</h3><p>用法：<code>UNIQ([{a: &#39;1&#39;}, {b: &#39;2&#39;}, {a: &#39;1&#39;}], &#39;x&#39;)</code></p>\n<ul>\n<li><code>arr:Array&lt;any&gt;</code> 数组</li>\n<li><code>field:string</code> 字段</li>\n</ul>\n<p>返回：<code>Array&lt;any&gt;</code> 结果</p>\n<p>数组去重，第二个参数「field」，可指定根据该字段去重。</p>\n<p>示例：</p>\n<p>UNIQ([{a: &#39;1&#39;}, {b: &#39;2&#39;}, {a: &#39;1&#39;}]， &#39;id&#39;)。</p>\n<h2><a class=\"anchor\" name=\"%E7%BC%96%E7%A0%81\" href=\"#%E7%BC%96%E7%A0%81\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>编码</h2><h3><a class=\"anchor\" name=\"encodejson\" href=\"#encodejson\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ENCODEJSON</h3><p>用法：<code>ENCODEJSON({name: &#39;amis&#39;})</code></p>\n<ul>\n<li><code>obj:object</code> JS对象</li>\n</ul>\n<p>返回：<code>string</code> 结果</p>\n<p>将JS对象转换成JSON字符串。</p>\n<p>示例：</p>\n<p>ENCODEJSON({name: &#39;amis&#39;}) 得到 &#39;{&quot;name&quot;:&quot;amis&quot;}&#39;。</p>\n<h3><a class=\"anchor\" name=\"decodejson\" href=\"#decodejson\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>DECODEJSON</h3><p>用法：<code>DECODEJSON(&#39;{\\&quot;name\\&quot;: &quot;amis&quot;}&#39;)</code></p>\n<ul>\n<li><code>str:string</code> 字符串</li>\n</ul>\n<p>返回：<code>object</code> 结果</p>\n<p>解析JSON编码数据，返回JS对象。</p>\n<p>示例：</p>\n<p>DECODEJSON(&#39;{&quot;name&quot;: &quot;amis&quot;}&#39;) 得到 {name: &#39;amis&#39;}。</p>\n<h2><a class=\"anchor\" name=\"%E5%85%B6%E4%BB%96\" href=\"#%E5%85%B6%E4%BB%96\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>其他</h2><h3><a class=\"anchor\" name=\"get\" href=\"#get\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>GET</h3><p>用法：<code>GET(arr, 2)</code></p>\n<ul>\n<li><code>obj:any</code> 对象或数组</li>\n<li><code>path:string</code> 路径</li>\n<li><code>defaultValue:any</code> 如果解析不到则返回该值</li>\n</ul>\n<p>返回：<code>any</code> 结果</p>\n<p>根据对象或者数组的path路径获取值。 如果解析 value 是 undefined 会以 defaultValue 取代。</p>\n<p>示例：</p>\n<p>GET([0, 2, {name: &#39;amis&#39;, age: 18}], 1) 得到 2，\nGET([0, 2, {name: &#39;amis&#39;, age: 18}], &#39;2.name&#39;) 得到 &#39;amis&#39;，\nGET({arr: [{name: &#39;amis&#39;, age: 18}]}, &#39;arr[0].name&#39;) 得到 &#39;amis&#39;，\nGET({arr: [{name: &#39;amis&#39;, age: 18}]}, &#39;arr.0.name&#39;) 得到 &#39;amis&#39;，\nGET({arr: [{name: &#39;amis&#39;, age: 18}]}, &#39;arr.1.name&#39;, &#39;not-found&#39;) 得到 &#39;not-found&#39;。</p>\n<h3><a class=\"anchor\" name=\"istype\" href=\"#istype\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>ISTYPE</h3><p>用法：<code>ISTYPE([{a: &#39;1&#39;}, {b: &#39;2&#39;}, {a: &#39;1&#39;}], &#39;array&#39;)</code></p>\n<ul>\n<li><code>判断对象:string</code> null</li>\n</ul>\n<p>返回：<code>boolean</code> 结果</p>\n<p>判断是否为类型支持：string, number, array, date, plain-object。</p>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "使用场景",
          "fragment": "%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF",
          "fullPath": "#%E4%BD%BF%E7%94%A8%E5%9C%BA%E6%99%AF",
          "level": 2
        },
        {
          "label": "表达式语法",
          "fragment": "%E8%A1%A8%E8%BE%BE%E5%BC%8F%E8%AF%AD%E6%B3%95",
          "fullPath": "#%E8%A1%A8%E8%BE%BE%E5%BC%8F%E8%AF%AD%E6%B3%95",
          "level": 2,
          "children": [
            {
              "label": "公式",
              "fragment": "%E5%85%AC%E5%BC%8F",
              "fullPath": "#%E5%85%AC%E5%BC%8F",
              "level": 3
            }
          ]
        },
        {
          "label": "函数调用示例",
          "fragment": "%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E7%A4%BA%E4%BE%8B",
          "fullPath": "#%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E7%A4%BA%E4%BE%8B",
          "level": 2
        },
        {
          "label": "逻辑函数",
          "fragment": "%E9%80%BB%E8%BE%91%E5%87%BD%E6%95%B0",
          "fullPath": "#%E9%80%BB%E8%BE%91%E5%87%BD%E6%95%B0",
          "level": 2,
          "children": [
            {
              "label": "IF",
              "fragment": "if",
              "fullPath": "#if",
              "level": 3
            },
            {
              "label": "AND",
              "fragment": "and",
              "fullPath": "#and",
              "level": 3
            },
            {
              "label": "OR",
              "fragment": "or",
              "fullPath": "#or",
              "level": 3
            },
            {
              "label": "XOR",
              "fragment": "xor",
              "fullPath": "#xor",
              "level": 3
            },
            {
              "label": "IFS",
              "fragment": "ifs",
              "fullPath": "#ifs",
              "level": 3
            }
          ]
        },
        {
          "label": "数学函数",
          "fragment": "%E6%95%B0%E5%AD%A6%E5%87%BD%E6%95%B0",
          "fullPath": "#%E6%95%B0%E5%AD%A6%E5%87%BD%E6%95%B0",
          "level": 2,
          "children": [
            {
              "label": "ABS",
              "fragment": "abs",
              "fullPath": "#abs",
              "level": 3
            },
            {
              "label": "MAX",
              "fragment": "max",
              "fullPath": "#max",
              "level": 3
            },
            {
              "label": "MIN",
              "fragment": "min",
              "fullPath": "#min",
              "level": 3
            },
            {
              "label": "SUM",
              "fragment": "sum",
              "fullPath": "#sum",
              "level": 3
            },
            {
              "label": "INT",
              "fragment": "int",
              "fullPath": "#int",
              "level": 3
            },
            {
              "label": "MOD",
              "fragment": "mod",
              "fullPath": "#mod",
              "level": 3
            },
            {
              "label": "PI",
              "fragment": "pi",
              "fullPath": "#pi",
              "level": 3
            },
            {
              "label": "ROUND",
              "fragment": "round",
              "fullPath": "#round",
              "level": 3
            },
            {
              "label": "FLOOR",
              "fragment": "floor",
              "fullPath": "#floor",
              "level": 3
            },
            {
              "label": "CEIL",
              "fragment": "ceil",
              "fullPath": "#ceil",
              "level": 3
            },
            {
              "label": "SQRT",
              "fragment": "sqrt",
              "fullPath": "#sqrt",
              "level": 3
            },
            {
              "label": "AVG",
              "fragment": "avg",
              "fullPath": "#avg",
              "level": 3
            },
            {
              "label": "DEVSQ",
              "fragment": "devsq",
              "fullPath": "#devsq",
              "level": 3
            },
            {
              "label": "AVEDEV",
              "fragment": "avedev",
              "fullPath": "#avedev",
              "level": 3
            },
            {
              "label": "HARMEAN",
              "fragment": "harmean",
              "fullPath": "#harmean",
              "level": 3
            },
            {
              "label": "LARGE",
              "fragment": "large",
              "fullPath": "#large",
              "level": 3
            },
            {
              "label": "UPPERMONEY",
              "fragment": "uppermoney",
              "fullPath": "#uppermoney",
              "level": 3
            },
            {
              "label": "RAND",
              "fragment": "rand",
              "fullPath": "#rand",
              "level": 3
            },
            {
              "label": "LAST",
              "fragment": "last",
              "fullPath": "#last",
              "level": 3
            },
            {
              "label": "POW",
              "fragment": "pow",
              "fullPath": "#pow",
              "level": 3
            }
          ]
        },
        {
          "label": "文本函数",
          "fragment": "%E6%96%87%E6%9C%AC%E5%87%BD%E6%95%B0",
          "fullPath": "#%E6%96%87%E6%9C%AC%E5%87%BD%E6%95%B0",
          "level": 2,
          "children": [
            {
              "label": "LEFT",
              "fragment": "left",
              "fullPath": "#left",
              "level": 3
            },
            {
              "label": "RIGHT",
              "fragment": "right",
              "fullPath": "#right",
              "level": 3
            },
            {
              "label": "LEN",
              "fragment": "len",
              "fullPath": "#len",
              "level": 3
            },
            {
              "label": "LENGTH",
              "fragment": "length",
              "fullPath": "#length",
              "level": 3
            },
            {
              "label": "ISEMPTY",
              "fragment": "isempty",
              "fullPath": "#isempty",
              "level": 3
            },
            {
              "label": "CONCATENATE",
              "fragment": "concatenate",
              "fullPath": "#concatenate",
              "level": 3
            },
            {
              "label": "CHAR",
              "fragment": "char",
              "fullPath": "#char",
              "level": 3
            },
            {
              "label": "LOWER",
              "fragment": "lower",
              "fullPath": "#lower",
              "level": 3
            },
            {
              "label": "UPPER",
              "fragment": "upper",
              "fullPath": "#upper",
              "level": 3
            },
            {
              "label": "UPPERFIRST",
              "fragment": "upperfirst",
              "fullPath": "#upperfirst",
              "level": 3
            },
            {
              "label": "PADSTART",
              "fragment": "padstart",
              "fullPath": "#padstart",
              "level": 3
            },
            {
              "label": "CAPITALIZE",
              "fragment": "capitalize",
              "fullPath": "#capitalize",
              "level": 3
            },
            {
              "label": "ESCAPE",
              "fragment": "escape",
              "fullPath": "#escape",
              "level": 3
            },
            {
              "label": "TRUNCATE",
              "fragment": "truncate",
              "fullPath": "#truncate",
              "level": 3
            },
            {
              "label": "BEFORELAST",
              "fragment": "beforelast",
              "fullPath": "#beforelast",
              "level": 3
            },
            {
              "label": "SPLIT",
              "fragment": "split",
              "fullPath": "#split",
              "level": 3
            },
            {
              "label": "TRIM",
              "fragment": "trim",
              "fullPath": "#trim",
              "level": 3
            },
            {
              "label": "STRIPTAG",
              "fragment": "striptag",
              "fullPath": "#striptag",
              "level": 3
            },
            {
              "label": "LINEBREAK",
              "fragment": "linebreak",
              "fullPath": "#linebreak",
              "level": 3
            },
            {
              "label": "STARTSWITH",
              "fragment": "startswith",
              "fullPath": "#startswith",
              "level": 3
            },
            {
              "label": "ENDSWITH",
              "fragment": "endswith",
              "fullPath": "#endswith",
              "level": 3
            },
            {
              "label": "CONTAINS",
              "fragment": "contains",
              "fullPath": "#contains",
              "level": 3
            },
            {
              "label": "REPLACE",
              "fragment": "replace",
              "fullPath": "#replace",
              "level": 3
            },
            {
              "label": "SEARCH",
              "fragment": "search",
              "fullPath": "#search",
              "level": 3
            },
            {
              "label": "MID",
              "fragment": "mid",
              "fullPath": "#mid",
              "level": 3
            },
            {
              "label": "BASENAME",
              "fragment": "basename",
              "fullPath": "#basename",
              "level": 3
            },
            {
              "label": "UUID",
              "fragment": "uuid",
              "fullPath": "#uuid",
              "level": 3
            }
          ]
        },
        {
          "label": "日期函数",
          "fragment": "%E6%97%A5%E6%9C%9F%E5%87%BD%E6%95%B0",
          "fullPath": "#%E6%97%A5%E6%9C%9F%E5%87%BD%E6%95%B0",
          "level": 2,
          "children": [
            {
              "label": "DATE",
              "fragment": "date",
              "fullPath": "#date",
              "level": 3
            },
            {
              "label": "TIMESTAMP",
              "fragment": "timestamp",
              "fullPath": "#timestamp",
              "level": 3
            },
            {
              "label": "TODAY",
              "fragment": "today",
              "fullPath": "#today",
              "level": 3
            },
            {
              "label": "NOW",
              "fragment": "now",
              "fullPath": "#now",
              "level": 3
            },
            {
              "label": "WEEKDAY",
              "fragment": "weekday",
              "fullPath": "#weekday",
              "level": 3
            },
            {
              "label": "WEEK",
              "fragment": "week",
              "fullPath": "#week",
              "level": 3
            },
            {
              "label": "DATETOSTR",
              "fragment": "datetostr",
              "fullPath": "#datetostr",
              "level": 3
            },
            {
              "label": "DATERANGESPLIT",
              "fragment": "daterangesplit",
              "fullPath": "#daterangesplit",
              "level": 3
            },
            {
              "label": "STARTOF",
              "fragment": "startof",
              "fullPath": "#startof",
              "level": 3
            },
            {
              "label": "ENDOF",
              "fragment": "endof",
              "fullPath": "#endof",
              "level": 3
            },
            {
              "label": "YEAR",
              "fragment": "year",
              "fullPath": "#year",
              "level": 3
            },
            {
              "label": "MONTH",
              "fragment": "month",
              "fullPath": "#month",
              "level": 3
            },
            {
              "label": "DAY",
              "fragment": "day",
              "fullPath": "#day",
              "level": 3
            },
            {
              "label": "HOUR",
              "fragment": "hour",
              "fullPath": "#hour",
              "level": 3
            },
            {
              "label": "MINUTE",
              "fragment": "minute",
              "fullPath": "#minute",
              "level": 3
            },
            {
              "label": "SECOND",
              "fragment": "second",
              "fullPath": "#second",
              "level": 3
            },
            {
              "label": "YEARS",
              "fragment": "years",
              "fullPath": "#years",
              "level": 3
            },
            {
              "label": "MINUTES",
              "fragment": "minutes",
              "fullPath": "#minutes",
              "level": 3
            },
            {
              "label": "DAYS",
              "fragment": "days",
              "fullPath": "#days",
              "level": 3
            },
            {
              "label": "HOURS",
              "fragment": "hours",
              "fullPath": "#hours",
              "level": 3
            },
            {
              "label": "DATEMODIFY",
              "fragment": "datemodify",
              "fullPath": "#datemodify",
              "level": 3
            },
            {
              "label": "STRTODATE",
              "fragment": "strtodate",
              "fullPath": "#strtodate",
              "level": 3
            },
            {
              "label": "ISBEFORE",
              "fragment": "isbefore",
              "fullPath": "#isbefore",
              "level": 3
            },
            {
              "label": "ISAFTER",
              "fragment": "isafter",
              "fullPath": "#isafter",
              "level": 3
            },
            {
              "label": "BETWEENRANGE",
              "fragment": "betweenrange",
              "fullPath": "#betweenrange",
              "level": 3
            },
            {
              "label": "ISSAMEORBEFORE",
              "fragment": "issameorbefore",
              "fullPath": "#issameorbefore",
              "level": 3
            },
            {
              "label": "ISSAMEORAFTER",
              "fragment": "issameorafter",
              "fullPath": "#issameorafter",
              "level": 3
            }
          ]
        },
        {
          "label": "数组",
          "fragment": "%E6%95%B0%E7%BB%84",
          "fullPath": "#%E6%95%B0%E7%BB%84",
          "level": 2,
          "children": [
            {
              "label": "COUNT",
              "fragment": "count",
              "fullPath": "#count",
              "level": 3
            },
            {
              "label": "ARRAYMAP",
              "fragment": "arraymap",
              "fullPath": "#arraymap",
              "level": 3
            },
            {
              "label": "ARRAYFILTER",
              "fragment": "arrayfilter",
              "fullPath": "#arrayfilter",
              "level": 3
            },
            {
              "label": "ARRAYFINDINDEX",
              "fragment": "arrayfindindex",
              "fullPath": "#arrayfindindex",
              "level": 3
            },
            {
              "label": "ARRAYFIND",
              "fragment": "arrayfind",
              "fullPath": "#arrayfind",
              "level": 3
            },
            {
              "label": "ARRAYSOME",
              "fragment": "arraysome",
              "fullPath": "#arraysome",
              "level": 3
            },
            {
              "label": "ARRAYEVERY",
              "fragment": "arrayevery",
              "fullPath": "#arrayevery",
              "level": 3
            },
            {
              "label": "ARRAYINCLUDES",
              "fragment": "arrayincludes",
              "fullPath": "#arrayincludes",
              "level": 3
            },
            {
              "label": "COMPACT",
              "fragment": "compact",
              "fullPath": "#compact",
              "level": 3
            },
            {
              "label": "JOIN",
              "fragment": "join",
              "fullPath": "#join",
              "level": 3
            },
            {
              "label": "CONCAT",
              "fragment": "concat",
              "fullPath": "#concat",
              "level": 3
            },
            {
              "label": "UNIQ",
              "fragment": "uniq",
              "fullPath": "#uniq",
              "level": 3
            }
          ]
        },
        {
          "label": "编码",
          "fragment": "%E7%BC%96%E7%A0%81",
          "fullPath": "#%E7%BC%96%E7%A0%81",
          "level": 2,
          "children": [
            {
              "label": "ENCODEJSON",
              "fragment": "encodejson",
              "fullPath": "#encodejson",
              "level": 3
            },
            {
              "label": "DECODEJSON",
              "fragment": "decodejson",
              "fullPath": "#decodejson",
              "level": 3
            }
          ]
        },
        {
          "label": "其他",
          "fragment": "%E5%85%B6%E4%BB%96",
          "fullPath": "#%E5%85%B6%E4%BB%96",
          "level": 2,
          "children": [
            {
              "label": "GET",
              "fragment": "get",
              "fullPath": "#get",
              "level": 3
            },
            {
              "label": "ISTYPE",
              "fragment": "istype",
              "fullPath": "#istype",
              "level": 3
            }
          ]
        }
      ],
      "level": 0
    }
  };

});
