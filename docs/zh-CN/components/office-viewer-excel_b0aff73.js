amis.define('docs/zh-CN/components/office-viewer-excel.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Office Viewer Excel",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "OfficeViewer Excel 渲染",
    "icon": null,
    "order": 24,
    "html": "<div class=\"markdown-body\"><blockquote>\n<p>6.3 及以上版本</p>\n</blockquote>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"office-viewer\",\n  \"src\": \"/examples/static/all.xlsx\",\n  \"excelOptions\": {\n    \"height\": 500\n  }\n}\n</script></div><div class=\"markdown-body\">\n<p>除了 <code>xlsx</code>，也支持后缀为 <code>csv</code> 及 <code>tsv</code> 的文件</p>\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE%E9%A1%B9\" href=\"#%E9%85%8D%E7%BD%AE%E9%A1%B9\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置项</h2><p>由于接口可能有变化，这里只列出少量配置项，后续补充</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"office-viewer\",\n  \"excelOptions\": {\n    \"showSheetTabBar\": false,\n    \"showFormulaBar\": false\n  },\n  \"src\": \"/examples/static/all.xlsx\"\n}\n</script></div><div class=\"markdown-body\">\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>showFormulaBar</td>\n<td><code>boolean</code></td>\n<td>true</td>\n<td>是否显示公式拦</td>\n</tr>\n<tr>\n<td>showSheetTabBar</td>\n<td><code>boolean</code></td>\n<td>true</td>\n<td>是否显示底部 sheet 切换</td>\n</tr>\n<tr>\n<td>fontURL</td>\n<td><code>object</code></td>\n<td></td>\n<td>字体地址，参考下面的说明</td>\n</tr>\n</tbody></table>\n<h2><a class=\"anchor\" name=\"%E5%AD%97%E4%BD%93%E9%85%8D%E7%BD%AE\" href=\"#%E5%AD%97%E4%BD%93%E9%85%8D%E7%BD%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>字体配置</h2><p>由于浏览器中缺少特定字体，将展现会不一致，这些字体都是有版权的，因此本项目中不提供，需要自行准备，然后配置 <code>fontURL</code> 映射到对应的地址，渲染时就会加载。</p>\n<p>类似如下配置</p>\n<pre><code class=\"language-json\"><span class=\"token punctuation\">{</span>\n  <span class=\"token property\">\"type\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"office-viewer\"</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"excelOptions\"</span><span class=\"token operator\">:</span> <span class=\"token punctuation\">{</span>\n    <span class=\"token property\">\"fontURL\"</span><span class=\"token operator\">:</span> <span class=\"token punctuation\">{</span>\n      <span class=\"token property\">\"等线\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"/static/font/DengXian.ttf\"</span><span class=\"token punctuation\">,</span>\n      <span class=\"token property\">\"仿宋\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"/static/font/STFANGSO.TTF\"</span><span class=\"token punctuation\">,</span>\n      <span class=\"token property\">\"黑体\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"/static/font/simhei.ttf\"</span>\n    <span class=\"token punctuation\">}</span>\n  <span class=\"token punctuation\">}</span><span class=\"token punctuation\">,</span>\n  <span class=\"token property\">\"src\"</span><span class=\"token operator\">:</span> <span class=\"token string\">\"/examples/static/all.xlsx\"</span>\n<span class=\"token punctuation\">}</span>\n</code></pre>\n</div>",
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
          "label": "配置项",
          "fragment": "%E9%85%8D%E7%BD%AE%E9%A1%B9",
          "fullPath": "#%E9%85%8D%E7%BD%AE%E9%A1%B9",
          "level": 2
        },
        {
          "label": "字体配置",
          "fragment": "%E5%AD%97%E4%BD%93%E9%85%8D%E7%BD%AE",
          "fullPath": "#%E5%AD%97%E4%BD%93%E9%85%8D%E7%BD%AE",
          "level": 2
        }
      ],
      "level": 0
    }
  };

});
