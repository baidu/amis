amis.define('docs/zh-CN/components/number.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Number 数字展示",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Number",
    "icon": null,
    "order": 39,
    "html": "<div class=\"markdown-body\"><p>用于展示数字</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" href=\"#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本使用</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"number\",\n        \"value\": \"1591326307\",\n        \"kilobitSeparator\": true\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E9%85%8D%E7%BD%AE%E7%B2%BE%E5%BA%A6\" href=\"#%E9%85%8D%E7%BD%AE%E7%B2%BE%E5%BA%A6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>配置精度</h2><p>配置 <code>precision</code> 属性来控制小数点位数</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": {\n        \"type\": \"number\",\n        \"value\": 13525646.295,\n        \"precision\": 2\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E7%99%BE%E5%88%86%E6%AF%94%E5%B1%95%E7%A4%BA\" href=\"#%E7%99%BE%E5%88%86%E6%AF%94%E5%B1%95%E7%A4%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>百分比展示</h2><p>配置 <code>percent</code> 来开启百分比展示，这个属性同时控制小数位数，如果是 <code>true</code> 则表示小数点位数为 <code>0</code>。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": [\n      {\n          \"type\": \"number\",\n          \"value\": 0.8965,\n          \"percent\": true\n      },\n\n      {\n        type: 'divider'\n      },\n      {\n          \"type\": \"number\",\n          \"value\": 0.8965,\n          \"percent\": 1\n      }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%89%8D%E7%BC%80-%E5%90%8E%E7%BC%80\" href=\"#%E5%89%8D%E7%BC%80-%E5%90%8E%E7%BC%80\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>前缀、后缀</h2><p>配置 <code>prefix</code> 或者 <code>affix</code> 来控制前缀后缀，可以用来实现单位效果。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": [\n      {\n          \"type\": \"number\",\n          \"value\": 1589.98,\n          \"prefix\": '￥'\n      },\n\n      {\n        type: 'divider'\n      },\n\n      {\n          \"type\": \"number\",\n          \"value\": 1589.98,\n          \"affix\": '公里'\n      }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"inputnumber-%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" href=\"#inputnumber-%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>inputNumber 静态展示</h2><p>inputNumber 配置 <code>static</code> 为 <code>true</code> 也会通过此组件来展示</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\" undefined>{\n    \"type\": \"page\",\n    \"body\": [\n      {\n          \"type\": \"input-number\",\n          \"mode\": \"horizontal\",\n          \"label\": \"数字1\",\n          \"name\": \"num\",\n          \"static\": true,\n          \"value\": 1589.98,\n          \"precision\": 2,\n          \"prefix\": '￥'\n      },\n\n      {\n          \"type\": \"input-number\",\n          \"mode\": \"horizontal\",\n          \"label\": \"数字2\",\n          \"name\": \"num2\",\n          \"static\": true,\n          \"precision\": 2,\n          \"prefix\": '￥'\n      },\n\n      {\n          \"type\": \"input-number\",\n          \"mode\": \"horizontal\",\n          \"label\": \"数字3\",\n          \"name\": \"num3\",\n          \"static\": true,\n          \"placeholder\": \"无\"\n      }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td></td>\n<td>如果在 Table、Card 和 List 中，为<code>&quot;number&quot;</code>；在 Form 中用作静态展示，为<code>&quot;static-number&quot;</code> 或者 <code>input-number</code> 配置 static 属性</td>\n</tr>\n<tr>\n<td>className</td>\n<td><code>string</code></td>\n<td></td>\n<td>外层 CSS 类名</td>\n</tr>\n<tr>\n<td>value</td>\n<td><code>string</code></td>\n<td></td>\n<td>数值</td>\n</tr>\n<tr>\n<td>name</td>\n<td><code>string</code></td>\n<td></td>\n<td>在其他组件中，时，用作变量映射</td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td><code>-</code></td>\n<td>占位内容</td>\n</tr>\n<tr>\n<td>kilobitSeparator</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>是否千分位展示</td>\n</tr>\n<tr>\n<td>precision</td>\n<td><code>number</code></td>\n<td></td>\n<td>用来控制小数点位数</td>\n</tr>\n<tr>\n<td>percent</td>\n<td><code>boolean</code> | <code>number</code></td>\n<td></td>\n<td>是否用百分比展示，如果是数字，还可以控制百分比小数点位数</td>\n</tr>\n<tr>\n<td>prefix</td>\n<td><code>string</code></td>\n<td></td>\n<td>前缀</td>\n</tr>\n<tr>\n<td>affix</td>\n<td><code>string</code></td>\n<td></td>\n<td>后缀</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基本使用",
          "fragment": "%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8",
          "fullPath": "#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8",
          "level": 2
        },
        {
          "label": "配置精度",
          "fragment": "%E9%85%8D%E7%BD%AE%E7%B2%BE%E5%BA%A6",
          "fullPath": "#%E9%85%8D%E7%BD%AE%E7%B2%BE%E5%BA%A6",
          "level": 2
        },
        {
          "label": "百分比展示",
          "fragment": "%E7%99%BE%E5%88%86%E6%AF%94%E5%B1%95%E7%A4%BA",
          "fullPath": "#%E7%99%BE%E5%88%86%E6%AF%94%E5%B1%95%E7%A4%BA",
          "level": 2
        },
        {
          "label": "前缀、后缀",
          "fragment": "%E5%89%8D%E7%BC%80-%E5%90%8E%E7%BC%80",
          "fullPath": "#%E5%89%8D%E7%BC%80-%E5%90%8E%E7%BC%80",
          "level": 2
        },
        {
          "label": "inputNumber 静态展示",
          "fragment": "inputnumber-%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA",
          "fullPath": "#inputnumber-%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA",
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
