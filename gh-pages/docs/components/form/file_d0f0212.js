amis.define('docs/components/form/file.md', function(require, exports, module, define) {

  module.exports = {
    "title": "File 文件上传",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "File",
    "icon": null,
    "order": 21,
    "html": "<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><p>用来负责文件上传，文件上传成功后会返回文件地址，这个文件地址会作为这个表单项的值，整个表单提交的时候，其实提交的是文件地址，文件上传已经在这个控件中完成了。</p>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"file\",\n            \"name\": \"file\",\n            \"label\": \"File\",\n            \"accept\": \"*\",\n            \"reciever\": \"https://houtai.baidu.com/api/upload/file\"\n        }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E9%99%90%E5%88%B6%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B\" href=\"#%E9%99%90%E5%88%B6%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>限制文件类型</h2><p>可以配置<code>accept</code>来限制可选择的文件类型，格式是文件后缀名<code>.xxx</code></p>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n        {\n            \"type\": \"file\",\n            \"name\": \"file\",\n            \"label\": \"限制只能上传csv文件\",\n            \"accept\": \".csv\",\n            \"reciever\": \"https://houtai.baidu.com/api/upload/file\"\n        }\n    ]\n}\n</script></div>\n<p>想要限制多个类型，则用逗号分隔，例如：<code>.csv,.md</code></p>\n<h2><a class=\"anchor\" name=\"%E6%89%8B%E5%8A%A8%E4%B8%8A%E4%BC%A0\" href=\"#%E6%89%8B%E5%8A%A8%E4%B8%8A%E4%BC%A0\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>手动上传</h2><p>如果不希望 File 组件上传，可以配置 <code>asBlob</code> 或者 <code>asBase64</code>，采用这种方式后，组件不再自己上传了，而是直接把文件数据作为表单项的值，文件内容会在 Form 表单提交的接口里面一起带上。</p>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"debug\": true,\n    \"controls\": [\n        {\n            \"type\": \"file\",\n            \"name\": \"file\",\n            \"label\": \"File\",\n            \"accept\": \"*\",\n            \"asBlob\": true\n        }\n    ]\n}\n</script></div>\n<p>上例中，选择任意文件，然后观察数据域变化；点击提交，amis 自动会调整接口数据格式为<code>FormData</code></p>\n<h2><a class=\"anchor\" name=\"%E5%88%86%E5%9D%97%E4%B8%8A%E4%BC%A0\" href=\"#%E5%88%86%E5%9D%97%E4%B8%8A%E4%BC%A0\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>分块上传</h2><p>如果文件过大，则可能需要使用分块上传</p>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>reciever</td>\n<td><a href=\"../../types/api\">API</a></td>\n<td></td>\n<td>上传文件接口</td>\n</tr>\n<tr>\n<td>accept</td>\n<td><code>string</code></td>\n<td><code>text/plain</code></td>\n<td>默认只支持纯文本，要支持其他类型，请配置此属性为文件后缀<code>.xxx</code></td>\n</tr>\n<tr>\n<td>asBase64</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>将文件以<code>base64</code>的形式，赋值给当前组件</td>\n</tr>\n<tr>\n<td>asBlob</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>将文件以二进制的形式，赋值给当前组件</td>\n</tr>\n<tr>\n<td>maxSize</td>\n<td><code>string</code></td>\n<td></td>\n<td>默认没有限制，当设置后，文件大小大于此值将不允许上传。单位为<code>KB</code></td>\n</tr>\n<tr>\n<td>maxLength</td>\n<td><code>number</code></td>\n<td></td>\n<td>默认没有限制，当设置后，一次只允许上传指定数量文件。</td>\n</tr>\n<tr>\n<td>multiple</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否多选。</td>\n</tr>\n<tr>\n<td>joinValues</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td><a href=\"./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues\">拼接值</a></td>\n</tr>\n<tr>\n<td>extractValue</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td><a href=\"./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue\">提取值</a></td>\n</tr>\n<tr>\n<td>delimeter</td>\n<td><code>string</code></td>\n<td><code>,</code></td>\n<td><a href=\"./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter\">拼接符</a></td>\n</tr>\n<tr>\n<td>autoUpload</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>否选择完就自动开始上传</td>\n</tr>\n<tr>\n<td>hideUploadButton</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>隐藏上传按钮</td>\n</tr>\n<tr>\n<td>stateTextMap</td>\n<td>object</td>\n<td><code>{ init: &#39;&#39;, pending: &#39;等待上传&#39;, uploading: &#39;上传中&#39;, error: &#39;上传出错&#39;, uploaded: &#39;已上传&#39;, ready: &#39;&#39; }</code></td>\n<td>上传状态文案</td>\n</tr>\n<tr>\n<td>fileField</td>\n<td><code>string</code></td>\n<td><code>file</code></td>\n<td>如果你不想自己存储，则可以忽略此属性。</td>\n</tr>\n<tr>\n<td>downloadUrl</td>\n<td><code>boolean</code>或<code>string</code></td>\n<td><code>&quot;&quot;</code></td>\n<td>默认显示文件路径的时候会支持直接下载，可以支持加前缀如：<code>http://xx.dom/filename=</code> ，如果不希望这样，可以把当前配置项设置为 <code>false</code>。</td>\n</tr>\n<tr>\n<td>useChunk</td>\n<td><code>boolean</code>或<code>&quot;auto&quot;</code></td>\n<td><code>&quot;auto&quot;</code></td>\n<td>amis 所在服务器，限制了文件上传大小不得超出 10M，所以 amis 在用户选择大文件的时候，自动会改成分块上传模式。</td>\n</tr>\n<tr>\n<td>chunkSize</td>\n<td><code>number</code></td>\n<td><code>5 * 1024 * 1024</code></td>\n<td>分块大小</td>\n</tr>\n<tr>\n<td>startChunkApi</td>\n<td><a href=\"../../types/api\">API</a></td>\n<td></td>\n<td>startChunkApi</td>\n</tr>\n<tr>\n<td>chunkApi</td>\n<td><a href=\"../../types/api\">API</a></td>\n<td></td>\n<td>chunkApi</td>\n</tr>\n<tr>\n<td>finishChunkApi</td>\n<td><a href=\"../../types/api\">API</a></td>\n<td></td>\n<td>finishChunkApi</td>\n</tr>\n</tbody>\n</table>\n",
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
          "label": "手动上传",
          "fragment": "%E6%89%8B%E5%8A%A8%E4%B8%8A%E4%BC%A0",
          "fullPath": "#%E6%89%8B%E5%8A%A8%E4%B8%8A%E4%BC%A0",
          "level": 2
        },
        {
          "label": "分块上传",
          "fragment": "%E5%88%86%E5%9D%97%E4%B8%8A%E4%BC%A0",
          "fullPath": "#%E5%88%86%E5%9D%97%E4%B8%8A%E4%BC%A0",
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
