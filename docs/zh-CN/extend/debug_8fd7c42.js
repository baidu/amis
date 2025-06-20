amis.define('docs/zh-CN/extend/debug.md', function(require, exports, module, define) {

  module.exports = {
    "title": "调试工具",
    "html": "<div class=\"markdown-body\"><blockquote>\n<p>1.6.1 及以上版本</p>\n</blockquote>\n<p>amis 内置了调试工具，可以查看组件内部运行日志，方便分析问题，目前在文档右侧就有显示。</p>\n<h2><a class=\"anchor\" name=\"%E5%BC%80%E5%90%AF%E6%96%B9%E6%B3%95\" href=\"#%E5%BC%80%E5%90%AF%E6%96%B9%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>开启方法</h2><p>默认不会开启这个功能，可以通过下面三种方式开启：</p>\n<ol>\n<li>render 的 env 里设置 <code>enableAMISDebug</code>。</li>\n<li>配置全局变量 <code>enableAMISDebug</code> 的值为 <code>true</code>，比如 <code>window.enableAMISDebug = true</code>。</li>\n<li>在页面 URL 参数中加上 <code>amisDebug=1</code>，比如 <code>http://xxx.com/?amisDebug=1</code>。</li>\n</ol>\n<p>开启之后，在页面右侧就会显示。</p>\n<h2><a class=\"anchor\" name=\"%E7%9B%AE%E5%89%8D%E5%8A%9F%E8%83%BD\" href=\"#%E7%9B%AE%E5%89%8D%E5%8A%9F%E8%83%BD\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>目前功能</h2><p>目前 Debug 工具提供了两个功能:</p>\n<ol>\n<li>运行日志，主要是 api 及数据转换的日志</li>\n<li>查看组件数据链，Debug 工具展开后，点击任意组件就能看到这个组件的数据链</li>\n</ol>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "开启方法",
          "fragment": "%E5%BC%80%E5%90%AF%E6%96%B9%E6%B3%95",
          "fullPath": "#%E5%BC%80%E5%90%AF%E6%96%B9%E6%B3%95",
          "level": 2
        },
        {
          "label": "目前功能",
          "fragment": "%E7%9B%AE%E5%89%8D%E5%8A%9F%E8%83%BD",
          "fullPath": "#%E7%9B%AE%E5%89%8D%E5%8A%9F%E8%83%BD",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
