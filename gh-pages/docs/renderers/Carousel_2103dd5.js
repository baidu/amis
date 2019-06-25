define('docs/renderers/Carousel.md', function(require, exports, module) {

  module.exports = {
    "html": "<h2><a class=\"anchor\" name=\"carousel\" href=\"#carousel\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Carousel</h2><p>轮播图</p>\n<ul>\n<li><code>type</code> 请设置成 <code>carousel</code></li>\n<li><code>className</code> 外层 Dom 的类名</li>\n<li><code>options</code> 轮播面板数据，默认<code>[]</code>，支持以下模式<ul>\n<li>图片<ul>\n<li><code>image</code> 图片链接</li>\n<li><code>imageClassName</code> 图片类名</li>\n<li><code>title</code> 图片标题</li>\n<li><code>titleClassName</code> 图片标题类名</li>\n<li><code>description</code> 图片描述</li>\n<li><code>descriptionClassName</code> 图片描述类名</li>\n</ul>\n</li>\n<li><code>html</code> HTML 自定义，同<a href=\"/amis/docs/renderers/Tpl\">Tpl</a>一致</li>\n</ul>\n</li>\n<li><code>itemSchema</code> 自定义<code>schema</code>来展示数据</li>\n<li><code>auto</code> 是否自动轮播，默认<code>true</code></li>\n<li><code>interval</code> 切换动画间隔，默认<code>5s</code></li>\n<li><code>duration</code> 切换动画时长，默认<code>0.5s</code></li>\n<li><code>width</code> 宽度，默认<code>auto</code></li>\n<li><code>height</code> 高度，默认<code>200px</code></li>\n<li><code>controls</code> 显示左右箭头、底部圆点索引，默认<code>[&#39;dots&#39;, &#39;arrows&#39;]</code></li>\n<li><code>controlsTheme</code> 左右箭头、底部圆点索引颜色，默认<code>light</code>，另有<code>dark</code>模式</li>\n<li><code>animation</code> 切换动画效果，默认<code>fade</code>，另有<code>slide</code>模式</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 550px\"><script type=\"text/schema\" height=\"550\" scope=\"body\">{\n    \"type\": \"carousel\",\n    \"controlTheme\": \"light\",\n    \"height\": \"300\",\n    \"animation\": \"slide\",\n    \"options\": [\n        {\n            \"image\": \"https://video-react.js.org/assets/poster.png\"\n        },\n        {\n            \"html\": \"<div style=\\\"width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;\\\">carousel data</div>\"\n        },\n        {\n            \"image\": \"https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg\"\n        }\n    ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Carousel",
          "fragment": "carousel",
          "fullPath": "#carousel",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
