define('docs/renderers/Rich-Text.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"rich-text\" href=\"#rich-text\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Rich-Text</h3><p>富文本编辑器</p>\n<ul>\n<li><code>type</code> 请设置成 <code>rich-text</code></li>\n<li><code>saveAsUbb</code> 是否保存为 ubb 格式</li>\n<li><code>reciever</code> 默认的图片保存 API <code>/api/upload/image</code></li>\n<li><code>size</code> 框的大小，可以设置成 <code>md</code> 或者 <code>lg</code> 来增大输入框。</li>\n<li><p><code>buttons</code> 默认为</p>\n<pre><code class=\"lang-js\">[\n    <span class=\"hljs-symbol\">'paragraphFormat</span>',\n    <span class=\"hljs-symbol\">'quote</span>',\n    <span class=\"hljs-symbol\">'color</span>',\n    '|',\n    <span class=\"hljs-symbol\">'bold</span>',\n    <span class=\"hljs-symbol\">'italic</span>',\n    <span class=\"hljs-symbol\">'underline</span>',\n    <span class=\"hljs-symbol\">'strikeThrough</span>',\n    '|',\n    <span class=\"hljs-symbol\">'formatOL</span>',\n    <span class=\"hljs-symbol\">'formatUL</span>',\n    <span class=\"hljs-symbol\">'align</span>',\n    '|',\n    <span class=\"hljs-symbol\">'insertLink</span>',\n    <span class=\"hljs-symbol\">'insertImage</span>',\n    <span class=\"hljs-symbol\">'insertTable</span>',\n    '|',\n    <span class=\"hljs-symbol\">'undo</span>',\n    <span class=\"hljs-symbol\">'redo</span>',\n    <span class=\"hljs-symbol\">'html</span>',\n]<span class=\"hljs-comment\">;</span>\n</code></pre>\n</li>\n<li><p><code>options</code> Object 类型，给富文本的配置信息。请参考 <a href=\"https://www.froala.com/wysiwyg-editor/docs/options\">https://www.froala.com/wysiwyg-editor/docs/options</a></p>\n</li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"form-item\">{\n  \"type\": \"rich-text\",\n  \"name\": \"html\",\n  \"label\": \"Rich Text\"\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Rich-Text",
          "fragment": "rich-text",
          "fullPath": "#rich-text",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
