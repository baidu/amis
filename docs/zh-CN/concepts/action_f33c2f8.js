amis.define('docs/zh-CN/concepts/action.md', function(require, exports, module, define) {

  module.exports = {
    "title": "行为",
    "description": null,
    "type": 0,
    "group": "💡 概念",
    "menuName": "行为",
    "icon": null,
    "order": 12,
    "html": "<div class=\"markdown-body\"><p>页面的交互操作，例如：<strong>提交表单、显示一个弹框、跳转页面、复制一段文字到粘贴板</strong>等等操作，都可以视作页面的一种<strong>行为</strong>。</p>\n<p>在 amis 中，大部分 <strong>行为</strong> 是跟 <strong>行为按钮组件</strong> 进行绑定的，也就是说，当你想要配置一个行为，大部分情况下你应该遵循下面的步骤：</p>\n<ol>\n<li>添加一个 <strong>行为按钮组件</strong>；</li>\n<li>配置当前 <strong>行为类型（actionType）</strong>；</li>\n<li>根据当前行为类型，配置你想要的 <strong>属性</strong>。</li>\n</ol>\n<h2><a class=\"anchor\" name=\"%E5%A6%82%E4%BD%95%E9%85%8D%E7%BD%AE%E8%A1%8C%E4%B8%BA-\" href=\"#%E5%A6%82%E4%BD%95%E9%85%8D%E7%BD%AE%E8%A1%8C%E4%B8%BA-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>如何配置行为？</h2><h3><a class=\"anchor\" name=\"%E9%80%9A%E8%BF%87%E8%A1%8C%E4%B8%BA%E6%8C%89%E9%92%AE\" href=\"#%E9%80%9A%E8%BF%87%E8%A1%8C%E4%B8%BA%E6%8C%89%E9%92%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>通过行为按钮</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"action\",\n    \"label\": \"发出一个请求\",\n    \"actionType\": \"ajax\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\"\n}\n</script></div><div class=\"markdown-body\">\n<ol>\n<li>在<code>page</code>内容区中，添加一个<code>action</code>行为按钮组件</li>\n<li>配置当前行为类型是 ajax（即发送一个 ajax 请求)</li>\n<li>配置请求 api，值为 API 类型</li>\n</ol>\n<p>现在点击该按钮，你会发现浏览器发出了这个<code>ajax</code>请求。</p>\n<p>很简单是吧？我们再来一个例子：</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"action\",\n    \"label\": \"弹个框\",\n    \"actionType\": \"dialog\",\n    \"dialog\": {\n      \"title\": \"弹框\",\n      \"body\": \"Hello World!\"\n    }\n}\n</script></div><div class=\"markdown-body\">\n<p>这次我们配置<code>actionType</code>为<code>dialog</code>，意味着点击该按钮会弹出一个模态框，并配置<code>dialog</code>内容，来显示字符串<code>Hello World!</code></p>\n<blockquote>\n<p><code>dialog</code>是容器，也就意味着可以在<code>body</code>属性中配置其他组件</p>\n</blockquote>\n<p>完整的行为列表可以查看 <a href=\"../../components/action\">action</a>组件</p>\n<h3><a class=\"anchor\" name=\"%E7%BB%84%E4%BB%B6%E6%89%80%E6%94%AF%E6%8C%81%E7%9A%84%E8%A1%8C%E4%B8%BA\" href=\"#%E7%BB%84%E4%BB%B6%E6%89%80%E6%94%AF%E6%8C%81%E7%9A%84%E8%A1%8C%E4%B8%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>组件所支持的行为</h3><p>一些特殊组件，例如 Chart 组件 中的图表点击行为，可以直接配置<code>clickAction</code>，来配置行为对象。</p>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "如何配置行为？",
          "fragment": "%E5%A6%82%E4%BD%95%E9%85%8D%E7%BD%AE%E8%A1%8C%E4%B8%BA-",
          "fullPath": "#%E5%A6%82%E4%BD%95%E9%85%8D%E7%BD%AE%E8%A1%8C%E4%B8%BA-",
          "level": 2,
          "children": [
            {
              "label": "通过行为按钮",
              "fragment": "%E9%80%9A%E8%BF%87%E8%A1%8C%E4%B8%BA%E6%8C%89%E9%92%AE",
              "fullPath": "#%E9%80%9A%E8%BF%87%E8%A1%8C%E4%B8%BA%E6%8C%89%E9%92%AE",
              "level": 3
            },
            {
              "label": "组件所支持的行为",
              "fragment": "%E7%BB%84%E4%BB%B6%E6%89%80%E6%94%AF%E6%8C%81%E7%9A%84%E8%A1%8C%E4%B8%BA",
              "fullPath": "#%E7%BB%84%E4%BB%B6%E6%89%80%E6%94%AF%E6%8C%81%E7%9A%84%E8%A1%8C%E4%B8%BA",
              "level": 3
            }
          ]
        }
      ],
      "level": 0
    }
  };

});
