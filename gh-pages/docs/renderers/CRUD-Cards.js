define('docs/renderers/CRUD-Cards.md', function(require, exports, module) {

  module.exports = {
    "html": "<h3><a class=\"anchor\" name=\"cards-crud-\" href=\"#cards-crud-\" aria-hidden=\"true\"><svg aria-hidden=\"true\" class=\"octicon octicon-link\" height=\"16\" version=\"1.1\" viewBox=\"0 0 16 16\" width=\"16\"><path d=\"M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z\"></path></svg></a>Cards(CRUD)</h3><p>请参考<a href=\"#/docs/renderers/Cards\">Cards</a></p>\n<div class=\"amis-preview\" style=\"height: 1000px\"><script type=\"text/schema\" height=\"1000\" scope=\"body\">{\n\"type\": \"crud\",\n\"api\": \"https://houtai.baidu.com/api/mock2/crud/users\",\n\"syncLocation\": false,\n\"mode\": \"cards\",\n\"defaultParams\": {\n  \"perPage\": 6\n},\n\"switchPerPage\": false,\n\"placeholder\": \"没有用户信息\",\n\"columnsCount\": 2,\n\"card\": {\n  \"header\": {\n    \"className\": \"bg-white\",\n    \"title\": \"$name\",\n    \"subTitle\": \"$realName\",\n    \"description\": \"$email\",\n    \"avatar\": \"${avatar | raw}\",\n    \"highlight\": \"$isSuperAdmin\",\n    \"avatarClassName\": \"pull-left thumb-md avatar b-3x m-r\"\n  },\n  \"bodyClassName\": \"padder\",\n  \"body\": \"\\n      <% if (data.roles && data.roles.length) { %>\\n        <% data.roles.map(function(role) { %>\\n          <span class=\\\"label label-default\\\"><%- role.name %></span>\\n        <% }) %>\\n      <% } else { %>\\n        <p class=\\\"text-muted\\\">没有分配角色</p>\\n      <% } %>\\n      \",\n  \"actions\": [\n    {\n      \"label\": \"编辑\",\n      \"actionType\": \"dialog\",\n      \"dialog\": {\n        \"title\": null,\n        \"body\": {\n          \"api\": \"\",\n          \"type\": \"form\",\n        \"tabs\": [\n          {\n            \"title\": \"基本信息\",\n            \"controls\": [\n              {\n                \"type\": \"hidden\",\n                \"name\": \"id\"\n              },\n              {\n                \"name\": \"name\",\n                \"label\": \"帐号\",\n                \"disabled\": true,\n                \"type\": \"text\"\n              },\n              {\n                \"type\": \"divider\"\n              },\n              {\n                \"name\": \"email\",\n                \"label\": \"邮箱\",\n                \"type\": \"text\",\n                \"disabled\": true\n              },\n              {\n                \"type\": \"divider\"\n              },\n              {\n                \"name\": \"isAmisOwner\",\n                \"label\": \"管理员\",\n                \"description\": \"设置是否为超级管理\",\n                \"type\": \"switch\"\n              }\n            ]\n          },\n          {\n            \"title\": \"角色信息\",\n            \"controls\": [\n\n            ]\n          },\n          {\n            \"title\": \"设置权限\",\n            \"controls\": [\n\n            ]\n          }\n        ]\n        }\n      }\n    },\n    {\n      \"label\": \"移除\",\n      \"confirmText\": \"您确定要移除该用户?\",\n      \"actionType\": \"ajax\",\n      \"api\": \"delete:https://houtai.baidu.com/api/mock2/notFound\"\n    }\n  ]\n}\n}\n</script></div>\n",
    "toc": {
      "label": "目录",
      "type": "toc",
      "children": [
        {
          "label": "Cards(CRUD)",
          "fragment": "cards-crud-",
          "fullPath": "#cards-crud-",
          "level": 3
        }
      ],
      "level": 0
    }
  };

});
