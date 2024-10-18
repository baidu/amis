amis.define('docs/zh-CN/components/each.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Each 循环渲染器",
    "description": null,
    "type": 0,
    "group": "⚙ 组件",
    "menuName": "Each 循环渲染器",
    "icon": null,
    "order": 45,
    "html": "<div class=\"markdown-body\"><h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2><p>通过 name 属性指定要循环的数组，items 属性指定循环的内容。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"page\">{\n  \"type\": \"page\",\n  \"data\": {\n    \"arr\": [\"A\", \"B\", \"C\"]\n  },\n  \"body\": {\n        \"type\": \"each\",\n        \"name\": \"arr\",\n        \"items\": {\n            \"type\": \"tpl\",\n            \"tpl\": \"<span class='label label-default m-l-sm'>${item}</span> \"\n        }\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E5%A6%82%E6%9E%9C%E6%98%AF%E5%AF%B9%E8%B1%A1%E6%95%B0%E7%BB%84\" href=\"#%E5%A6%82%E6%9E%9C%E6%98%AF%E5%AF%B9%E8%B1%A1%E6%95%B0%E7%BB%84\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>如果是对象数组</h3><p>如果数组中的数据是对象，可以直接使用内部变量 xxx 来获取，或者通过 <code>item.xxxx</code>。另外能用 index 来获取数组索引。</p>\n<blockquote>\n<p>如果成员对象本身也有名字为 index 的字段就会覆盖到，获取不到索引了，请查看「循环嵌套」的章节解决</p>\n</blockquote>\n</div><div class=\"amis-preview\" style=\"min-height: 160px\"><script type=\"text/schema\" height=\"160\" scope=\"page\">{\n  \"type\": \"page\",\n  \"data\": {\n    \"arr\": [{\"name\": \"a\"}, {\"name\": \"b\"}, {\"name\": \"c\"}]\n  },\n  \"body\": {\n        \"type\": \"each\",\n        \"name\": \"arr\",\n        \"items\": {\n            \"type\": \"tpl\",\n            \"tpl\": \"<span class='label label-default m-l-sm'>${name}:${index}</span> \"\n        }\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h3><a class=\"anchor\" name=\"%E5%BE%AA%E7%8E%AF%E5%B5%8C%E5%A5%97\" href=\"#%E5%BE%AA%E7%8E%AF%E5%B5%8C%E5%A5%97\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>循环嵌套</h3><p>如果存在嵌套使用，通过默认的 <code>item</code> 或者 <code>index</code> 始终是拿的最里面那层的信息，想要获取上层 each 的信息，则需要自定义 <code>itemKeyName</code> 和 <code>indexKeyName</code> 来指定字段名。</p>\n</div><div class=\"amis-preview\" style=\"min-height: 160px\"><script type=\"text/schema\" height=\"160\" scope=\"page\">{\n  \"type\": \"page\",\n  \"data\": {\n    \"arr\": [{\"name\": \"a\", \"subList\": [\"a1\", \"a2\"]}, {\"name\": \"b\", \"subList\": [\"b1\", \"b2\"]}, {\"name\": \"c\", \"subList\": [\"c1\", \"c2\"]}]\n  },\n  \"body\": {\n        \"type\": \"each\",\n        \"name\": \"arr\",\n        \"itemKeyName\": \"itemOutter\",\n        \"indexKeyName\": \"indexOutter\",\n        \"items\": [\n            {\n                \"type\": \"tpl\",\n                \"inline\": false,\n                \"tpl\": \"<span class='label label-default m-l-sm'>${name}:${index}</span> \"\n            },\n\n            {\n                \"type\": \"each\",\n                \"name\": \"subList\",\n                \"items\": [\n                    {\n                        \"type\": \"tpl\",\n                        \"tpl\": \"<span class='label label-default m-l-sm'>${itemOutter.name}-${item}:${indexOutter}-${index}</span> \"\n                    }\n                ]\n            }\n        ]\n    }\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E7%94%A8%E4%BD%9C-field-%E6%97%B6\" href=\"#%E7%94%A8%E4%BD%9C-field-%E6%97%B6\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>用作 Field 时</h2><p>当用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中时，可以设置<code>name</code>属性，映射同名变量，然后用可以通过 <code>item</code> 变量获取单项值</p>\n<h3><a class=\"anchor\" name=\"table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B\" href=\"#table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Table 中的列类型</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"table\",\n    \"data\": {\n        \"items\": [\n            {\n                \"id\": \"1\",\n                \"each\": [\"A1\", \"B1\", \"C1\"]\n            },\n            {\n                \"id\": \"2\",\n                \"each\": [\"A2\", \"B2\", \"C2\"]\n            },\n            {\n                \"id\": \"3\",\n                \"each\": []\n            }\n        ]\n    },\n    \"columns\": [\n        {\n            \"name\": \"id\",\n            \"label\": \"Id\"\n        },\n\n        {\n            \"name\": \"each\",\n            \"label\": \"循环\",\n            \"type\": \"each\",\n            \"placeholder\": \"暂无内容\",\n            \"items\": {\n                \"type\": \"tpl\",\n                \"tpl\": \"<span class='label label-info m-l-sm'>${item}</span>\"\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<p>List 的内容、Card 卡片的内容配置同上</p>\n<h3><a class=\"anchor\" name=\"form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" href=\"#form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Form 中静态展示</h3></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n    \"type\": \"form\",\n    \"data\": {\n        \"each\": [\"A\", \"B\", \"C\"]\n    },\n    \"body\": [\n        {\n            \"type\": \"each\",\n            \"label\": \"静态展示each\",\n            \"name\": \"each\",\n            \"items\": {\n                \"type\": \"tpl\",\n                \"tpl\": \"<span class='label label-info m-l-sm'>${item}</span>\"\n            }\n        }\n    ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E4%BD%BF%E7%94%A8%E6%95%B0%E6%8D%AE%E6%98%A0%E5%B0%84\" href=\"#%E4%BD%BF%E7%94%A8%E6%95%B0%E6%8D%AE%E6%98%A0%E5%B0%84\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>使用数据映射</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"page\">{\n  \"type\": \"page\",\n  \"data\": {\n    \"arr\": [\"A\", \"B\", \"C\"]\n  },\n  \"body\": {\n        \"type\": \"each\",\n        \"source\": \"${arr}\",\n        \"items\": {\n            \"type\": \"tpl\",\n            \"tpl\": \"<span class='label label-default m-l-sm'>${item}</span> \"\n        }\n    }\n}\n</script></div><div class=\"markdown-body\">\n<p><code>name</code> 的优先级会比 <code>source</code> 更高</p>\n<h2><a class=\"anchor\" name=\"%E5%8A%A8%E6%80%81%E8%A1%A8%E5%8D%95%E9%A1%B9\" href=\"#%E5%8A%A8%E6%80%81%E8%A1%A8%E5%8D%95%E9%A1%B9\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>动态表单项</h2><blockquote>\n<p>3.5.0 版本开始支持</p>\n</blockquote>\n<p>表单项支持通过表达式配置动态表单项，可结合 <code>each</code> 组件一起使用。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"page\">{\n  \"type\": \"page\",\n  \"data\": {\n    \"arr\": [\"A\", \"B\", \"C\"]\n  },\n  \"body\": [\n    {\n        type: \"form\",\n        debug: true,\n        body: [\n            {\n                \"type\": \"each\",\n                \"source\": \"${arr}\",\n                \"items\": {\n                    \"type\": \"input-text\",\n                    \"label\": \"Input${item}\",\n                    \"name\": \"text${index}\"\n                }\n            }\n        ]\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;each&quot;</code></td>\n<td>指定为 Each 组件</td>\n</tr>\n<tr>\n<td>value</td>\n<td><code>array</code></td>\n<td><code>[]</code></td>\n<td>用于循环的值</td>\n</tr>\n<tr>\n<td>name</td>\n<td><code>string</code></td>\n<td></td>\n<td>获取数据域中变量</td>\n</tr>\n<tr>\n<td>source</td>\n<td><code>string</code></td>\n<td></td>\n<td>获取数据域中变量， 支持 <a href=\"../../docs/concepts/data-mapping\">数据映射</a></td>\n</tr>\n<tr>\n<td>items</td>\n<td><code>object</code></td>\n<td></td>\n<td>使用<code>value</code>中的数据，循环输出渲染器。</td>\n</tr>\n<tr>\n<td>placeholder</td>\n<td><code>string</code></td>\n<td></td>\n<td>当 <code>value</code> 值不存在或为空数组时的占位文本</td>\n</tr>\n<tr>\n<td>itemKeyName</td>\n<td><code>string</code></td>\n<td><code>item</code></td>\n<td>获取循环当前数组成员</td>\n</tr>\n<tr>\n<td>indexKeyName</td>\n<td><code>string</code></td>\n<td><code>index</code></td>\n<td>获取循环当前索引</td>\n</tr>\n</tbody></table>\n</div>",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "基本用法",
          "fragment": "%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "fullPath": "#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95",
          "level": 2,
          "children": [
            {
              "label": "如果是对象数组",
              "fragment": "%E5%A6%82%E6%9E%9C%E6%98%AF%E5%AF%B9%E8%B1%A1%E6%95%B0%E7%BB%84",
              "fullPath": "#%E5%A6%82%E6%9E%9C%E6%98%AF%E5%AF%B9%E8%B1%A1%E6%95%B0%E7%BB%84",
              "level": 3
            },
            {
              "label": "循环嵌套",
              "fragment": "%E5%BE%AA%E7%8E%AF%E5%B5%8C%E5%A5%97",
              "fullPath": "#%E5%BE%AA%E7%8E%AF%E5%B5%8C%E5%A5%97",
              "level": 3
            }
          ]
        },
        {
          "label": "用作 Field 时",
          "fragment": "%E7%94%A8%E4%BD%9C-field-%E6%97%B6",
          "fullPath": "#%E7%94%A8%E4%BD%9C-field-%E6%97%B6",
          "level": 2,
          "children": [
            {
              "label": "Table 中的列类型",
              "fragment": "table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B",
              "fullPath": "#table-%E4%B8%AD%E7%9A%84%E5%88%97%E7%B1%BB%E5%9E%8B",
              "level": 3
            },
            {
              "label": "Form 中静态展示",
              "fragment": "form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA",
              "fullPath": "#form-%E4%B8%AD%E9%9D%99%E6%80%81%E5%B1%95%E7%A4%BA",
              "level": 3
            }
          ]
        },
        {
          "label": "使用数据映射",
          "fragment": "%E4%BD%BF%E7%94%A8%E6%95%B0%E6%8D%AE%E6%98%A0%E5%B0%84",
          "fullPath": "#%E4%BD%BF%E7%94%A8%E6%95%B0%E6%8D%AE%E6%98%A0%E5%B0%84",
          "level": 2
        },
        {
          "label": "动态表单项",
          "fragment": "%E5%8A%A8%E6%80%81%E8%A1%A8%E5%8D%95%E9%A1%B9",
          "fullPath": "#%E5%8A%A8%E6%80%81%E8%A1%A8%E5%8D%95%E9%A1%B9",
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
