amis.define('docs/zh-CN/concepts/expression.md', function(require, exports, module, define) {

  module.exports = {
    "title": "表达式",
    "description": null,
    "type": 0,
    "group": "💡 概念",
    "menuName": "表达式",
    "icon": null,
    "order": 13,
    "html": "<div class=\"markdown-body\"><p>一般来说，属性名类似于<code>xxxOn</code> 或者 <code>className</code> 的配置项，都可以使用表达式进行配置，表达式具有如下的语法：</p>\n<pre><code class=\"language-json\"><span class=\"token punctuation\">{</span>\n  <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"tpl\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"tpl\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"当前作用域中变量 show 是 1 的时候才可以看得到我哦~\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"visibleOn\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"this.show === 1\"</span>\n<span class=\"token punctuation\">}</span>\n</code></pre>\n<p>其中：<code>this.show === 1</code> 就是表达式。</p>\n<h2><a class=\"anchor\" name=\"%E8%A1%A8%E8%BE%BE%E5%BC%8F%E8%AF%AD%E6%B3%95\" href=\"#%E8%A1%A8%E8%BE%BE%E5%BC%8F%E8%AF%AD%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>表达式语法</h2><blockquote>\n<p>表达式语法实际上是 JavaScript 代码，更多 JavaScript 知识查看 <a href=\"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript\">这里</a>。</p>\n<p>表达式中不要使用<code>${xxx}</code>语法，这个是数据映射的语法规则，不要搞混淆了！</p>\n</blockquote>\n<p>在 amis 的实现过程中，当正则匹配到某个组件存在<code>xxxOn</code>语法的属性名时，会尝试进行下面步骤（以上面配置为例）：</p>\n<ol>\n<li>提取<code>visibleOn</code>配置项配置的 JavaScript 语句<code>this.show === 1</code>，并以当前组件的数据域为这段代码的数据作用域，执行这段 js 代码；</li>\n<li>之后将执行结果赋值给<code>visible</code>并添加到组件属性中</li>\n<li>执行渲染。当前示例中：<code>visible</code>代表着是否显示当前组件；</li>\n</ol>\n<p>组件不同的配置项会有不同的效果，请大家在组件文档中多留意。</p>\n<blockquote>\n<p>表达式的执行结果预期应该是<code>boolean</code>类型值，如果不是，amis 会根据 JavaScript 的规则将结果视作<code>boolean</code>类型进行判断</p>\n</blockquote>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "表达式语法",
          "fragment": "%E8%A1%A8%E8%BE%BE%E5%BC%8F%E8%AF%AD%E6%B3%95",
          "fullPath": "#%E8%A1%A8%E8%BE%BE%E5%BC%8F%E8%AF%AD%E6%B3%95",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
