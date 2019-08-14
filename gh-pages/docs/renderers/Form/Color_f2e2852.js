define('docs/renderers/Form/Color.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"color\" href=\"#color\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Color</h3><p>颜色选择器。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>color</code></li>\n<li><code>format</code> 请选择 <code>hex</code>、<code>hls</code>、<code>rgb</code>或者<code>rgba</code>。默认为 <code>hex</code>。</li>\n<li><code>presetColors</code> 选择器底部的默认颜色<ul>\n<li>默认为<code>[&#39;#D0021B&#39;, &#39;#F5A623&#39;, &#39;#F8E71C&#39;, &#39;#8B572A&#39;, &#39;#7ED321&#39;, &#39;#417505&#39;, &#39;#BD10E0&#39;, &#39;#9013FE&#39;, &#39;#4A90E2&#39;, &#39;#50E3C2&#39;, &#39;#B8E986&#39;, &#39;#000000&#39;, &#39;#4A4A4A&#39;, &#39;#9B9B9B&#39;, &#39;#FFFFFF&#39;]</code>，数组内为空则不显示默认颜色</li>\n</ul>\n</li>\n<li><code>clearable</code> 是否显示清除按钮。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 600px\"><script type=\"text/schema\" height=\"600\" scope=\"form-item\">{\n  \"type\": \"color\",\n  \"name\": \"color\",\n  \"label\": \"颜色\"\n}\n</script></div>\n\n\n<div class=\"m-t-lg b-l b-info b-3x wrapper bg-light dk\">文档内容有误？欢迎大家一起来编写，文档地址：<i class=\"fa fa-github\"></i><a href=\"https://github.com/baidu/amis/tree/master/docs/renderers/Form/Color.md\">/docs/renderers/Form/Color.md</a>。</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Color",
          "fragment": "color",
          "fullPath": "#color",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
