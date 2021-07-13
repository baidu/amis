amis.define('docs/zh-CN/components/icon.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Icon 图标",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Icon",
    "icon": null,
    "order": 50,
    "html": "<div class=\"markdown-body\"><blockquote>\n<p>在 React 项目中使用 Icon 需要引入 <code>@fortawesome/fontawesome-free</code>，然后在代码中 <code>import &#39;@fortawesome/fontawesome-free/css/all.css&#39;</code>，还有相关的 webpack 配置，具体请参考 <a href=\"https://github.com/aisuda/amis-react-starter\">amis-react-starter</a> 里的配置</p>\n</blockquote>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" href=\"#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本使用</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"icon\",\n        \"icon\": \"cloud\"\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%A2%9C%E8%89%B2%E5%8F%8A%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4\" href=\"#%E9%A2%9C%E8%89%B2%E5%8F%8A%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>颜色及大小调整</h2><p>icon 基于字体实现，所以可以通过<a href=\"../../../style/typography/text-color\">文字颜色</a>或<a href=\"../../../style/typography/font-size\">大小</a>来控制它。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"icon\",\n        \"icon\": \"cloud\",\n        \"className\": \"text-info text-xl\"\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%BD%BF%E7%94%A8%E5%9B%BE%E6%A0%87%E9%93%BE%E6%8E%A5\" href=\"#%E4%BD%BF%E7%94%A8%E5%9B%BE%E6%A0%87%E9%93%BE%E6%8E%A5\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>使用图标链接</h2><p>icon 还可以使用 URL 地址，可以从 <a href=\"https://www.iconfont.cn/\">iconfont</a> 等网站下载图表的 svg 文件上传到服务器，然后使用对应的地址，比如</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"icon\",\n        \"icon\": \"https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg\"\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>icon</code></td>\n<td>指定组件类型</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>icon</td>\n<td><code>string</code></td>\n<td></td>\n<td>icon 名，支持 fontawesome v4 或使用 url</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "颜色及大小调整",
          "fragment": "%E9%A2%9C%E8%89%B2%E5%8F%8A%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4",
          "fullPath": "#%E9%A2%9C%E8%89%B2%E5%8F%8A%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4",
          "level": 2
        },
        {
          "label": "使用图标链接",
          "fragment": "%E4%BD%BF%E7%94%A8%E5%9B%BE%E6%A0%87%E9%93%BE%E6%8E%A5",
          "fullPath": "#%E4%BD%BF%E7%94%A8%E5%9B%BE%E6%A0%87%E9%93%BE%E6%8E%A5",
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
