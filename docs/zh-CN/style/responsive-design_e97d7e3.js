amis.define('docs/zh-CN/style/responsive-design.md', function(require, exports, module, define) {

  module.exports = {
    "title": "辅助类 - 响应式设计",
    "html": "<div class=\"markdown-body\"><p>响应式设计目前只支持 pc 端和手机端，其他设备目前不支持，貌似也没必要支持。当什么前缀都不加时，就是给所有视图模式添加样式，包括移动端和 pc 端。如果你在 css 类名前面再加个 <code>m:</code> 前缀，就是专门给手机端设置样式。如果你在类名前面加个 <code>pc:</code> 前缀，则是给桌面端设置样式。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"tpl\",\n  \"className\": \"text-blue-500 m:text-red-500\",\n  \"tpl\": \"这段文字在 pc 端是蓝色的，在移动端则是是红色的。\"\n}\n</script></div><div class=\"markdown-body\">\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [],
      "level": 0
    }
  };

});
