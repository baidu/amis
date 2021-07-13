amis.define('docs/zh-CN/components/avatar.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Avatar 头像",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Avatar 头像",
    "icon": null,
    "order": 27,
    "html": "<div class=\"markdown-body\"><p>用来显示用户头像</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" href=\"#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本使用</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"avatar\",\n  \"src\": \"https://suda.cdn.bcebos.com/images/amis/ai-fake-face.jpg\"\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%96%87%E5%AD%97\" href=\"#%E6%96%87%E5%AD%97\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>文字</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"avatar\",\n  \"text\": \"AM\"\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%9B%BE%E6%A0%87\" href=\"#%E5%9B%BE%E6%A0%87\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>图标</h2><p>通过 icon 设置图标</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"avatar\",\n  \"icon\": \"fa fa-user\"\n}\n</script></div><div class=\"markdown-body\">\n<blockquote>\n<p>如果同时存在 src、text 和 icon，会优先用 src、接着 text、最后 icon</p>\n</blockquote>\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E6%80%81%E5%9B%BE%E7%89%87%E6%88%96%E6%96%87%E5%AD%97\" href=\"#%E5%8A%A8%E6%80%81%E5%9B%BE%E7%89%87%E6%88%96%E6%96%87%E5%AD%97\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动态图片或文字</h2><p>src、text 都支持变量，可以从上下文中动态获取图片或文字，下面的例子中第一个获取到了，而第二个没获取到，因此降级为显示 icon</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"data\": {\n    \"myAvatar\": \"https://suda.cdn.bcebos.com/images/amis/ai-fake-face.jpg\"\n  },\n  \"type\": \"page\",\n  \"body\": [\n    {\n      \"type\": \"avatar\",\n      \"icon\": \"fa fa-user\",\n      \"src\": \"$myAvatar\"\n    },\n    {\n      \"type\": \"avatar\",\n      \"icon\": \"fa fa-user\",\n      \"src\": \"$other\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%96%B9%E5%BD%A2%E5%92%8C%E5%9C%86%E8%A7%92%E5%BD%A2\" href=\"#%E6%96%B9%E5%BD%A2%E5%92%8C%E5%9C%86%E8%A7%92%E5%BD%A2\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>方形和圆角形</h2><p>可以通过 shape 改成方形或圆角形</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"avatar\",\n    \"shape\": \"square\",\n    \"text\": \"AM\"\n  },\n  {\n    \"type\": \"avatar\",\n    \"shape\": \"rounded\",\n    \"text\": \"AM\",\n    \"style\": {\n      \"marginLeft\": \"10px\"\n    }\n  }\n]\n\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%A4%A7%E5%B0%8F\" href=\"#%E5%A4%A7%E5%B0%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>大小</h2><p>通过 size 可以控制头像的大小</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"avatar\",\n    \"size\": 20,\n    \"src\": \"https://suda.cdn.bcebos.com/images/amis/ai-fake-face.jpg\"\n  },\n  {\n    \"type\": \"avatar\",\n    \"size\": 60,\n    \"src\": \"https://suda.cdn.bcebos.com/images/amis/ai-fake-face.jpg\"\n  }\n]\n\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%9B%BE%E7%89%87%E6%8B%89%E4%BC%B8%E6%96%B9%E5%BC%8F\" href=\"#%E5%9B%BE%E7%89%87%E6%8B%89%E4%BC%B8%E6%96%B9%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>图片拉伸方式</h2><p>通过 <code>fit</code> 可以控制图片拉伸方式，默认是 <code>cover</code>，具体细节可以参考 MDN <a href=\"https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit\">文档</a></p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">[\n  {\n    \"type\": \"avatar\",\n    \"fit\": \"cover\",\n    \"src\": \"https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg\"\n  },\n  {\n    \"type\": \"avatar\",\n    \"fit\": \"fill\",\n    \"src\": \"https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg\"\n  },\n  {\n    \"type\": \"avatar\",\n    \"fit\": \"contain\",\n    \"src\": \"https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg\"\n  },\n  {\n    \"type\": \"avatar\",\n    \"fit\": \"none\",\n    \"src\": \"https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg\"\n  },\n    {\n    \"type\": \"avatar\",\n    \"fit\": \"scale-down\",\n    \"src\": \"https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg\"\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%A0%B7%E5%BC%8F\" href=\"#%E6%A0%B7%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>样式</h2><p>可以通过 style 来控制背景及文字颜色</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"avatar\",\n  \"text\": \"AM\",\n  \"style\": {\n    \"background\": \"#DB3E35\",\n    \"color\": \"#FFFFFF\"\n  }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 dom 的类名</td>\n</tr>\n<tr>\n<td>fit</td>\n<td><code>string</code></td>\n<td>cover</td>\n<td>图片缩放类型</td>\n</tr>\n<tr>\n<td>src</td>\n<td><code>string</code></td>\n<td></td>\n<td>图片地址</td>\n</tr>\n<tr>\n<td>text</td>\n<td><code>string</code></td>\n<td></td>\n<td>文字</td>\n</tr>\n<tr>\n<td>icon</td>\n<td><code>string</code></td>\n<td></td>\n<td>图标</td>\n</tr>\n<tr>\n<td>shape</td>\n<td><code>string</code></td>\n<td>circle</td>\n<td>形状，也可以是 square</td>\n</tr>\n<tr>\n<td>size</td>\n<td><code>number</code></td>\n<td>40</td>\n<td>大小</td>\n</tr>\n<tr>\n<td>style</td>\n<td><code>object</code></td>\n<td></td>\n<td>外层 dom 的样式</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "文字",
          "fragment": "%E6%96%87%E5%AD%97",
          "fullPath": "#%E6%96%87%E5%AD%97",
          "level": 2
        },
        {
          "label": "图标",
          "fragment": "%E5%9B%BE%E6%A0%87",
          "fullPath": "#%E5%9B%BE%E6%A0%87",
          "level": 2
        },
        {
          "label": "动态图片或文字",
          "fragment": "%E5%8A%A8%E6%80%81%E5%9B%BE%E7%89%87%E6%88%96%E6%96%87%E5%AD%97",
          "fullPath": "#%E5%8A%A8%E6%80%81%E5%9B%BE%E7%89%87%E6%88%96%E6%96%87%E5%AD%97",
          "level": 2
        },
        {
          "label": "方形和圆角形",
          "fragment": "%E6%96%B9%E5%BD%A2%E5%92%8C%E5%9C%86%E8%A7%92%E5%BD%A2",
          "fullPath": "#%E6%96%B9%E5%BD%A2%E5%92%8C%E5%9C%86%E8%A7%92%E5%BD%A2",
          "level": 2
        },
        {
          "label": "大小",
          "fragment": "%E5%A4%A7%E5%B0%8F",
          "fullPath": "#%E5%A4%A7%E5%B0%8F",
          "level": 2
        },
        {
          "label": "图片拉伸方式",
          "fragment": "%E5%9B%BE%E7%89%87%E6%8B%89%E4%BC%B8%E6%96%B9%E5%BC%8F",
          "fullPath": "#%E5%9B%BE%E7%89%87%E6%8B%89%E4%BC%B8%E6%96%B9%E5%BC%8F",
          "level": 2
        },
        {
          "label": "样式",
          "fragment": "%E6%A0%B7%E5%BC%8F",
          "fullPath": "#%E6%A0%B7%E5%BC%8F",
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
