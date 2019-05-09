define('docs/renderers/Formula.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"formula\" href=\"#formula\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Formula</h3><p>公式类型，可以设置公式，并将结果设置给目标值。</p>\n<ul>\n<li><code>type</code> 请设置成 <code>formula</code></li>\n<li><code>name</code> 这是变量名，公式结果将作用到此处指定的变量中去。</li>\n<li><code>formula</code> 公式。如： <code>data.var_a + 2</code>，其实就是 JS 表达式。</li>\n<li><code>condition</code> 作用条件。有两种写法<ul>\n<li>用 tpl 语法，把关联的字段写上如： <code>${xxx} ${yyy}</code> 意思是当 xxx 和 yyy 的取值结果变化了就再应用一次公式结果。</li>\n<li>自己写判断如: <code>data.xxx == &quot;a&quot; &amp;&amp; data.xxx !== data.__prev.xxx</code> 当 xxx 变化了，且新的值是字符 &quot;a&quot; 时应用，可以写更加复杂的判断。</li>\n</ul>\n</li>\n<li><code>initSet</code> 初始化时是否设置。默认是 <code>true</code></li>\n<li><code>autoSet</code> 观察公式结果，如果计算结果有变化，则自动应用到变量上。默认为 <code>true</code>。</li>\n<li><code>id</code> 定义个名字，当某个按钮的目标指定为此值后，会触发一次公式应用。这个机制可以在 <code>autoSet</code> 为 false 时用来手动触发。<blockquote>\n<p>为什么不是设置 <code>name</code>?\n因为 name 值已经用来设置目标变量名了，这个表单项肯定已经存在了，所以不是唯一了，不能够被按钮指定。</p>\n</blockquote>\n</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 500px\"><script type=\"text/schema\" height=\"500\" scope=\"form\">[\n  {\n    \"type\": \"number\",\n    \"name\": \"a\",\n    \"label\": \"A\"\n  },\n  {\n    \"type\": \"number\",\n    \"name\": \"b\",\n    \"label\": \"B\"\n  },\n  {\n    \"type\": \"number\",\n    \"name\": \"sum\",\n    \"label\": \"和\",\n    \"disabled\": true,\n    \"description\": \"自动计算 A + B\"\n  },\n  {\n    \"type\": \"formula\",\n    \"name\": \"sum\",\n    \"value\": 0,\n    \"formula\": \"a + b\"\n  }\n]\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Formula",
          "fragment": "formula",
          "fullPath": "#formula",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
