### Picker

列表选取。可以静态数据，或者通过接口拉取动态数据。

-   `type` 请设置成 `picker`
-   `multiple` 是否为多选。
-   `options` 选项配置，类型为数组，成员格式如下。
    -   `label` 文字
    -   `value` 值
-   `source` Api 地址，如果选项不固定，可以通过配置 `source` 动态拉取。 另外也可以用 `$xxxx` 来获取当前作用域中的变量。
-   `joinValues` 默认为 `true`
-   单选模式：当用户选中某个选项时，选项中的 value 将被作为该表单项的值提交，否则，整个选项对象都会作为该表单项的值提交。
-   多选模式：选中的多个选项的 `value` 会通过 `delimiter` 连接起来，否则直接将以数组的形式提交值。
-   `extractValue` 默认为 `false`, `joinValues`设置为`false`时生效, 开启后将选中的选项 value 的值封装为数组，作为当前表单项的值。
-   `delimiter` 默认为 `,`
-   `modalMode` 设置 `dialog` 或者 `drawer`，用来配置弹出方式。
-   `pickerSchema` 默认为 `{mode: 'list', listItem: {title: '${label}'}}`, 即用 List 类型的渲染，来展示列表信息。更多的玩法请参考 [CRUD](./CRUD.md) 的配置。
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="300" scope="form-item"
{
  "type": "picker",
  "name": "type4",
  "joinValues": true,
  "valueField": "id",
  "labelField": "engine",
  "label": "多选",
  "source": "/api/sample",
  "size": "lg",
  "value": "4,5",
  "multiple": true,
  "pickerSchema": {
    "mode": "table",
    "name": "thelist",
    "quickSaveApi": "/api/sample/bulkUpdate",
    "quickSaveItemApi": "/api/sample/$id",
    "draggable": true,
    "headerToolbar": {
      "wrapWithPanel": false,
      "type": "form",
      "className": "text-right",
      "target": "thelist",
      "mode": "inline",
      "controls": [
        {
          "type": "text",
          "name": "keywords",
          "addOn": {
            "type": "submit",
            "label": "搜索",
            "level": "primary",
            "icon": "fa fa-search pull-left"
          }
        }
      ]
    },
    "columns": [
      {
        "name": "engine",
        "label": "Rendering engine",
        "sortable": true,
        "searchable": true,
        "type": "text",
        "toggled": true
      },
      {
        "name": "browser",
        "label": "Browser",
        "sortable": true,
        "type": "text",
        "toggled": true
      },
      {
        "name": "platform",
        "label": "Platform(s)",
        "sortable": true,
        "type": "text",
        "toggled": true
      },
      {
        "name": "version",
        "label": "Engine version",
        "quickEdit": true,
        "type": "text",
        "toggled": true
      },
      {
        "name": "grade",
        "label": "CSS grade",
        "quickEdit": {
          "mode": "inline",
          "type": "select",
          "options": [
            "A",
            "B",
            "C",
            "D",
            "X"
          ],
          "saveImmediately": true
        },
        "type": "text",
        "toggled": true
      },
      {
        "type": "operation",
        "label": "操作",
        "width": 100,
        "buttons": [
          {
            "type": "button",
            "icon": "fa fa-eye",
            "actionType": "dialog",
            "dialog": {
              "title": "查看",
              "body": {
                "type": "form",
                "controls": [
                  {
                    "type": "static",
                    "name": "engine",
                    "label": "Engine"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "static",
                    "name": "browser",
                    "label": "Browser"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "static",
                    "name": "platform",
                    "label": "Platform(s)"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "static",
                    "name": "version",
                    "label": "Engine version"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "static",
                    "name": "grade",
                    "label": "CSS grade"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "html",
                    "html": "<p>添加其他 <span>Html 片段</span> 需要支持变量替换（todo）.</p>"
                  }
                ]
              }
            }
          },
          {
            "type": "button",
            "icon": "fa fa-pencil",
            "actionType": "dialog",
            "dialog": {
              "position": "left",
              "size": "lg",
              "title": "编辑",
              "body": {
                "type": "form",
                "name": "sample-edit-form",
                "api": "/api/sample/$id",
                "controls": [
                  {
                    "type": "text",
                    "name": "engine",
                    "label": "Engine",
                    "required": true
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "text",
                    "name": "browser",
                    "label": "Browser",
                    "required": true
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "text",
                    "name": "platform",
                    "label": "Platform(s)",
                    "required": true
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "text",
                    "name": "version",
                    "label": "Engine version"
                  },
                  {
                    "type": "divider"
                  },
                  {
                    "type": "select",
                    "name": "grade",
                    "label": "CSS grade",
                    "options": [
                      "A",
                      "B",
                      "C",
                      "D",
                      "X"
                    ]
                  }
                ]
              }
            }
          },
          {
            "type": "button",
            "icon": "fa fa-times text-danger",
            "actionType": "ajax",
            "confirmText": "您确认要删除?",
            "api": "delete:/api/sample/$id"
          }
        ],
        "toggled": true
      }
    ]
  }
}
```
