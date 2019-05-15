define('docs/renderers/CRUD-Table.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"table-crud-\" href=\"#table-crud-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Table(CRUD)</h3><p>在 CRUD 中的 Table 主要增加了 Column 里面的以下配置功能，更多参数，请参考<a href=\"#/docs/renderers/Table\">Table</a></p>\n<ul>\n<li><code>sortable</code> 开启后可以根据当前列排序(后端排序)。</li>\n</ul>\n<div class=\"amis-preview\" style=\"height: 1000px\"><script type=\"text/schema\" height=\"1000\" scope=\"body\">{\n    \"type\": \"crud\",\n    \"api\": \"https://houtai.baidu.com/api/sample\",\n    \"syncLocation\": false,\n    \"title\": null,\n    \"perPageField\":\"rn\",\n    \"defaultParams\":{\n        \"rn\": 10\n    },\n    \"columns\": [\n        {\n            \"name\": \"id\",\n            \"label\": \"ID\",\n            \"width\": 20,\n            \"sortable\": true\n        },\n        {\n            \"name\": \"engine\",\n            \"label\": \"Rendering engine\",\n            \"sortable\": true,\n            \"toggled\": false\n        },\n        {\n            \"name\": \"browser\",\n            \"label\": \"Browser\",\n            \"sortable\": true\n        },\n        {\n            \"name\": \"platform\",\n            \"label\": \"Platform(s)\",\n            \"sortable\": true\n        },\n        {\n            \"name\": \"version\",\n            \"label\": \"Engine version\"\n        }\n    ]\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Table(CRUD)",
          "fragment": "table-crud-",
          "fullPath": "#table-crud-",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
