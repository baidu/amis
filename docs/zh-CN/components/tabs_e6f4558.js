amis.define('docs/zh-CN/components/tabs.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Tabs 选项卡",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Tabs",
    "icon": null,
    "order": 68,
    "html": "<div class=\"markdown-body\"><p>选项卡容器组件。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"tab\": \"Content 1\"\n        },\n\n        {\n            \"title\": \"Tab 2\",\n            \"tab\": \"Content 2\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>默认想要显示多少选项卡配置多少个 <code>tabs</code> 成员即可。但是有时候你可能会想根据某个数据来动态生成。这个时候需要额外配置 <code>source</code> 属性如。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"data\": {\n        \"arr\": [\n            {\n                \"a\": \"收入\",\n                \"b\": 199\n            },\n\n            {\n                \"a\": \"支出\",\n                \"b\": 299\n            }\n        ]\n    },\n\n    \"body\": [\n        {\n            \"type\": \"tabs\",\n            \"source\": \"${arr}\",\n            \"tabs\": [\n                {\n                    \"title\": \"${a}\",\n                    \"body\": {\n                        \"type\": \"tpl\",\n                        \"tpl\": \"金额：${b|number}元\"\n                    }\n                }\n            ]\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%95%E7%A4%BA%E6%A8%A1%E5%BC%8F\" href=\"#%E5%B1%95%E7%A4%BA%E6%A8%A1%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>展示模式</h2><h3><a class=\"anchor\" name=\"%E7%BA%BF%E5%9E%8B\" href=\"#%E7%BA%BF%E5%9E%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>线型</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"mode\": \"line\",\n    \"tabs\": [\n        {\n            \"title\": \"选项卡1\",\n            \"body\": \"选项卡内容1\"\n        },\n        {\n            \"title\": \"选项卡2\",\n            \"body\": \"选项卡内容2\"\n        },\n        {\n            \"title\": \"选项卡3\",\n            \"body\": \"选项卡内容3\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E5%8D%A1%E7%89%87\" href=\"#%E5%8D%A1%E7%89%87\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>卡片</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"mode\": \"card\",\n    \"tabs\": [\n        {\n            \"title\": \"选项卡1\",\n            \"body\": \"选项卡内容1\"\n        },\n        {\n            \"title\": \"选项卡2\",\n            \"body\": \"选项卡内容2\"\n        },\n        {\n            \"title\": \"选项卡3\",\n            \"body\": \"选项卡内容3\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E4%BB%BF-chrome\" href=\"#%E4%BB%BF-chrome\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>仿 Chrome</h3><p>仿 Chrome tab 样式</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"mode\": \"chrome\",\n    \"tabs\": [\n        {\n            \"title\": \"选项卡1\",\n            \"body\": \"选项卡内容1\"\n        },\n        {\n            \"title\": \"选项卡2\",\n            \"body\": \"选项卡内容2\"\n        },\n        {\n            \"title\": \"选项卡3\",\n            \"body\": \"选项卡内容3\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E6%B0%B4%E5%B9%B3%E9%93%BA%E6%BB%A1\" href=\"#%E6%B0%B4%E5%B9%B3%E9%93%BA%E6%BB%A1\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>水平铺满</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"mode\": \"tiled\",\n    \"tabs\": [\n        {\n            \"title\": \"选项卡1\",\n            \"body\": \"选项卡内容1\"\n        },\n        {\n            \"title\": \"选项卡2\",\n            \"body\": \"选项卡内容2\"\n        },\n        {\n            \"title\": \"选项卡3\",\n            \"body\": \"选项卡内容3\"\n        },\n        {\n            \"title\": \"选项卡4\",\n            \"body\": \"选项卡内容4\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E9%80%89%E6%8B%A9%E5%99%A8%E5%9E%8B\" href=\"#%E9%80%89%E6%8B%A9%E5%99%A8%E5%9E%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>选择器型</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"mode\": \"radio\",\n    \"tabs\": [\n        {\n            \"title\": \"选项卡1\",\n            \"body\": \"选项卡内容1\"\n        },\n        {\n            \"title\": \"选项卡2\",\n            \"body\": \"选项卡内容2\"\n        },\n        {\n            \"title\": \"选项卡3\",\n            \"body\": \"选项卡内容3\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E5%9E%82%E7%9B%B4\" href=\"#%E5%9E%82%E7%9B%B4\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>垂直</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"mode\": \"vertical\",\n    \"tabs\": [\n        {\n            \"title\": \"选项卡1\",\n            \"body\": \"选项卡内容1\"\n        },\n        {\n            \"title\": \"选项卡2\",\n            \"body\": \"选项卡内容2\"\n        },\n        {\n            \"title\": \"选项卡3\",\n            \"body\": \"选项卡内容3\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE%E9%A1%B6%E9%83%A8%E5%B7%A5%E5%85%B7%E6%A0%8F\" href=\"#%E9%85%8D%E7%BD%AE%E9%A1%B6%E9%83%A8%E5%B7%A5%E5%85%B7%E6%A0%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置顶部工具栏</h2><p>配置<code>toolbar</code>实现顶部工具栏。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"toolbar\": [\n        {\n            \"type\": \"button\",\n            \"label\": \"按钮\",\n            \"actionType\": \"dialog\",\n            \"dialog\": {\n                \"title\": \"弹窗标题\",\n                \"body\": \"你点击了\"\n            }\n        }\n    ],\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"tab\": \"Content 1\"\n        },\n\n        {\n            \"title\": \"Tab 2\",\n            \"tab\": \"Content 2\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE-hash\" href=\"#%E9%85%8D%E7%BD%AE-hash\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置 hash</h2><p>可以在单个<code>tab</code>下，配置<code>hash</code>属性，支持地址栏<code>#xxx</code>。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"hash\": \"tab1\",\n            \"tab\": \"Content 1\"\n        },\n\n        {\n            \"title\": \"Tab 2\",\n            \"hash\": \"tab2\",\n            \"tab\": \"Content 2\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E6%9F%90%E4%B8%AA%E9%80%89%E9%A1%B9%E5%8D%A1\" href=\"#%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E6%9F%90%E4%B8%AA%E9%80%89%E9%A1%B9%E5%8D%A1\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>默认显示某个选项卡</h2><p>主要配置<code>activeKey</code>属性来实现该效果，共有下面两种方法：</p>\n<h4><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE-hash-%E5%80%BC\" href=\"#%E9%85%8D%E7%BD%AE-hash-%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置 hash 值</h4><p>支持变量，如 <code>&quot;tab${id}&quot;</code></p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"activeKey\": \"tab2\",\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"hash\": \"tab1\",\n            \"tab\": \"Content 1\"\n        },\n\n        {\n            \"title\": \"Tab 2\",\n            \"hash\": \"tab2\",\n            \"tab\": \"Content 2\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h4><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE%E7%B4%A2%E5%BC%95%E5%80%BC\" href=\"#%E9%85%8D%E7%BD%AE%E7%B4%A2%E5%BC%95%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置索引值</h4><p>单个<code>tab</code>上不要配置<code>hash</code>属性，配置需要展示的<code>tab</code>索引值，<code>0</code>代表第一个。支持变量，如<code>&quot;${id}&quot;</code></p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"activeKey\": 1,\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"tab\": \"Content 1\"\n        },\n\n        {\n            \"title\": \"Tab 2\",\n            \"tab\": \"Content 2\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%9B%BE%E6%A0%87\" href=\"#%E5%9B%BE%E6%A0%87\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>图标</h2><p>通过 icon 可以设置 tab 的图标，可以是 fontawesome 或 URL 地址。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"tabs\",\n    \"tabs\": [\n        {\n            \"title\": \"Tab 1\",\n            \"tab\": \"Content 1\",\n            \"icon\": \"https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg\"\n        },\n\n        {\n            \"title\": \"Tab 2\",\n            \"tab\": \"Content 2\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"mountonenter\" href=\"#mountonenter\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>mountOnEnter</h2><p>只有在点击卡片的时候才会渲染，在内容较多的时候可以提升性能，但第一次点击的时候会有卡顿。</p>\n<h2><a class=\"anchor\" name=\"unmountonexit\" href=\"#unmountonexit\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>unmountOnExit</h2><p>如果你想在切换 tab 时，自动销毁掉隐藏的 tab，请配置<code>&quot;unmountOnExit&quot;: true</code>。</p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;tabs&quot;</code></td>\n<td>指定为 Tabs 渲染器</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 Dom 的类名</td>\n</tr>\n<tr>\n<td>mode</td>\n<td><code>string</code></td>\n<td></td>\n<td>展示模式，取值可以是 <code>line</code>、<code>card</code>、<code>radio</code>、<code>vertical</code></td>\n</tr>\n<tr>\n<td>tabsClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>Tabs Dom 的类名</td>\n</tr>\n<tr>\n<td>tabs</td>\n<td><code>Array</code></td>\n<td></td>\n<td>tabs 内容</td>\n</tr>\n<tr>\n<td>source</td>\n<td><code>string</code></td>\n<td></td>\n<td>tabs 关联数据，关联后可以重复生成选项卡</td>\n</tr>\n<tr>\n<td>toolbar</td>\n<td><a href=\"../types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>tabs 中的工具栏</td>\n</tr>\n<tr>\n<td>toolbarClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>tabs 中工具栏的类名</td>\n</tr>\n<tr>\n<td>tabs[x].title</td>\n<td><code>string</code></td>\n<td></td>\n<td>Tab 标题</td>\n</tr>\n<tr>\n<td>tabs[x].icon</td>\n<td><code>icon</code></td>\n<td></td>\n<td>Tab 的图标</td>\n</tr>\n<tr>\n<td>tabs[x].tab</td>\n<td><a href=\"../types/schemanode\">SchemaNode</a></td>\n<td></td>\n<td>内容区</td>\n</tr>\n<tr>\n<td>tabs[x].hash</td>\n<td><code>string</code></td>\n<td></td>\n<td>设置以后将跟 url 的 hash 对应</td>\n</tr>\n<tr>\n<td>tabs[x].reload</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>设置以后内容每次都会重新渲染，对于 crud 的重新拉取很有用</td>\n</tr>\n<tr>\n<td>tabs[x].unmountOnExit</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>每次退出都会销毁当前 tab 栏内容</td>\n</tr>\n<tr>\n<td>tabs[x].className</td>\n<td><code>string</code></td>\n<td><code>&quot;bg-white b-l b-r b-b wrapper-md&quot;</code></td>\n<td>Tab 区域样式</td>\n</tr>\n<tr>\n<td>mountOnEnter</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>只有在点中 tab 的时候才渲染</td>\n</tr>\n<tr>\n<td>unmountOnExit</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>切换 tab 的时候销毁</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "展示模式",
          "fragment": "%E5%B1%95%E7%A4%BA%E6%A8%A1%E5%BC%8F",
          "fullPath": "#%E5%B1%95%E7%A4%BA%E6%A8%A1%E5%BC%8F",
          "level": 2,
          "children": [
            {
              "label": "线型",
              "fragment": "%E7%BA%BF%E5%9E%8B",
              "fullPath": "#%E7%BA%BF%E5%9E%8B",
              "level": 3
            },
            {
              "label": "卡片",
              "fragment": "%E5%8D%A1%E7%89%87",
              "fullPath": "#%E5%8D%A1%E7%89%87",
              "level": 3
            },
            {
              "label": "仿 Chrome",
              "fragment": "%E4%BB%BF-chrome",
              "fullPath": "#%E4%BB%BF-chrome",
              "level": 3
            },
            {
              "label": "水平铺满",
              "fragment": "%E6%B0%B4%E5%B9%B3%E9%93%BA%E6%BB%A1",
              "fullPath": "#%E6%B0%B4%E5%B9%B3%E9%93%BA%E6%BB%A1",
              "level": 3
            },
            {
              "label": "选择器型",
              "fragment": "%E9%80%89%E6%8B%A9%E5%99%A8%E5%9E%8B",
              "fullPath": "#%E9%80%89%E6%8B%A9%E5%99%A8%E5%9E%8B",
              "level": 3
            },
            {
              "label": "垂直",
              "fragment": "%E5%9E%82%E7%9B%B4",
              "fullPath": "#%E5%9E%82%E7%9B%B4",
              "level": 3
            }
          ]
        },
        {
          "label": "配置顶部工具栏",
          "fragment": "%E9%85%8D%E7%BD%AE%E9%A1%B6%E9%83%A8%E5%B7%A5%E5%85%B7%E6%A0%8F",
          "fullPath": "#%E9%85%8D%E7%BD%AE%E9%A1%B6%E9%83%A8%E5%B7%A5%E5%85%B7%E6%A0%8F",
          "level": 2
        },
        {
          "label": "配置 hash",
          "fragment": "%E9%85%8D%E7%BD%AE-hash",
          "fullPath": "#%E9%85%8D%E7%BD%AE-hash",
          "level": 2
        },
        {
          "label": "默认显示某个选项卡",
          "fragment": "%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E6%9F%90%E4%B8%AA%E9%80%89%E9%A1%B9%E5%8D%A1",
          "fullPath": "#%E9%BB%98%E8%AE%A4%E6%98%BE%E7%A4%BA%E6%9F%90%E4%B8%AA%E9%80%89%E9%A1%B9%E5%8D%A1",
          "level": 2,
          "children": [
            {
              "label": "配置 hash 值",
              "fragment": "%E9%85%8D%E7%BD%AE-hash-%E5%80%BC",
              "fullPath": "#%E9%85%8D%E7%BD%AE-hash-%E5%80%BC",
              "level": 4
            },
            {
              "label": "配置索引值",
              "fragment": "%E9%85%8D%E7%BD%AE%E7%B4%A2%E5%BC%95%E5%80%BC",
              "fullPath": "#%E9%85%8D%E7%BD%AE%E7%B4%A2%E5%BC%95%E5%80%BC",
              "level": 4
            }
          ]
        },
        {
          "label": "图标",
          "fragment": "%E5%9B%BE%E6%A0%87",
          "fullPath": "#%E5%9B%BE%E6%A0%87",
          "level": 2
        },
        {
          "label": "mountOnEnter",
          "fragment": "mountonenter",
          "fullPath": "#mountonenter",
          "level": 2
        },
        {
          "label": "unmountOnExit",
          "fragment": "unmountonexit",
          "fullPath": "#unmountonexit",
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
