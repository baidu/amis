amis.define('docs/zh-CN/components/breadcrumb.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Breadcrumb 面包屑",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Breadcrumb",
    "icon": null,
    "order": 30,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"breadcrumb\",\n  \"items\": [\n    {\n      \"label\": \"首页\",\n      \"href\": \"https://baidu.gitee.com/\",\n      \"icon\": \"fa fa-home\"\n    },\n\n    {\n      \"label\": \"上级页面\"\n    },\n\n    {\n      \"label\": \"当前页面\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE\" href=\"#%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动态数据</h2><p>可以配置 source 来获取上下文中的动态数据，结合 <a href=\"service\">service</a> 来实现动态生成。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n  \"type\": \"page\",\n  \"data\": {\n    \"breadcrumb\": [\n      {\n        \"label\": \"首页\",\n        \"href\": \"https://baidu.gitee.com/\"\n      },\n\n      {\n        \"label\": \"上级页面\"\n      },\n\n      {\n        \"label\": \"当前页面\"\n      }\n    ]\n  },\n  \"body\": {\n    \"type\": \"breadcrumb\",\n    \"source\": \"${breadcrumb}\"\n  }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%88%86%E9%9A%94%E7%AC%A6\" href=\"#%E5%88%86%E9%9A%94%E7%AC%A6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>分隔符</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"breadcrumb\",\n  \"separator\": \">\",\n  \"separatorClassName\": \"text-black\",\n  \"items\": [\n    {\n      \"href\": \"https://baidu.gitee.com/\",\n      \"icon\": \"fa fa-home\"\n    },\n\n    {\n      \"label\": \"上级页面\"\n    },\n\n    {\n      \"label\": \"当前页面\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%B8%8B%E6%8B%89%E8%8F%9C%E5%8D%95\" href=\"#%E4%B8%8B%E6%8B%89%E8%8F%9C%E5%8D%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>下拉菜单</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"breadcrumb\",\n  \"separator\": \">\",\n  \"separatorClassName\": \"text-black\",\n  \"items\": [\n    {\n      \"label\": \"首页\",\n      \"href\": \"https://baidu.gitee.com/\",\n      \"icon\": \"fa fa-home\"\n    },\n\n    {\n      \"label\": \"上级页面\",\n      \"dropdown\": [\n        {\n          \"label\": \"选项一\",\n          \"href\": \"https://baidu.gitee.com/\",\n        },\n        {\n          \"label\": \"选项二\"\n        }\n      ]\n    },\n    {\n      \"label\": \"当前页面\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%9C%80%E5%A4%A7%E5%B1%95%E7%A4%BA%E9%95%BF%E5%BA%A6\" href=\"#%E6%9C%80%E5%A4%A7%E5%B1%95%E7%A4%BA%E9%95%BF%E5%BA%A6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>最大展示长度</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"breadcrumb\",\n  \"separator\": \">\",\n  \"separatorClassName\": \"text-black\",\n  \"labelMaxLength\": 16,\n  \"tooltipPosition\": \"top\",\n  \"items\": [\n    {\n      \"href\": \"https://baidu.gitee.com/\",\n      \"icon\": \"fa fa-home\"\n    },\n\n    {\n      \"label\": \"上级页面上级页面上级页面上级页面上级页面\"\n    },\n\n    {\n      \"label\": \"当前页面\"\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层类名</td>\n</tr>\n<tr>\n<td>itemClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>导航项类名</td>\n</tr>\n<tr>\n<td>separatorClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>分割符类名</td>\n</tr>\n<tr>\n<td>dropdownClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>下拉菜单类名</td>\n</tr>\n<tr>\n<td>dropdownItemClassName</td>\n<td><code>string</code></td>\n<td></td>\n<td>下拉菜单项类名</td>\n</tr>\n<tr>\n<td>separator</td>\n<td><code>string</code></td>\n<td></td>\n<td>分隔符</td>\n</tr>\n<tr>\n<td>labelMaxLength</td>\n<td><code>number</code></td>\n<td>16</td>\n<td>最大展示长度</td>\n</tr>\n<tr>\n<td>tooltipPosition</td>\n<td><code>top | bottom | left | right</code></td>\n<td><code>top</code></td>\n<td>浮窗提示位置</td>\n</tr>\n<tr>\n<td>source</td>\n<td><code>string</code></td>\n<td></td>\n<td>动态数据</td>\n</tr>\n<tr>\n<td>items[].label</td>\n<td><code>string</code></td>\n<td></td>\n<td>文本</td>\n</tr>\n<tr>\n<td>items[].href</td>\n<td><code>string</code></td>\n<td></td>\n<td>链接</td>\n</tr>\n<tr>\n<td>items[].icon</td>\n<td><code>string</code></td>\n<td></td>\n<td><a href=\"icon\">图标</a></td>\n</tr>\n<tr>\n<td>items[].dropdown</td>\n<td><code>dropdown[]</code></td>\n<td></td>\n<td>下拉菜单，dropdown[]的每个对象都包含label、href、icon属性</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "动态数据",
          "fragment": "%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE",
          "fullPath": "#%E5%8A%A8%E6%80%81%E6%95%B0%E6%8D%AE",
          "level": 2
        },
        {
          "label": "分隔符",
          "fragment": "%E5%88%86%E9%9A%94%E7%AC%A6",
          "fullPath": "#%E5%88%86%E9%9A%94%E7%AC%A6",
          "level": 2
        },
        {
          "label": "下拉菜单",
          "fragment": "%E4%B8%8B%E6%8B%89%E8%8F%9C%E5%8D%95",
          "fullPath": "#%E4%B8%8B%E6%8B%89%E8%8F%9C%E5%8D%95",
          "level": 2
        },
        {
          "label": "最大展示长度",
          "fragment": "%E6%9C%80%E5%A4%A7%E5%B1%95%E7%A4%BA%E9%95%BF%E5%BA%A6",
          "fullPath": "#%E6%9C%80%E5%A4%A7%E5%B1%95%E7%A4%BA%E9%95%BF%E5%BA%A6",
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
