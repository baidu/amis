amis.define('docs/zh-CN/extend/mobile.md', function(require, exports, module, define) {

  module.exports = {
    "title": "移动端定制",
    "html": "<div class=\"markdown-body\"><p>有时候我们需要在移动端下展示不同效果，可以通过 <code>mobile</code> 属性来在移动端下覆盖部分属性。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [{\n    \"name\": \"email\",\n    \"type\": \"input-email\",\n    \"label\": \"邮箱：\",\n    \"mobile\": {\n      \"name\": \"phone\",\n      \"type\": \"text\",\n      \"label\": \"电话：\",\n      \"validations\": {\n        \"isPhoneNumber\": true\n      }\n    }\n  }]\n}\n</script></div><div class=\"markdown-body\">\n<p>请点击上方切换到移动端预览效果。</p>\n<p><code>mobile</code> 属性可以出现在配置中的任意地方，替换父节点的任意属性，比如前面的例子可以写成放在 <code>form</code> 上替换所有 <code>body</code></p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [{\n    \"name\": \"email\",\n    \"type\": \"input-email\",\n    \"label\": \"邮箱：\"\n  }],\n  \"mobile\": {\n    \"body\": [{\n      \"name\": \"phone\",\n      \"type\": \"input-text\",\n      \"label\": \"电话：\",\n      \"validations\": {\n        \"isPhoneNumber\": true\n      }\n    }]\n  }\n}\n</script></div><div class=\"markdown-body\">\n<blockquote>\n<p>注意这里对于移动端的判断是根据页面宽度，和 CSS 保持一致，所以即便是在 PC 上，如果页面宽度很小也会切换到 mobile 配置</p>\n</blockquote>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [],
      "level": 0
    }
  };

});
