amis.define('docs/zh-CN/components/form/input-verification-code.md', function(require, exports, module, define) {

  module.exports = {
    "title": "验证码输入 InputVerificationCode",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "InputVerificationCode 验证码",
    "icon": null,
    "order": 63,
    "html": "<div class=\"markdown-body\"><p>注意 InputVerificationCode, 可通过<b>粘贴</b>完成填充数据。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><p>基本用法。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"debug\": true,\n  \"body\": [\n    {\n      \"type\": \"input-verification-code\",\n      \"name\": \"verificationCode\"\n    },\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%AF%86%E7%A0%81%E6%A8%A1%E5%BC%8F\" href=\"#%E5%AF%86%E7%A0%81%E6%A8%A1%E5%BC%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>密码模式</h2><p>指定 masked = true，可开启密码模式。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"debug\": true,\n  \"body\": [\n    {\n      \"type\": \"input-verification-code\",\n      \"name\": \"verificationCode\",\n      \"masked\": true,\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%86%E9%9A%94%E7%AC%A6\" href=\"#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%86%E9%9A%94%E7%AC%A6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>自定义分隔符</h2><p>指定 separator 可以自定义渲染分隔符。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"debug\": true,\n  \"body\": [\n    {\n      \"type\": \"input-verification-code\",\n      \"name\": \"verificationCode\",\n      \"length\": 9,\n      \"separator\": \"${((index + 1) % 3 || index > 7 ) ? null : '-'}\",\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E7%8A%B6%E6%80%81\" href=\"#%E7%8A%B6%E6%80%81\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>状态</h2><p>指定 disabled = true，可开启禁用模式。</p>\n指定 readOnly = true，可开启只读模式。\n\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"debug\": true,\n  \"body\": [\n    {\n      \"type\": \"input-verification-code\",\n      \"name\": \"verificationCodeDisabled\",\n      \"value\": \"123456\",\n      \"disabled\": true,\n    },\n    {\n      \"type\": \"input-verification-code\",\n      \"name\": \"verificationCodeReadOnly\",\n      \"value\": \"987654\",\n      \"readOnly\": true,\n    }\n  ]\n}\n\n\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>当做选择器表单项使用时，除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>length</td>\n<td><code>number</code></td>\n<td>6</td>\n<td>验证码的长度，根据长度渲染对应个数的输入框</td>\n</tr>\n<tr>\n<td>masked</td>\n<td><code>boolean</code></td>\n<td>false</td>\n<td>是否是密码模式</td>\n</tr>\n<tr>\n<td>separator</td>\n<td><code>string</code></td>\n<td></td>\n<td>分隔符，支持表达式, 表达式<code>只</code>可以访问 index、character 变量, 参考自定义分隔符</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E4%BA%8B%E4%BB%B6%E8%A1%A8\" href=\"#%E4%BA%8B%E4%BB%B6%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>事件表</h2><p>当前组件会对外派发以下事件，可以通过<code>onEvent</code>来监听这些事件。</p>\n<table>\n<thead>\n<tr>\n<th>事件名称</th>\n<th>事件参数</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>finish</td>\n<td>-</td>\n<td>输入框都被填充后触发的回调</td>\n</tr>\n<tr>\n<td>change</td>\n<td>-</td>\n<td>输入值改变时触发的回调</td>\n</tr>\n</tbody></table>\n<h3><a class=\"anchor\" name=\"%E4%BA%8B%E4%BB%B6\" href=\"#%E4%BA%8B%E4%BB%B6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>事件</h3><p>finish 输入框都被填充。可以尝试通过<code>${event.data.value}</code>获取填写的数据。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"input-verification-code\",\n  \"onEvent\": {\n    \"finish\": {\n      \"actions\": [\n        {\n          \"actionType\": \"toast\",\n          \"args\": {\n            \"msgType\": \"info\",\n            \"msg\": \"${event.data.value}\"\n          }\n        }\n      ]\n    }\n  }\n}\n</script></div><div class=\"markdown-body\">\n<p>change 输入值改变。可以尝试通过<code>${event.data.value}</code>获取填写的数据。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"input-verification-code\",\n  \"onEvent\": {\n    \"change\": {\n      \"actions\": [\n        {\n          \"actionType\": \"toast\",\n          \"args\": {\n            \"msgType\": \"info\",\n            \"msg\": \"${event.data.value}\"\n          }\n        }\n      ]\n    }\n  }\n}\n</script></div><div class=\"markdown-body\">\n</div>",
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
          "label": "密码模式",
          "fragment": "%E5%AF%86%E7%A0%81%E6%A8%A1%E5%BC%8F",
          "fullPath": "#%E5%AF%86%E7%A0%81%E6%A8%A1%E5%BC%8F",
          "level": 2
        },
        {
          "label": "自定义分隔符",
          "fragment": "%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%86%E9%9A%94%E7%AC%A6",
          "fullPath": "#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%86%E9%9A%94%E7%AC%A6",
          "level": 2
        },
        {
          "label": "状态",
          "fragment": "%E7%8A%B6%E6%80%81",
          "fullPath": "#%E7%8A%B6%E6%80%81",
          "level": 2
        },
        {
          "label": "属性表",
          "fragment": "%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "fullPath": "#%E5%B1%9E%E6%80%A7%E8%A1%A8",
          "level": 2
        },
        {
          "label": "事件表",
          "fragment": "%E4%BA%8B%E4%BB%B6%E8%A1%A8",
          "fullPath": "#%E4%BA%8B%E4%BB%B6%E8%A1%A8",
          "level": 2,
          "children": [
            {
              "label": "事件",
              "fragment": "%E4%BA%8B%E4%BB%B6",
              "fullPath": "#%E4%BA%8B%E4%BB%B6",
              "level": 3
            }
          ]
        }
      ],
      "level": 0
    }
  };

});
