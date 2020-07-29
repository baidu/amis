## Definitions

`Definitions`建立当前页面公共的配置项，在其他组件中可以通过`$ref`来引用当前配置项中的内容。注意 definitions 只能在顶级节点中定义，定义在其他位置，将引用不到。

```schema:height="200"
{
  "definitions": {
          "aa": {
              "type": "text",
              "name": "jack",
              "value": "ref value",
              "labelRemark": "通过<code>\\$ref</code>引入的组件"
          }
      },
      "type": "page",
      "title": "引用",
      "body": [
          {
              "type": "form",
              "api": "api/xxx",
              "actions": [],
              "controls": [
                  {
                      "$ref": "aa"
                  }
              ]
          }
      ]
}
```

`Definitions` 最大的作用其实是能够实现对数据格式的递归引用。来看这个栗子吧。

```schema:height="600"
{
  "definitions": {
          "options": {
            "type": "combo",
            "multiple": true,
            "multiLine": true,
            "name": "options",
            "controls": [
            {
                "type": "group",
                "controls": [
                {
                    "label": "名称",
                    "name": "label",
                    "type": "text",
                    "required": true
                },
                {
                    "label": "值",
                    "name": "value",
                    "type": "text",
                    "required": true
                }
                ]
            },
            {
                "label": "包含子选项",
                "type": "switch",
                "name": "hasChildren",
                "mode": "inline",
                "className": "block"
            },
            {
                "$ref": "options",
                "label": "子选项",
                "name": "children",
                "visibleOn": "this.hasOwnProperty('hasChildren') && this.hasChildren",
                "addButtonText": "新增子选项"
            }
            ]
        }
      },
      "type": "page",
      "title": "引用",
      "body": [
          {
              "type": "form",
              "api": "api/xxx",
              "actions": [],
              "controls": [
                  {
                      "$ref": "options",
                      "label": "选项"
                  },

                  {
                      "type": "static",
                      "label": "当前值",
                      "tpl": "<pre>${options|json}</pre>"
                  }
              ]
          }
      ]
}
```