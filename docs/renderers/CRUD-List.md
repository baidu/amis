### List(CRUD)

请参考[List](./List.md)

```schema:height="800" scope="body"
{
"type": "crud",
"api": "/api/mock2/crud/permissions",
"mode": "list",
"placeholder": "当前组内, 还没有配置任何权限.",
"syncLocation": false,
"title": null,
"listItem": {
  "title": "$name",
  "subTitle": "$description",
  "actions": [
    {
      "icon": "fa fa-edit",
      "tooltip": "编辑",
      "actionType": "dialog",
      "dialog": {
        "title": "编辑能力（权限）",
        "body": {
          "type": "form",
          "controls": [
          {
            "type": "hidden",
            "name": "id"
          },
          {
            "name": "name",
            "label": "权限名称",
            "type": "text",
            "disabled": true
          },
          {
            "type": "divider"
          },
          {
            "name": "description",
            "label": "描述",
            "type": "textarea"
          }
        ]
        }
      }
    },
    {
      "tooltip": "删除",
      "disabledOn": "~[\"admin:permission\", \"admin:user\", \"admin:role\", \"admin:acl\", \"admin:page\", \"page:readAll\", \"admin:settings\"].indexOf(name)",
      "icon": "fa fa-times",
      "confirmText": "您确定要移除该权限?",
      "actionType": "ajax",
      "api": "delete:/api/mock2/notFound"
    }
  ]
}
}
```
