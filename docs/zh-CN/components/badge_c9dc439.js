amis.define('docs/zh-CN/components/badge.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Badge 角标",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Badge",
    "icon": null,
    "order": 30,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><p>部分组件可以设置 <code>badge</code> 属性来显示角标，目前只支持头像组件，后续将增加更多组件。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"avatar\",\n    \"badge\": {\n      \"mode\": \"text\",\n      \"text\": 10\n    }\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%98%BE%E7%A4%BA%E6%96%87%E5%AD%97%E6%88%96%E6%95%B0%E5%80%BC\" href=\"#%E6%98%BE%E7%A4%BA%E6%96%87%E5%AD%97%E6%88%96%E6%95%B0%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>显示文字或数值</h2><p>设置 <code>mode</code> 为 <code>text</code>，通过 <code>text</code> 属性来显示文字或数字，数值为零的时候将不显示。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"avatar\",\n    \"badge\": {\n      \"mode\": \"text\",\n      \"text\": 10\n    }\n  },\n  {\n    \"type\": \"avatar\",\n    \"className\": \"m-l\",\n    \"badge\": {\n      \"mode\": \"text\",\n      \"text\": 0\n    }\n  },\n  {\n    \"type\": \"avatar\",\n    \"className\": \"m-l\",\n    \"badge\": {\n      \"mode\": \"text\",\n      \"text\": \"new\"\n    }\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%98%BE%E7%A4%BA%E4%BD%8D%E7%BD%AE\" href=\"#%E6%98%BE%E7%A4%BA%E4%BD%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>显示位置</h2><p>通过 <code>position</code> 来控制角标显示位置，默认 <code>top-right</code>，还可以设置为 <code>top-left</code>、<code>bottom-left</code>、<code>bottom-right</code>。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"avatar\",\n    \"badge\": {\n      \"position\": \"top-left\"\n    }\n  },\n  {\n    \"type\": \"avatar\",\n    \"className\": \"m-l\",\n    \"badge\": {\n      \"position\": \"bottom-left\"\n    }\n  },\n  {\n    \"type\": \"avatar\",\n    \"className\": \"m-l\",\n    \"badge\": {\n      \"position\": \"bottom-right\"\n    }\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E6%80%81%E6%95%B0%E5%AD%97\" href=\"#%E5%8A%A8%E6%80%81%E6%95%B0%E5%AD%97\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动态数字</h2><p><code>text</code> 可以取上下文变量。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"data\": {\n    \"myData\": 10\n  },\n  \"type\": \"page\",\n  \"body\": [\n    {\n      \"type\": \"avatar\",\n      \"badge\": {\n        \"mode\": \"text\",\n        \"visibleOn\": \"this.myData > 1\",\n        \"text\": \"${myData}\"\n      }\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E6%80%81%E6%8E%A7%E5%88%B6%E6%98%AF%E5%90%A6%E6%98%BE%E7%A4%BA%E8%A7%92%E6%A0%87\" href=\"#%E5%8A%A8%E6%80%81%E6%8E%A7%E5%88%B6%E6%98%AF%E5%90%A6%E6%98%BE%E7%A4%BA%E8%A7%92%E6%A0%87\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动态控制是否显示角标</h2><p>角标可以直接写表达式来判断是否显示</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"data\": {\n    \"myData\": 10\n  },\n  \"type\": \"page\",\n  \"body\": [\n    {\n      \"type\": \"avatar\",\n      \"badge\": \"this.myData > 1\"\n    },\n    {\n      \"type\": \"avatar\",\n      \"className\": \"m-l\",\n      \"badge\": \"this.myData > 10\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<p>还可以通过 <code>visibleOn</code> 表达式来动态控制，这样还能设置其他属性</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"data\": {\n    \"myData\": 10\n  },\n  \"type\": \"page\",\n  \"body\": [\n    {\n      \"type\": \"avatar\",\n      \"badge\": {\n        \"visibleOn\": \"this.myData > 1\"\n      }\n    },\n    {\n      \"type\": \"avatar\",\n      \"className\": \"m-l\",\n      \"badge\": {\n        \"visibleOn\": \"this.myData > 10\"\n      }\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%AE%BE%E7%BD%AE%E5%A4%A7%E5%B0%8F\" href=\"#%E8%AE%BE%E7%BD%AE%E5%A4%A7%E5%B0%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>设置大小</h2><p>通过 <code>size</code> 来控制大小</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"avatar\",\n    \"badge\": {\n      \"mode\": \"text\",\n      \"text\": 10,\n      \"size\": 20\n    }\n  },\n  {\n    \"type\": \"avatar\",\n    \"className\": \"m-l\"，\n    \"badge\": {\n      \"mode\": \"text\",\n      \"text\": 10,\n      \"size\": 12\n    }\n  },\n  {\n    \"type\": \"avatar\",\n    \"className\": \"m-l\"\n    \"badge\": {\n      \"size\": 12\n    }\n  },\n  {\n    \"type\": \"avatar\",\n    \"className\": \"m-l\",\n    \"badge\": {\n      \"size\": 4\n    }\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F\" href=\"#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>自定义样式</h2><p>通过 <code>style</code> 来控制展现样式，比如背景及文字的颜色</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"avatar\",\n    \"badge\": {\n      \"mode\": \"text\",\n      \"text\": 10,\n      \"style\": {\n        \"background\": \"#46C93A\"\n      }\n    }\n  },\n  {\n    \"type\": \"avatar\",\n    \"className\": \"m-l\",\n    \"badge\": {\n      \"mode\": \"text\",\n      \"text\": 10,\n      \"style\": {\n        \"background\": \"#1A5CFF\"\n      }\n    }\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 dom 的类名</td>\n</tr>\n<tr>\n<td>text</td>\n<td><code>text</code></td>\n<td></td>\n<td>数字</td>\n</tr>\n<tr>\n<td>mode</td>\n<td><code>string</code></td>\n<td></td>\n<td>角标类型，可以是 dot/text</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 dom 的类名</td>\n</tr>\n<tr>\n<td>style</td>\n<td><code>object</code></td>\n<td></td>\n<td>角标的自定义样式</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "显示文字或数值",
          "fragment": "%E6%98%BE%E7%A4%BA%E6%96%87%E5%AD%97%E6%88%96%E6%95%B0%E5%80%BC",
          "fullPath": "#%E6%98%BE%E7%A4%BA%E6%96%87%E5%AD%97%E6%88%96%E6%95%B0%E5%80%BC",
          "level": 2
        },
        {
          "label": "显示位置",
          "fragment": "%E6%98%BE%E7%A4%BA%E4%BD%8D%E7%BD%AE",
          "fullPath": "#%E6%98%BE%E7%A4%BA%E4%BD%8D%E7%BD%AE",
          "level": 2
        },
        {
          "label": "动态数字",
          "fragment": "%E5%8A%A8%E6%80%81%E6%95%B0%E5%AD%97",
          "fullPath": "#%E5%8A%A8%E6%80%81%E6%95%B0%E5%AD%97",
          "level": 2
        },
        {
          "label": "动态控制是否显示角标",
          "fragment": "%E5%8A%A8%E6%80%81%E6%8E%A7%E5%88%B6%E6%98%AF%E5%90%A6%E6%98%BE%E7%A4%BA%E8%A7%92%E6%A0%87",
          "fullPath": "#%E5%8A%A8%E6%80%81%E6%8E%A7%E5%88%B6%E6%98%AF%E5%90%A6%E6%98%BE%E7%A4%BA%E8%A7%92%E6%A0%87",
          "level": 2
        },
        {
          "label": "设置大小",
          "fragment": "%E8%AE%BE%E7%BD%AE%E5%A4%A7%E5%B0%8F",
          "fullPath": "#%E8%AE%BE%E7%BD%AE%E5%A4%A7%E5%B0%8F",
          "level": 2
        },
        {
          "label": "自定义样式",
          "fragment": "%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F",
          "fullPath": "#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A0%B7%E5%BC%8F",
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
