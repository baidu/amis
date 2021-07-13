amis.define('docs/zh-CN/style/index.md', function(require, exports, module, define) {

  module.exports = {
    "title": "快速开始",
    "html": "<div class=\"markdown-body\"><blockquote>\n<p>这是 1.1.0 版本中新增的功能</p>\n</blockquote>\n<p>在 amis 中自定义样式有四种方式：</p>\n<ol>\n<li>使用 CSS 变量动态修改，通过这种方式修改大部分 amis 组件的样式，所有组件都会生效，注意这种方法不支持 IE11。</li>\n<li>使用辅助 class，可以对单个组件做定制修改。</li>\n<li>自己生成主题 CSS，可以修改所有配置，目前只能通过源码方式，请参考 <code>scss\\themes\\default.scss</code> 文件，修改变量后重新编译一个 css，需要注意这种方式在更新 amis 版本的时候最好重新编译，否则就会出现使用旧版 css 的情况，可能导致出错，因此不推荐使用。</li>\n<li><code>wrapper</code> 组件可以直接写内嵌 <code>style</code>。</li>\n</ol>\n<p>本文主要介绍前两种方法：</p>\n<h2><a class=\"anchor\" name=\"css-%E5%8F%98%E9%87%8F\" href=\"#css-%E5%8F%98%E9%87%8F\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>CSS 变量</h2><p>在 page 下可以设置 cssVars 属性，通过它来动态修改 amis 内的 css 变量。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"type\": \"page\",\n  \"cssVars\": {\n    \"--text-color\": \"#CD3632\",\n    \"--primary\": \"#CD3632\",\n    \"--primary-onHover\": \"#F23F3A\",\n    \"--primary-onActive\": \"#BB312D\"\n  },\n  \"body\": {\n    \"type\": \"form\",\n    \"body\": [\n      {\n        \"type\": \"input-text\",\n        \"label\": \"文本\",\n        \"name\": \"text\"\n      },\n      {\n        \"type\": \"input-password\",\n        \"label\": \"密码\",\n        \"name\": \"password\"\n      }\n    ]\n  }\n}\n</script></div><div class=\"markdown-body\">\n<p>具体有哪些变量请参考左侧的 <a href=\"css-vars\">CSS 变量</a> 说明。</p>\n<h2><a class=\"anchor\" name=\"%E8%BE%85%E5%8A%A9-class\" href=\"#%E8%BE%85%E5%8A%A9-class\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>辅助 class</h2><p>辅助 class 参考自<a href=\"https://tailwindcss.com/\">tailwindcss</a>, 做了精简，把一些不常用的剔除了，响应式方面只保留 pc 和手机两种，css 未压缩版本大概是 800K 左右，比 tailwind 要小很多。</p>\n<p>使用方法：</p>\n<ul>\n<li>JS SDK<ul>\n<li>引入 sdk 中的文件 <code>&lt;link rel=&quot;stylesheet&quot; href=&quot;sdk/ helper.css&quot; /&gt;</code></li>\n</ul>\n</li>\n<li>React<ul>\n<li><code>import &#39;amis/lib/ helper.css&#39;</code>;</li>\n</ul>\n</li>\n</ul>\n<p>目前这个文件没有和主题文件合并在一起，用户可以选择性加载。</p>\n<p>大部分 amis 组件都有 <code>className</code> 或者 <code>xxxClassName</code> 的配置，比如下面的配置给表单增加了边框、圆角和阴影</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"panelClassName\": \"border-solid border-2 border-blue-500 rounded-xl shadow-lg\",\n  \"body\": [\n    {\n      \"type\": \"input-text\",\n      \"className\": \"text-green-700\",\n      \"label\": \"文本框\",\n      \"name\": \"text\"\n    },\n    {\n      \"type\": \"input-password\",\n      \"label\": \"密码\",\n      \"name\": \"password\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<p>还可以：</p>\n<ul>\n<li>通过 <code>flex</code> <code>flex-shrink-0</code> 来设置布局方式。</li>\n<li>通过 <code>bg-blue-100</code> <code>bg-white</code> 之类的类名设置背景色。</li>\n<li>通过 <code>shadow-md</code> 设置投影。</li>\n<li>通过 <code>rounded-xl</code> 设置圆角。</li>\n<li>通过 <code>text-xl</code>、<code>font-medium</code> 设置字体大小粗细。</li>\n<li>等等。。</li>\n</ul>\n<p>具体用法请查看左边的文档列表。</p>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "CSS 变量",
          "fragment": "css-%E5%8F%98%E9%87%8F",
          "fullPath": "#css-%E5%8F%98%E9%87%8F",
          "level": 2
        },
        {
          "label": "辅助 class",
          "fragment": "%E8%BE%85%E5%8A%A9-class",
          "fullPath": "#%E8%BE%85%E5%8A%A9-class",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
