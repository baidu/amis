amis.define('docs/components/form/button.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Button 按钮",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Button",
    "icon": null,
    "order": 4,
    "html": "<p><code>form</code>中除了支持 <a href=\"./action\">行为按钮</a>以外，还支持一些特定的按钮。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n      {\n        \"type\": \"text\",\n        \"name\": \"name\",\n        \"label\": \"姓名：\"\n      },\n      {\n        \"type\": \"action\",\n        \"actionType\": \"dialog\",\n        \"label\": \"按钮\",\n        \"dialog\": {\n            \"title\": \"弹框标题\",\n            \"body\": \"这是一个弹框\"\n        }\n      }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E6%8F%90%E4%BA%A4%E8%A1%A8%E5%8D%95\" href=\"#%E6%8F%90%E4%BA%A4%E8%A1%A8%E5%8D%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>提交表单</h2><p>请配置<code>&quot;actionType&quot;: &quot;submit&quot;</code>或<code>&quot;type&quot;: &quot;submit&quot;</code>按钮，可以触发表单提交行为，</p>\n<div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n      {\n        \"type\": \"text\",\n        \"name\": \"name\",\n        \"label\": \"姓名：\"\n      },\n      {\n        \"type\": \"submit\",\n        \"label\": \"提交\"\n      }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E9%87%8D%E7%BD%AE%E8%A1%A8%E5%8D%95\" href=\"#%E9%87%8D%E7%BD%AE%E8%A1%A8%E5%8D%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>重置表单</h2><p>请配置<code>&quot;actionType&quot;: &quot;reset&quot;</code>或<code>&quot;type&quot;: &quot;reset&quot;</code>按钮，可以触发表单提交行为。</p>\n<div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"body\">{\n    \"type\": \"form\",\n    \"api\": \"https://houtai.baidu.com/api/mock2/form/saveForm\",\n    \"controls\": [\n      {\n        \"type\": \"text\",\n        \"name\": \"name\",\n        \"label\": \"姓名：\"\n      },\n      {\n        \"type\": \"reset\",\n        \"label\": \"重置\"\n      }\n    ]\n}\n</script></div>\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>见 <a href=\"../action\">Action 行为按钮</a></p>\n",
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
          "label": "提交表单",
          "fragment": "%E6%8F%90%E4%BA%A4%E8%A1%A8%E5%8D%95",
          "fullPath": "#%E6%8F%90%E4%BA%A4%E8%A1%A8%E5%8D%95",
          "level": 2
        },
        {
          "label": "重置表单",
          "fragment": "%E9%87%8D%E7%BD%AE%E8%A1%A8%E5%8D%95",
          "fullPath": "#%E9%87%8D%E7%BD%AE%E8%A1%A8%E5%8D%95",
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
