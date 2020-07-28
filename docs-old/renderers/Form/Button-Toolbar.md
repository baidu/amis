### Button-Toolbar

从上面的例子可以看出，当按钮独立配置的时候，是独占一行的，如果想让多个按钮在一起放置，可以利用 button-toolbar

-   `type` 请设置成 `button-toolbar`
-   `buttons` 按钮集合。

```schema:height="200" scope="form"
[
  {
    "type": "text",
    "name": "test",
    "label": "Text"
  },

  {
    "type": "button-toolbar",
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
  }
]
```
