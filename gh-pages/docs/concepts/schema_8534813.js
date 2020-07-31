amis.define('docs/concepts/schema.md', function(require, exports, module, define) {

  module.exports = {
    "title": "配置与组件",
    "description": "配置与组件",
    "type": 0,
    "group": "💡 概念",
    "menuName": "配置与组件",
    "icon": null,
    "order": 9,
    "html": "<h2><a class=\"anchor\" name=\"%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84-amis-%E9%85%8D%E7%BD%AE\" href=\"#%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84-amis-%E9%85%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>最简单的 amis 配置</h2><p>一个最简单的 amis 配置看起来是这样的：</p>\n<pre><code class=\"lang-json\"><span class=\"token punctuation\">{</span>\n  <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"page\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"body\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"Hello World!\"</span>\n<span class=\"token punctuation\">}</span>\n</code></pre>\n<p>请观察上面的代码，这是一段普通的 JSON 格式文本，它的含义是：</p>\n<ol>\n<li><code>type</code>是每一个 amis 节点中，最重要的一个字段，它会告诉 amis 当前节点需要渲染的是<code>Page</code>组件</li>\n<li>而<code>body</code>字段会被看作是<code>Page</code>组件的属性，将该属性值所配置的内容，渲染到<code>Page</code>组件的内容区中</li>\n</ol>\n<p>上面配置通过 amis 的处理，会渲染出一个简单的页面，并在页面中展示文字：<code>Hello World!</code>，就像下面这样：</p>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\">{\n  \"type\": \"page\",\n  \"body\": \"Hello World!\"\n}\n</script></div>\n<p>后续章节中，你会经常看到例如上面这样，支持<strong>实时编辑配置预览效果</strong>的页面配置预览工具，它可以帮助你更直观的看到具体配置所展示的页面效果。</p>\n<h2><a class=\"anchor\" name=\"%E7%BB%84%E4%BB%B6\" href=\"#%E7%BB%84%E4%BB%B6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>组件</h2><p>上面提到，<code>type</code>字段会告诉 amis 当前节点渲染的组件为<code>Page</code>，<code>Page</code> 属于 amis 内置组件之一。</p>\n<p>组件节点的配置永远都是由 <strong><code>type</code>字段</strong> （用于标识当前是哪个组件）和 <strong>若干属性值</strong> 构成的。</p>\n<pre><code>{\n  &quot;type&quot;: &quot;xxx&quot;,\n  ...若干属性值\n}\n</code></pre><h2><a class=\"anchor\" name=\"%E7%BB%84%E4%BB%B6%E6%A0%91\" href=\"#%E7%BB%84%E4%BB%B6%E6%A0%91\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>组件树</h2><p>这次我们看一个稍微复杂一点的配置：</p>\n<pre><code class=\"lang-json\"><span class=\"token punctuation\">{</span>\n  <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"page\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"body\"</span><span class=\"token operator\">:</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"tpl\"</span><span class=\"token punctuation\">,</span>\n    <span class=\"token property\">\"tpl\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"Hello World!\"</span>\n  <span class=\"token punctuation\">}</span>\n<span class=\"token punctuation\">}</span>\n</code></pre>\n<p>该配置渲染页面如下：</p>\n<div class=\"amis-preview\" style=\"height: 400px\"><script type=\"text/schema\" height=\"400\">{\n  \"type\": \"page\",\n  \"body\": {\n    \"type\": \"tpl\",\n    \"tpl\": \"Hello World!\"\n  }\n}\n</script></div>\n<p>看起来和之前的示例没啥区别，但是发现和之前不同的地方了吗？</p>\n<p>这次 <code>Page</code> 组件的 <code>body</code> 属性值，我们配置了一个对象，<strong>通过<code>type</code>指明<code>body</code>内容区内会渲染一个叫<code>Tpl</code>的组件</strong>，它是一个模板渲染组件，这里我们先只是配置一段固定文字。</p>\n<p>它是 <code>Page</code> 的子节点。</p>\n<p>再来观察下面这个配置:</p>\n<div class=\"amis-preview\" style=\"height: 520px\"><script type=\"text/schema\" height=\"520\" scope=\"body\">[\n    {\n      \"type\": \"tpl\",\n      \"tpl\": \"Hello World!\"\n    },\n    {\n        \"type\": \"divider\"\n    },\n    {\n      \"type\": \"form\",\n      \"controls\": [\n        {\n          \"type\": \"text\",\n          \"name\": \"name\",\n          \"label\": \"姓名\"\n        }\n      ]\n    }\n]\n</script></div>\n<p>我们通过数组的形式，在内容区配置<code>tpl</code>和<code>form</code>组件。</p>\n<p>没错，<code>body</code> 属性支持数组结构，这也就意味着你可以 <strong>通过组件树的形式</strong> 渲染出足够复杂的页面。</p>\n<p>具有<code>body</code>这类属性的组件一般称为<strong>容器型组件</strong>，就如名字所形容的，这类组件可以作为容器，在他们的子节点配置若干其他类型的组件，amis 中还有很多类似的组件，例如<code>Form</code>、<code>Service</code>等，后续我们会逐一进行介绍。</p>\n<blockquote>\n<p><strong>注意：</strong></p>\n<p><code>Page</code>是一个特殊的容器组件，它是 amis 页面配置中 <strong>必须也是唯一的顶级节点</strong></p>\n</blockquote>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "最简单的 amis 配置",
          "fragment": "%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84-amis-%E9%85%8D%E7%BD%AE",
          "fullPath": "#%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84-amis-%E9%85%8D%E7%BD%AE",
          "level": 2
        },
        {
          "label": "组件",
          "fragment": "%E7%BB%84%E4%BB%B6",
          "fullPath": "#%E7%BB%84%E4%BB%B6",
          "level": 2
        },
        {
          "label": "组件树",
          "fragment": "%E7%BB%84%E4%BB%B6%E6%A0%91",
          "fullPath": "#%E7%BB%84%E4%BB%B6%E6%A0%91",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
