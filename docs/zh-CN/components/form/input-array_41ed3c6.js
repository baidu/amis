amis.define('docs/zh-CN/components/form/input-array.md', function(require, exports, module, define) {

  module.exports = {
    "title": "InputArray 数组输入框",
    "description": null,
    "type": 0,
    "group": null,
    "menuName": "InputArray 数组输入框",
    "icon": null,
    "order": 3,
    "html": "<div class=\"markdown-body\"><p>InputArray 是一种简化的 <a href=\"./combo\">Combo</a>，用于输入多个某种类型的<a href=\"./formitem\">表单项</a>，提交的时将以数组的形式提交。</p>\n<h2><a class=\"anchor\" name=\"%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" href=\"#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>基本用法</h2></div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"form2\">[\n  {\n    \"name\": \"array\",\n    \"label\": \"颜色集合\",\n    \"type\": \"input-array\",\n    \"value\": [\"red\"],\n    \"inline\": true,\n    \"items\": {\n      \"type\": \"input-color\",\n      \"clearable\": false\n    }\n  }\n]\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E6%96%B0%E5%A2%9E%E6%88%90%E5%91%98%E9%BB%98%E8%AE%A4%E5%80%BC\" href=\"#%E6%96%B0%E5%A2%9E%E6%88%90%E5%91%98%E9%BB%98%E8%AE%A4%E5%80%BC\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>新增成员默认值</h2><p>部分情况下，期望新增元素时使用默认值，这时可以通过设置<code>scaffold</code>属性配置新增成员的默认值。</p>\n</div><div class=\"amis-preview\" style=\"min-height: undefinedpx\"><script type=\"text/schema\"  scope=\"body\">{\n  \"type\": \"form\",\n  \"debug\": true,\n  \"debugConfig\": {\n    \"levelExpand\": 2\n  },\n  \"body\": [\n    {\n      \"name\": \"array\",\n      \"label\": \"整数集合\",\n      \"mode\": \"horizontal\",\n      \"type\": \"input-array\",\n      \"value\": [123, 456],\n      \"scaffold\": 0,\n      \"inline\": true,\n      \"items\": {\n        \"type\": \"input-number\",\n        \"clearable\": false\n      }\n    }\n  ]\n}\n</script></div><div class=\"markdown-body\">\n<h2><a class=\"anchor\" name=\"%E5%B1%9E%E6%80%A7%E8%A1%A8\" href=\"#%E5%B1%9E%E6%80%A7%E8%A1%A8\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>属性表</h2><p>除了支持 <a href=\"./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8\">普通表单项属性表</a> 中的配置以外，还支持下面一些配置</p>\n<table>\n<thead>\n<tr>\n<th>属性名</th>\n<th>类型</th>\n<th>默认值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody><tr>\n<td>type</td>\n<td><code>string</code></td>\n<td><code>&quot;input-array&quot;</code></td>\n<td>指明为<code>array</code>组件</td>\n</tr>\n<tr>\n<td>items</td>\n<td><a href=\"../../docs/types/schemanode\"><code>SchemaNode</code></a></td>\n<td></td>\n<td>配置单项表单类型</td>\n</tr>\n<tr>\n<td>addable</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否可新增。</td>\n</tr>\n<tr>\n<td>removable</td>\n<td><code>boolean</code></td>\n<td></td>\n<td>是否可删除</td>\n</tr>\n<tr>\n<td>draggable</td>\n<td><code>boolean</code></td>\n<td><code>false</code></td>\n<td>是否可以拖动排序, 需要注意的是当启用拖动排序的时候，会多一个$id 字段</td>\n</tr>\n<tr>\n<td>draggableTip</td>\n<td><code>string</code></td>\n<td></td>\n<td>可拖拽的提示文字，默认为：<code>&quot;可通过拖动每行中的【交换】按钮进行顺序调整&quot;</code></td>\n</tr>\n<tr>\n<td>addButtonText</td>\n<td><code>string</code></td>\n<td><code>&quot;新增&quot;</code></td>\n<td>新增按钮文字</td>\n</tr>\n<tr>\n<td>minLength</td>\n<td><code>number</code></td>\n<td></td>\n<td>限制最小长度</td>\n</tr>\n<tr>\n<td>maxLength</td>\n<td><code>number</code></td>\n<td></td>\n<td>限制最大长度</td>\n</tr>\n<tr>\n<td>scaffold</td>\n<td><code>any</code></td>\n<td></td>\n<td>新增成员时的默认值，一般根据<code>items</code>的数据类型指定需要的默认值</td>\n</tr>\n</tbody></table>\n</div>",
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
          "label": "新增成员默认值",
          "fragment": "%E6%96%B0%E5%A2%9E%E6%88%90%E5%91%98%E9%BB%98%E8%AE%A4%E5%80%BC",
          "fullPath": "#%E6%96%B0%E5%A2%9E%E6%88%90%E5%91%98%E9%BB%98%E8%AE%A4%E5%80%BC",
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
