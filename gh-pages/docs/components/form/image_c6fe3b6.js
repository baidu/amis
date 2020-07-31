amis.define('docs/components/form/image.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Image 图片",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Image",
    "icon": null,
    "order": 27,
    "html": "<p>图片格式输入，默认 amis 会直接存储在 FEX 的 hiphoto 里面，提交到 form 是直接的图片 url。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"image\",\n            \"name\": \"image\",\n            \"label\": \"image\",\n            \"reciever\": \"https://houtai.baidu.com/api/upload/file\"\n        }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E9%99%90%E5%88%B6%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B\" href=\"#%E9%99%90%E5%88%B6%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>限制文件类型</h2><p>可以配置<code>accept</code>来限制可选择的文件类型，格式是文件后缀名<code>.xxx</code></p>\n<div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"image\",\n            \"name\": \"image\",\n            \"label\": \"限制只能上传jpg图片\",\n            \"accept\": \".jpg\",\n            \"reciever\": \"https://houtai.baidu.com/api/upload/file\"\n        }\n    ]\n}\n</script></div>\n<p>想要限制多个类型，则用逗号分隔，例如：<code>.jpg,.png</code></p>\n<h2><a class=\"anchor\" name=\"%E6%94%AF%E6%8C%81%E8%A3%81%E5%89%AA\" href=\"#%E6%94%AF%E6%8C%81%E8%A3%81%E5%89%AA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>支持裁剪</h2><div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"image\",\n            \"name\": \"image\",\n            \"label\": \"限制只能上传jpg图片\",\n            \"accept\": \".jpg\",\n            \"reciever\": \"https://houtai.baidu.com/api/upload/file\",\n            \"crop\": true\n        }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>reciever</td>\n<td><a href=\"../../types/api\">API</a></td>\n<td></td>\n<td>上传文件接口</td>\n</tr>\n<tr>\n<td>accept</td>\n<td><code>string</code></td>\n<td><code>text/plain</code></td>\n<td>默认只支持<code>image/jpeg, image/jpg, image/png, image/gif</code>，要支持其他类型，请配置此属性为图片后缀<code>.xxx</code></td>\n</tr>\n<tr>\n<td>maxSize</td>\n<td><code>string</code></td>\n<td></td>\n<td>默认没有限制，当设置后，文件大小大于此值将不允许上传。单位为<code>KB</code></td>\n</tr>\n<tr>\n<td>maxLength</td>\n<td><code>number</code></td>\n<td></td>\n<td>默认没有限制，当设置后，一次只允许上传指定数量文件。</td>\n</tr>\n<tr>\n<td>multiple</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否多选。</td>\n</tr>\n<tr>\n<td>joinValues</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td><a href=\"./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues\">拼接值</a></td>\n</tr>\n<tr>\n<td>extractValue</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td><a href=\"./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue\">提取值</a></td>\n</tr>\n<tr>\n<td>delimeter</td>\n<td><code>string</code></td>\n<td><code>,</code></td>\n<td><a href=\"./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter\">拼接符</a></td>\n</tr>\n<tr>\n<td>autoUpload</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>否选择完就自动开始上传</td>\n</tr>\n<tr>\n<td>hideUploadButton</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>隐藏上传按钮</td>\n</tr>\n<tr>\n<td>fileField</td>\n<td><code>string</code></td>\n<td><code>file</code></td>\n<td>如果你不想自己存储，则可以忽略此属性。</td>\n</tr>\n<tr>\n<td>crop</td>\n<td><code>boolean</code>或<code>{&quot;aspectRatio&quot;:&quot;&quot;}</code></td>\n<td></td>\n<td>用来设置是否支持裁剪。</td>\n</tr>\n<tr>\n<td>crop.aspectRatio</td>\n<td><code>number</code></td>\n<td></td>\n<td>裁剪比例。浮点型，默认 <code>1</code> 即 <code>1:1</code>，如果要设置 <code>16:9</code> 请设置 <code>1.7777777777777777</code> 即 <code>16 / 9</code>。。</td>\n</tr>\n<tr>\n<td>limit</td>\n<td>Limit</td>\n<td></td>\n<td>限制图片大小，超出不让上传。</td>\n</tr>\n</tbody>\n</table>\n<h3><a class=\"anchor\" name=\"limit-%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#limit-%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Limit 属性表</h3><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>width</td>\n<td><code>number</code></td>\n<td></td>\n<td>限制图片宽度。</td>\n</tr>\n<tr>\n<td>height</td>\n<td><code>number</code></td>\n<td></td>\n<td>限制图片高度。</td>\n</tr>\n<tr>\n<td>minWidth</td>\n<td><code>number</code></td>\n<td></td>\n<td>限制图片最小宽度。</td>\n</tr>\n<tr>\n<td>minHeight</td>\n<td><code>number</code></td>\n<td></td>\n<td>限制图片最小高度。</td>\n</tr>\n<tr>\n<td>maxWidth</td>\n<td><code>number</code></td>\n<td></td>\n<td>限制图片最大宽度。</td>\n</tr>\n<tr>\n<td>maxHeight</td>\n<td><code>number</code></td>\n<td></td>\n<td>限制图片最大高度。</td>\n</tr>\n<tr>\n<td>aspectRatio</td>\n<td><code>number</code></td>\n<td></td>\n<td>限制图片宽高比，格式为浮点型数字，默认 <code>1</code> 即 <code>1:1</code>，如果要设置 <code>16:9</code> 请设置 <code>1.7777777777777777</code> 即 <code>16 / 9</code>。 如果不想限制比率，请设置空字符串。</td>\n</tr>\n</tbody>\n</table>\n",
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
          "label": "限制文件类型",
          "fragment": "%E9%99%90%E5%88%B6%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B",
          "fullPath": "#%E9%99%90%E5%88%B6%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B",
          "level": 2
        },
        {
          "label": "支持裁剪",
          "fragment": "%E6%94%AF%E6%8C%81%E8%A3%81%E5%89%AA",
          "fullPath": "#%E6%94%AF%E6%8C%81%E8%A3%81%E5%89%AA",
          "level": 2
        },
        {
          "label": "属性表",
          "fragment": "%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "fullPath": "#%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "level": 2,
          "children": [
            {
              "label": "Limit 属性表",
              "fragment": "limit-%E5%B1%9E%E6%80%A7%E8%A1%A8",
              "fullPath": "#limit-%E5%B1%9E%E6%80%A7%E8%A1%A8",
              "level": 3
            }
          ]
        }
      ],
      "level": 0
    }
  };

});
