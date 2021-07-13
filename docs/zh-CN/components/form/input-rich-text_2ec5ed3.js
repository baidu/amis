amis.define('docs/zh-CN/components/form/input-rich-text.md', function(require, exports, module, define) {

  module.exports = {
    "title": "InputRichText 富文本编辑器",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "InputRichText",
    "icon": null,
    "order": 47,
    "html": "<div class=\"markdown-body\"><p>目前富文本编辑器基于两个库：<a href=\"https://froala.com/\">froala</a> 和 <a href=\"https://github.com/tinymce/tinymce\">tinymce</a>，默认使用 tinymce。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"input-rich-text\",\n            \"name\": \"rich\",\n            \"label\": \"Rich Text\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"tinymce-%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE\" href=\"#tinymce-%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>tinymce 自定义配置</h3><p>可以设置 options 属性来自定义编辑器的展现，详细配置项请参考<a href=\"https://www.tiny.cloud/docs/general-configuration-guide/basic-setup/\">官方文档</a>。</p>\n<p>注意在下面的编辑器里修改 JSON 配置后不会实时生效。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"input-rich-text\",\n            \"name\": \"rich\",\n            \"options\": {\n                \"menubar\": false,\n                \"height\": 200,\n                \"plugins\": [\n                    \"advlist autolink lists link image charmap print preview anchor\",\n                    \"searchreplace visualblocks code fullscreen\",\n                    \"insertdatetime media table paste code help wordcount\"\n                ],\n                \"toolbar\": \"undo redo | formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help\"\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%BD%BF%E7%94%A8-froala-%E7%BC%96%E8%BE%91%E5%99%A8\" href=\"#%E4%BD%BF%E7%94%A8-froala-%E7%BC%96%E8%BE%91%E5%99%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>使用 froala 编辑器</h2><p>只需要加一行 <code>&quot;vendor&quot;: &quot;froala&quot;</code> 配置就行，froala 是付费产品，需要设置 <a href=\"../../start/getting-started#richtexttoken-string\">richTextToken</a> 才能去掉水印。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n    \"body\": [\n        {\n            \"type\": \"input-rich-text\",\n            \"vendor\": \"froala\",\n            \"name\": \"rich\",\n            \"label\": \"Rich Text\"\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"froala-buttons-%E9%85%8D%E7%BD%AE%E9%A1%B9\" href=\"#froala-buttons-%E9%85%8D%E7%BD%AE%E9%A1%B9\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>froala buttons 配置项</h3><p>froala 可以通过设置 buttons 参数来控制显示哪些按钮，默认是这些：</p>\n<pre><code class=\"language-json\"><span class=\"token punctuation\">[</span>\n  <span class=\"token string\">\"paragraphFormat\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"quote\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"color\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"|\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"bold\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"italic\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"underline\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"strikeThrough\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"|\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"formatOL\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"formatUL\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"align\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"|\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"insertLink\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"insertImage\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"insertTable\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"|\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"undo\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"redo\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token string\">\"html\"</span>\n<span class=\"token punctuation\">]</span>\n</code></pre>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>当做选择器表单项使用时，除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>saveAsUbb</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否保存为 ubb 格式</td>\n</tr>\n<tr>\n<td>receiver</td>\n<td><a href=\"../../../docs/types/api\">API</a></td>\n<td></td>\n<td>默认的图片保存 API</td>\n</tr>\n<tr>\n<td>videoReceiver</td>\n<td><a href=\"../../../docs/types/api\">API</a></td>\n<td></td>\n<td>默认的视频保存 API</td>\n</tr>\n<tr>\n<td>size</td>\n<td><code>string</code></td>\n<td></td>\n<td>框的大小，可设置为 <code>md</code> 或者 <code>lg</code></td>\n</tr>\n<tr>\n<td>options</td>\n<td><code>object</code></td>\n<td></td>\n<td>需要参考 <a href=\"https://www.tiny.cloud/docs/configure/integration-and-setup/\">tinymce</a> 或 <a href=\"https://www.froala.com/wysiwyg-editor/docs/options\">froala</a> 的文档</td>\n</tr>\n<tr>\n<td>buttons</td>\n<td><code>Array&lt;string&gt;</code></td>\n<td></td>\n<td>froala 专用，配置显示的按钮，tinymce 可以通过前面的 options 设置 <a href=\"https://www.tiny.cloud/docs/demo/custom-toolbar-button/\">toolbar</a> 字符串</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基本用法",
          "fragment": "%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "fullPath": "#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "level": 2,
          "children": [
            {
              "label": "tinymce 自定义配置",
              "fragment": "tinymce-%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE",
              "fullPath": "#tinymce-%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE",
              "level": 3
            }
          ]
        },
        {
          "label": "使用 froala 编辑器",
          "fragment": "%E4%BD%BF%E7%94%A8-froala-%E7%BC%96%E8%BE%91%E5%99%A8",
          "fullPath": "#%E4%BD%BF%E7%94%A8-froala-%E7%BC%96%E8%BE%91%E5%99%A8",
          "level": 2,
          "children": [
            {
              "label": "froala buttons 配置项",
              "fragment": "froala-buttons-%E9%85%8D%E7%BD%AE%E9%A1%B9",
              "fullPath": "#froala-buttons-%E9%85%8D%E7%BD%AE%E9%A1%B9",
              "level": 3
            }
          ]
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
