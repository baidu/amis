## Button-Group

按钮集合。

-   `type` 请设置成 `button-group`
-   `buttons` 配置按钮集合。

```schema:height="200" scope="body"
{
  "type": "button-toolbar",
  "buttons": [
    {
      "type": "button-group",
      "buttons": [
        {
          "type": "button",
          "label": "Button",
          "actionType": "dialog",
          "dialog": {
            "confirmMode": false,
            "title": "提示",
            "body": "对，你刚点击了！"
          }
        },

        {
          "type": "submit",
          "label": "Submit"
        },

        {
          "type": "reset",
          "label": "Reset"
        }
      ]
    },

    {
      "type": "submit",
      "icon": "fa fa-check text-success"
    },

    {
      "type": "reset",
      "icon": "fa fa-times text-danger"
    }
  ]
}
```
