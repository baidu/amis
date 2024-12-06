amis.define('docs/zh-CN/extend/mobile.md', function(require, exports, module, define) {

  module.exports = {
    "title": "移动端展现",
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%8E%9F%E7%94%9F-ui\" href=\"#%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%8E%9F%E7%94%9F-ui\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>移动端原生 UI</h2><p>从 1.6.0 版本开始，amis 会默认在移动端下使用仿原生 UI 的展现，比如日期选择会从底部弹出。</p>\n<p>由于这个仿原生 UI 是新开发的组件，有些 amis PC 版本的高级配置功能还不支持，比如 select 下的搜索过滤等，如果需要这些功能，可以先通过 props 里的 <code>useMobileUI</code> 属性关闭。</p>\n<p>方法 1：全局关闭</p>\n<pre><code class=\"language-js\">amis<span class=\"token punctuation\">.</span><span class=\"token function\">embed</span><span class=\"token punctuation\">(</span>\n  <span class=\"token string\">'#root'</span><span class=\"token punctuation\">,</span>\n  <span class=\"token punctuation\">{</span>\n    <span class=\"token comment\">// amis schema</span>\n  <span class=\"token punctuation\">}</span><span class=\"token punctuation\">,</span>\n  <span class=\"token punctuation\">{</span>\n    <span class=\"token comment\">// 这里是初始 props</span>\n  <span class=\"token punctuation\">}</span><span class=\"token punctuation\">,</span>\n  <span class=\"token punctuation\">{</span>\n    <span class=\"token literal-property property\">theme</span><span class=\"token operator\">:</span> <span class=\"token string\">'antd'</span><span class=\"token punctuation\">,</span>\n    <span class=\"token literal-property property\">useMobileUI</span><span class=\"token operator\">:</span> <span class=\"token boolean\">false</span>\n  <span class=\"token punctuation\">}</span>\n<span class=\"token punctuation\">)</span><span class=\"token punctuation\">;</span>\n</code></pre>\n<p>方法 2：针对某个组件进行关闭</p>\n<pre><code class=\"language-json\"><span class=\"token punctuation\">{</span>\n  <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"select\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"useMobileUI\"</span><span class=\"token operator\">:</span> <span class=\"token boolean\">false</span>\n<span class=\"token punctuation\">}</span>\n</code></pre>\n<h2><a class=\"anchor\" name=\"%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%AE%9A%E5%88%B6%E9%85%8D%E7%BD%AE\" href=\"#%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%AE%9A%E5%88%B6%E9%85%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>移动端定制配置</h2><p>有时候我们需要在移动端下展示不同效果，可以通过 <code>mobile</code> 属性来在移动端下覆盖部分属性。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [{\n    \"name\": \"email\",\n    \"type\": \"input-email\",\n    \"label\": \"邮箱：\",\n    \"mobile\": {\n      \"name\": \"phone\",\n      \"type\": \"text\",\n      \"label\": \"电话：\",\n      \"validations\": {\n        \"isPhoneNumber\": true\n      }\n    }\n  }]\n}\n</script></div><div class=\"markdown-body\">\n<p>请点击上方切换到移动端预览效果。</p>\n<p><code>mobile</code> 属性可以出现在配置中的任意地方，替换父节点的任意属性，比如前面的例子可以写成放在 <code>form</code> 上替换所有 <code>body</code></p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [{\n    \"name\": \"email\",\n    \"type\": \"input-email\",\n    \"label\": \"邮箱：\"\n  }],\n  \"mobile\": {\n    \"body\": [{\n      \"name\": \"phone\",\n      \"type\": \"input-text\",\n      \"label\": \"电话：\",\n      \"validations\": {\n        \"isPhoneNumber\": true\n      }\n    }]\n  }\n}\n</script></div><div class=\"markdown-body\">\n<blockquote>\n<p>注意这里对于移动端的判断是根据页面宽度，和 CSS 保持一致，所以即便是在 PC 上，如果页面宽度很小也会切换到 mobile 配置</p>\n</blockquote>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "移动端原生 UI",
          "fragment": "%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%8E%9F%E7%94%9F-ui",
          "fullPath": "#%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%8E%9F%E7%94%9F-ui",
          "level": 2
        },
        {
          "label": "移动端定制配置",
          "fragment": "%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%AE%9A%E5%88%B6%E9%85%8D%E7%BD%AE",
          "fullPath": "#%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%AE%9A%E5%88%B6%E9%85%8D%E7%BD%AE",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
