---
title: Picker 列表选择器
description:
type: 0
group: null
menuName: Picker
icon:
order: 35
---

列表选取，在功能上和 Select 类似，但它能显示更复杂的信息。

## 基本用法

默认和 Select 很像，但请看后面的 pickerSchema 设置。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "picker",
            "name": "picker",
            "label": "picker",
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

## 配置 pickerSchema

可以配置 pickerSchema，实现弹框 crud 选择模式，更多 crud 配置可查看 crud 文档，选择之后最终的值通过 `valueField` 来设置。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "picker",
      "name": "type4",
      "joinValues": true,
      "valueField": "id",
      "labelField": "engine",
      "label": "多选",
      "source": "/api/mock2/sample",
      "size": "lg",
      "value": "4,5",
      "multiple": true,
      "pickerSchema": {
        "mode": "table",
        "name": "thelist",
        "quickSaveApi": "/api/mock2/sample/bulkUpdate",
        "quickSaveItemApi": "/api/mock2/sample/$id",
        "draggable": true,
        "headerToolbar": {
          "wrapWithPanel": false,
          "type": "form",
          "className": "text-right",
          "target": "thelist",
          "mode": "inline",
          "body": [
            {
              "type": "input-text",
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
              "options": ["A", "B", "C", "D", "X"],
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
                    "body": [
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
                    "api": "/api/mock2/sample/$id",
                    "body": [
                      {
                        "type": "input-text",
                        "name": "engine",
                        "label": "Engine",
                        "required": true
                      },
                      {
                        "type": "divider"
                      },
                      {
                        "type": "input-text",
                        "name": "browser",
                        "label": "Browser",
                        "required": true
                      },
                      {
                        "type": "divider"
                      },
                      {
                        "type": "input-text",
                        "name": "platform",
                        "label": "Platform(s)",
                        "required": true
                      },
                      {
                        "type": "divider"
                      },
                      {
                        "type": "input-text",
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
                        "options": ["A", "B", "C", "D", "X"]
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
                "api": "delete:/api/mock2/sample/$id"
              }
            ],
            "toggled": true
          }
        ]
      }
    }
  ]
}
```

## 内嵌模式

可以配置`"embed": true`，实现内嵌 picker

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "picker",
      "name": "type4",
      "joinValues": true,
      "valueField": "id",
      "labelField": "engine",
      "label": "Picker",
      "embed": true,
      "source": "/api/mock2/crud/tree?waitSeconds=1",
      "size": "lg",
      "value": "4,5",
      "multiple": true,
      "pickerSchema": {
        "mode": "table",
        "name": "thelist",
        "quickSaveApi": "/api/mock2/sample/bulkUpdate",
        "quickSaveItemApi": "/api/mock2/sample/$id",
        "draggable": true,
        "headerToolbar": {
          "wrapWithPanel": false,
          "type": "form",
          "className": "text-right",
          "target": "thelist",
          "mode": "inline",
          "body": [
            {
              "type": "input-text",
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
              "options": ["A", "B", "C", "D", "X"],
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
                    "body": [
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
                    "api": "/api/mock2/sample/$id",
                    "body": [
                      {
                        "type": "input-text",
                        "name": "engine",
                        "label": "Engine",
                        "required": true
                      },
                      {
                        "type": "divider"
                      },
                      {
                        "type": "input-text",
                        "name": "browser",
                        "label": "Browser",
                        "required": true
                      },
                      {
                        "type": "divider"
                      },
                      {
                        "type": "input-text",
                        "name": "platform",
                        "label": "Platform(s)",
                        "required": true
                      },
                      {
                        "type": "divider"
                      },
                      {
                        "type": "input-text",
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
                        "options": ["A", "B", "C", "D", "X"]
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
                "api": "delete:/api/mock2/sample/$id"
              }
            ],
            "toggled": true
          }
        ]
      }
    }
  ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名       | 类型                                                                                         | 默认值                                          | 说明                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| options      | `Array<object>`或`Array<string>`                                                             |                                                 | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| source       | `string`或 [API](../../../docs/types/api) 或 [数据映射](../../../docs/concepts/data-mapping) |                                                 | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| multiple     | `boolean`                                                                                    |                                                 | 是否为多选。                                                                                |
| delimiter    | `boolean`                                                                                    | `false`                                         | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                   |
| labelField   | `boolean`                                                                                    | `"label"`                                       | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField   | `boolean`                                                                                    | `"value"`                                       | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues   | `boolean`                                                                                    | `true`                                          | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue | `boolean`                                                                                    | `false`                                         | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
| autoFill     | `object`                                                                                     |                                                 | [自动填充](./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill)                         |
| modalMode    | `string`                                                                                     | `"dialog"`                                      | 设置 `dialog` 或者 `drawer`，用来配置弹出方式。                                             |
| pickerSchema | `string`                                                                                     | `{mode: 'list', listItem: {title: '${label}'}}` | 即用 List 类型的渲染，来展示列表信息。更多配置参考 [CRUD](../crud)                          |
| embed        | `boolean`                                                                                    | `false`                                         | 是否使用内嵌模式                                                                            |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`event.data.xxx`事件参数变量来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称 | 事件参数                                                           | 说明             |
| -------- | ------------------------------------------------------------------ | ---------------- |
| change   | `event.data.value: string`<br/> `event.data.option: Option` 选中值 | 选中值变化时触发 |
