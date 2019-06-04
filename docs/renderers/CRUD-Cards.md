### Cards(CRUD)

请参考[Cards](./Cards.md)

```schema:height="800" scope="body"
{
"type": "crud",
"api": "/api/mock2/crud/users",
"syncLocation": false,
"mode": "cards",
"defaultParams": {
  "perPage": 6
},
"switchPerPage": false,
"placeholder": "没有用户信息",
"columnsCount": 2,
"card": {
  "header": {
    "className": "bg-white",
    "title": "$name",
    "subTitle": "$realName",
    "description": "$email",
    "avatar": "${avatar | raw}",
    "highlight": "$isSuperAdmin",
    "avatarClassName": "pull-left thumb-md avatar b-3x m-r"
  },
  "bodyClassName": "padder",
  "body": "\n      <% if (data.roles && data.roles.length) { %>\n        <% data.roles.map(function(role) { %>\n          <span class=\"label label-default\"><%- role.name %></span>\n        <% }) %>\n      <% } else { %>\n        <p class=\"text-muted\">没有分配角色</p>\n      <% } %>\n      ",
  "actions": [
    {
      "label": "编辑",
      "actionType": "dialog",
      "dialog": {
        "title": null,
        "body": {
          "api": "",
          "type": "form",
        "tabs": [
          {
            "title": "基本信息",
            "controls": [
              {
                "type": "hidden",
                "name": "id"
              },
              {
                "name": "name",
                "label": "帐号",
                "disabled": true,
                "type": "text"
              },
              {
                "type": "divider"
              },
              {
                "name": "email",
                "label": "邮箱",
                "type": "text",
                "disabled": true
              },
              {
                "type": "divider"
              },
              {
                "name": "isAmisOwner",
                "label": "管理员",
                "description": "设置是否为超级管理",
                "type": "switch"
              }
            ]
          },
          {
            "title": "角色信息",
            "controls": [

            ]
          },
          {
            "title": "设置权限",
            "controls": [

            ]
          }
        ]
        }
      }
    },
    {
      "label": "移除",
      "confirmText": "您确定要移除该用户?",
      "actionType": "ajax",
      "api": "delete:/api/mock2/notFound"
    }
  ]
}
}
```
