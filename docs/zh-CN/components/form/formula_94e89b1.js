amis.define('docs/zh-CN/components/form/formula.md', function(require, exports, module, define) {

  module.exports = {
    "title": "Formula 公式",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "Formula",
    "icon": null,
    "order": 22,
    "html": "<div class=\"markdown-body\"><p>可以设置公式，将公式结果设置到指定表单项上。</p>\n<blockquote>\n<p>该表单项是隐藏的</p>\n</blockquote>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [\n  {\n    \"type\": \"input-number\",\n    \"name\": \"a\",\n    \"label\": \"A\"\n  },\n  {\n    \"type\": \"input-number\",\n    \"name\": \"b\",\n    \"label\": \"B\"\n  },\n  {\n    \"type\": \"input-number\",\n    \"name\": \"sum\",\n    \"label\": \"和\",\n    \"disabled\": true,\n    \"description\": \"自动计算 A + B\"\n  },\n  {\n    \"type\": \"formula\",\n    \"name\": \"sum\",\n    \"value\": 0,\n    \"formula\": \"a + b\"\n  }\n]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E8%87%AA%E5%8A%A8%E5%BA%94%E7%94%A8\" href=\"#%E8%87%AA%E5%8A%A8%E5%BA%94%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>自动应用</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [\n    {\n        \"type\": \"input-number\",\n        \"name\": \"a\",\n        \"label\": \"A\"\n    },\n    {\n        \"type\": \"input-number\",\n        \"name\": \"b\",\n        \"label\": \"B\"\n    },\n    {\n        \"type\": \"input-number\",\n        \"name\": \"sum\",\n        \"label\": \"和\",\n        \"disabled\": true,\n        \"description\": \"自动计算 A + B\"\n    },\n    {\n        \"type\": \"formula\",\n        \"name\": \"sum\",\n        \"value\": 0,\n        \"formula\": \"a + b\"\n    }\n]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%89%8B%E5%8A%A8%E5%BA%94%E7%94%A8\" href=\"#%E6%89%8B%E5%8A%A8%E5%BA%94%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>手动应用</h2><p>配置<code>&quot;autoSet&quot;: false</code>，然后按钮上配置<code>target</code>，配置值为<code>formula</code>的<code>id</code>值，就可以实现手动触发公式应用</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [\n    {\n        \"type\": \"input-number\",\n        \"name\": \"a\",\n        \"label\": \"A\"\n    },\n    {\n        \"type\": \"input-number\",\n        \"name\": \"b\",\n        \"label\": \"B\"\n    },\n    {\n        \"type\": \"group\",\n        \"body\": [\n            {\n                \"type\": \"input-number\",\n                \"name\": \"sum\",\n                \"label\": \"和\",\n                \"disabled\": true,\n                \"columnClassName\": \"col-sm-11\"\n            },\n            {\n                \"type\": \"button\",\n                \"label\": \"计算\",\n                \"columnClassName\": \"col-sm-1 v-bottom\",\n                \"target\": \"theFormula\"\n            }\n        ]\n    },\n    {\n        \"type\": \"formula\",\n        \"name\": \"sum\",\n        \"id\": \"theFormula\",\n        \"value\": 0,\n        \"formula\": \"a + b\",\n        \"initSet\": false,\n        \"autoSet\": false\n    }\n]\n}\n</script></div><div class=\"markdown-body\">\n<blockquote>\n<p>为什么设置<code>id</code>而不是设置<code>name</code>?</p>\n<p>因为<code>name</code>值已经用来设置目标变量名了，这个表单项肯定已经存在了，所以不是唯一了，不能够被按钮指定。</p>\n</blockquote>\n<h2><a class=\"anchor\" name=\"%E6%9D%A1%E4%BB%B6%E5%BA%94%E7%94%A8\" href=\"#%E6%9D%A1%E4%BB%B6%E5%BA%94%E7%94%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>条件应用</h2><p>可以配置<code>condition</code>用来指定作用条件，有两种写法：</p>\n<ul>\n<li>用 tpl 语法，把关联的字段写上如： <code>${xxx} ${yyy}</code> 意思是当 xxx 和 yyy 的取值结果变化了就再应用一次公式结果。</li>\n<li>自己写判断如: <code>this.xxx == &quot;a&quot; &amp;&amp; this.xxx !== this.__prev.xxx</code> 当 xxx 变化了，且新的值是字符 &quot;a&quot; 时应用，可以写更加复杂的判断。</li>\n</ul>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"body\": [\n    {\n      \"type\": \"radios\",\n      \"name\": \"radios\",\n      \"label\": \"radios\",\n      \"options\": [\n        {\n          \"label\": \"a\",\n          \"value\": \"a\"\n        },\n        {\n          \"label\": \"b\",\n          \"value\": \"b\"\n        }\n      ],\n      \"description\": \"radios 变化会自动清空 B\"\n    },\n    {\n      \"type\": \"input-text\",\n      \"name\": \"b\",\n      \"label\": \"B\"\n    },\n    {\n      \"type\": \"formula\",\n      \"name\": \"b\",\n      \"value\": \"some string\",\n      \"formula\": \"''\",\n      \"condition\": \"${radios}\",\n      \"initSet\": false\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>name</td>\n<td><code>string</code></td>\n<td></td>\n<td>需要应用的表单项<code>name</code>值，公式结果将作用到此处指定的变量中去。</td>\n</tr>\n<tr>\n<td>formula</td>\n<td><a href=\"../../../docs/concepts/expression\">表达式</a></td>\n<td></td>\n<td>应用的公式</td>\n</tr>\n<tr>\n<td>condition</td>\n<td><a href=\"../../../docs/concepts/expression\">表达式</a></td>\n<td></td>\n<td>公式作用条件</td>\n</tr>\n<tr>\n<td>initSet</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>初始化时是否设置</td>\n</tr>\n<tr>\n<td>autoSet</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>观察公式结果，如果计算结果有变化，则自动应用到变量上</td>\n</tr>\n<tr>\n<td>id</td>\n<td><code>boolean</code></td>\n<td><code>true</code></td>\n<td>定义个名字，当某个按钮的目标指定为此值后，会触发一次公式应用。这个机制可以在 <code>autoSet</code> 为 false 时用来手动触发</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "自动应用",
          "fragment": "%E8%87%AA%E5%8A%A8%E5%BA%94%E7%94%A8",
          "fullPath": "#%E8%87%AA%E5%8A%A8%E5%BA%94%E7%94%A8",
          "level": 2
        },
        {
          "label": "手动应用",
          "fragment": "%E6%89%8B%E5%8A%A8%E5%BA%94%E7%94%A8",
          "fullPath": "#%E6%89%8B%E5%8A%A8%E5%BA%94%E7%94%A8",
          "level": 2
        },
        {
          "label": "条件应用",
          "fragment": "%E6%9D%A1%E4%BB%B6%E5%BA%94%E7%94%A8",
          "fullPath": "#%E6%9D%A1%E4%BB%B6%E5%BA%94%E7%94%A8",
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
