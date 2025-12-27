amis.define('docs/zh-CN/components/pdf-viewer.md', function(require, exports, module, define) {

  module.exports = {
    "title": "PDF Viewer",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "PDFViewer 渲染",
    "icon": null,
    "order": 24,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"pdf-viewer\",\n  \"id\": \"pdf-viewer\",\n  \"src\": \"/examples/static/simple.pdf\",\n  \"width\": 500\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E5%90%88%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E5%AE%9E%E7%8E%B0%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD\" href=\"#%E9%85%8D%E5%90%88%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E5%AE%9E%E7%8E%B0%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配合文件上传实现预览功能</h2><p>配置和 <code>input-file</code> 相同的 <code>name</code> 即可</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"title\": \"\",\n  \"wrapWithPanel\": false,\n  \"body\": [\n    {\n      \"type\": \"input-file\",\n      \"name\": \"file\",\n      \"label\": \"File\",\n      \"asBlob\": true,\n      \"accept\": \".pdf\"\n    },\n    {\n      \"type\": \"pdf-viewer\",\n      \"id\": \"pdf-viewer\",\n      \"name\": \"file\",\n      \"width\": 500\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>src</td>\n<td>Api</td>\n<td></td>\n<td>文档地址</td>\n</tr>\n<tr>\n<td>width</td>\n<td>number</td>\n<td></td>\n<td>宽度</td>\n</tr>\n<tr>\n<td>height</td>\n<td>number</td>\n<td>-</td>\n<td>高度</td>\n</tr>\n<tr>\n<td>background</td>\n<td>string</td>\n<td>#fff</td>\n<td>PDF 背景色</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "配合文件上传实现预览功能",
          "fragment": "%E9%85%8D%E5%90%88%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E5%AE%9E%E7%8E%B0%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD",
          "fullPath": "#%E9%85%8D%E5%90%88%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0%E5%AE%9E%E7%8E%B0%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD",
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
