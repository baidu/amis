amis.define('docs/zh-CN/components/form/control.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Control 表单项包裹",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Control",
    "icon": null,
    "order": 24,
    "html": "<div class=\"markdown-body\"><p>展示类的组件，如果直接放在表单项里面，不会有 <code>label</code> 和 <code>description</code> 之类的信息展示。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"mode\": \"horizontal\",\n  \"body\": [\n    {\n        \"type\": \"input-text\",\n        \"label\": \"文本输入\"\n    },\n\n    {\n      \"type\": \"image\",\n      \"src\": \"https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80\"\n    },\n\n    {\n        \"type\": \"qr-code\",\n        \"codeSize\": 128,\n        \"backgroundColor\": \"#108cee\",\n        \"foregroundColor\": \"#000\",\n        \"value\": \"https://www.baidu.com\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<p>如果想像文本输入框一样，可以配置 <code>label</code> 和 <code>description</code>，则可以通过这个组件包裹一下。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"mode\": \"horizontal\",\n  \"body\": [\n    {\n        \"type\": \"input-text\",\n        \"label\": \"文本输入\"\n    },\n\n    {\n        \"type\": \"control\",\n        \"label\": \"图片\",\n        body: [\n          {\n            \"type\": \"image\",\n            \"src\": \"https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80\"\n          }\n        ]\n    },\n\n    {\n        \"type\": \"control\",\n        \"label\": \"二维码\",\n        \"description\": \"还可以来点描述\",\n        body: [\n          {\n              \"type\": \"qr-code\",\n              \"codeSize\": 128,\n              \"backgroundColor\": \"#108cee\",\n              \"foregroundColor\": \"#000\",\n              \"value\": \"https://www.baidu.com\"\n          }\n        ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [],
      "level": 0
    }
  };

});
