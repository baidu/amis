define('docs/renderers/CRUD-List.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"list-crud-\" href=\"#list-crud-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>List(CRUD)</h3><p>请参考<a href=\"#/docs/renderers/List\">List</a></p>\n<div class=\"amis-preview\" style=\"height: 1000px\"><script type=\"text/schema\" height=\"1000\" scope=\"body\">{\n\"type\": \"crud\",\n\"api\": \"https://houtai.baidu.com/api/mock2/crud/permissions\",\n\"mode\": \"list\",\n\"placeholder\": \"当前组内, 还没有配置任何权限.\",\n\"syncLocation\": false,\n\"title\": null,\n\"listItem\": {\n  \"title\": \"$name\",\n  \"subTitle\": \"$description\",\n  \"actions\": [\n    {\n      \"icon\": \"fa fa-edit\",\n      \"tooltip\": \"编辑\",\n      \"actionType\": \"dialog\",\n      \"dialog\": {\n        \"title\": \"编辑能力（权限）\",\n        \"body\": {\n          \"type\": \"form\",\n          \"controls\": [\n          {\n            \"type\": \"hidden\",\n            \"name\": \"id\"\n          },\n          {\n            \"name\": \"name\",\n            \"label\": \"权限名称\",\n            \"type\": \"text\",\n            \"disabled\": true\n          },\n          {\n            \"type\": \"divider\"\n          },\n          {\n            \"name\": \"description\",\n            \"label\": \"描述\",\n            \"type\": \"textarea\"\n          }\n        ]\n        }\n      }\n    },\n    {\n      \"tooltip\": \"删除\",\n      \"disabledOn\": \"~[\\\"admin:permission\\\", \\\"admin:user\\\", \\\"admin:role\\\", \\\"admin:acl\\\", \\\"admin:page\\\", \\\"page:readAll\\\", \\\"admin:settings\\\"].indexOf(name)\",\n      \"icon\": \"fa fa-times\",\n      \"confirmText\": \"您确定要移除该权限?\",\n      \"actionType\": \"ajax\",\n      \"api\": \"delete:https://houtai.baidu.com/api/mock2/notFound\"\n    }\n  ]\n}\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "List(CRUD)",
          "fragment": "list-crud-",
          "fullPath": "#list-crud-",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
