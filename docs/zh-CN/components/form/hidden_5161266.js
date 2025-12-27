amis.define('docs/zh-CN/components/form/hidden.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Hidden 隐藏字段",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Hidden 隐藏字段",
    "icon": null,
    "order": 26,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><p>默认表单提交，在没有 <a href=\"../../../docs/types/api#%E9%85%8D%E7%BD%AE%E8%AF%B7%E6%B1%82%E6%95%B0%E6%8D%AE\">自定义 API 请求数据</a> 的情况下，只会发送 <code>body</code> 里面的这些成员，对于隐藏的字段同时又希望提交表单的时候带过去，可以使用 <code>hidden</code> 组件</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"api\": \"https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm\",\n  \"debug\": true,\n  \"body\": [\n    {\n      \"type\": \"hidden\",\n      \"name\": \"id\",\n      \"value\": 1\n    },\n    {\n      \"type\": \"input-text\",\n      \"name\": \"name\",\n      \"label\": \"姓名：\"\n    },\n    {\n      \"name\": \"email\",\n      \"type\": \"input-email\",\n      \"label\": \"邮箱：\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基本用法",
          "fragment": "%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "fullPath": "#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
