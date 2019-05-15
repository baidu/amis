define('docs/renderers/Image.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"image\" href=\"#image\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Image</h3><p>图片格式输入，默认 amis 会直接存储在 FEX 的 hiphoto 里面，提交到 form 是直接的图片 url。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>image</code></li>\n<li><code>reciever</code> 默认 <code>/api/upload</code> 如果想自己存储，请设置此选项。</li>\n<li><code>multiple</code> 是否多选。</li>\n<li><code>maxLength</code> 默认没有限制，当设置后，一次只允许上传指定数量文件。</li>\n<li><code>joinValues</code> 多选时是否将多个值用 <code>delimiter</code> 连接起来。</li>\n<li><code>extractValue</code> 默认为 <code>false</code>, <code>joinValues</code>设置为<code>false</code>时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。</li>\n<li><code>delimiter</code> 连接符，默认是 <code>,</code>, 多选时且 <code>joinValues</code> 为 <code>true</code> 时用来连接值。</li>\n<li><code>autoUpload</code> 是否选择完就自动开始上传？默认为 <code>true</code></li>\n<li><code>compress</code> 默认 <code>true</code> 如果想默认压缩请开启。</li>\n<li><code>compressOptions</code><ul>\n<li><code>maxWidth</code> 设置最大宽度。</li>\n<li><code>maxHeight</code> 设置最大高度。</li>\n</ul>\n</li>\n<li><code>showCompressOptions</code> 默认为 false, 开启后，允许用户输入压缩选项。</li>\n<li><code>crop</code> 用来设置是否支持裁剪。<ul>\n<li><code>aspectRatio</code> 浮点型，默认 <code>1</code> 即 <code>1:1</code>，如果要设置 <code>16:9</code> 请设置 <code>1.7777777777777777</code> 即 <code>16 / 9</code>。</li>\n</ul>\n</li>\n<li><code>allowInput</code> 默认都是通过用户选择图片后上传返回图片地址，如果开启此选项，则可以允许用户图片地址。</li>\n<li><code>limit</code> 限制图片大小，超出不让上传。<ul>\n<li><code>width</code> 限制图片宽度。</li>\n<li><code>height</code> 限制图片高度。</li>\n<li><code>minWidth</code> 限制图片最小宽度。</li>\n<li><code>minHeight</code> 限制图片最小高度。</li>\n<li><code>maxWidth</code> 限制图片最大宽度。</li>\n<li><code>maxHeight</code> 限制图片最大高度。</li>\n</ul>\n</li>\n<li>更多配置请参考 <a href=\"#/docs/renderers/FormItem\">FormItem</a></li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 450px\"><script type=\"text/schema\" height=\"450\" scope=\"form-item\">{\n  \"type\": \"image\",\n  \"name\": \"image\",\n  \"label\": \"Images\"\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Image",
          "fragment": "image",
          "fullPath": "#image",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
