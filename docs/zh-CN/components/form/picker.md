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
        "footerToolbar": [
          "statistics",
          {
            "type": "pagination",
            "showPageInput": true,
            "layout": "perPage,pager,go"
          }
        ],
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

可以配置`visibleOn`属性控制 picker 显隐来支持更复杂的表单场景。如果 picker 的初始值需要绑定上层数据域变量，可以通过配置事件动作来更新上层数据域变量。

```schema: scope="body"
{
  "type": "page",
  "body": [
    {
      "type": "form",
      "api": "",
      "id": "test",
      "data": {
        "selectedValue": [{id: 1}, {id: 53}]
      },
      "body": [
        {
          "type": "button-group-select",
          "name": "buttonGroupSelect",
          "label": "按钮点选",
          "inline": false,
          "options": [
            {
              "label": "大模型训练",
              "value": "train"
            },
            {
              "label": "预测服务",
              "value": "service"
            }
          ],
          "value": "train"
        },
        {
          "type": "picker",
          "name": "type4",
          "joinValues": true,
          "valueField": "id",
          "labelField": "engine",
          "label": "",
          "embed": true,
          "source": "${trainList}",
          "size": "lg",
          "multiple": true,
          "pickerSchema": {
            "mode": "table",
            "name": "thelist",
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
              }
            ],
            "onEvent": {
              "selectedChange": {
                "actions": [
                  {
                    "actionType": "toast",
                    "args": {
                      "msg": "已选择${event.data.selectedItems.length}条记录"
                    }
                  },
                  {
                      "actionType": "setValue",
                      "args": {
                        "value": {
                          "selectedValue": "${event.data.selectedItems}"
                        }
                      },
                      "componentId": "test"
                    }
                ]
              }
            },
            "itemCheckableOn": "${id !== 1 && id !== 53}"
          },
          "validateApiFromAPIHub": false,
          "visibleOn": "${buttonGroupSelect === 'train'}",
          "sourceFromAPIHub": false,
          "modalMode": "dialog",
          "value": "${selectedValue}",
          "valueField": "id",
          "joinValues": false
        },
        {
          "type": "picker",
          "name": "type5",
          "joinValues": false,
          "labelField": "engine",
          "label": "",
          "embed": true,
          "source": "${serviceList}",
          "size": "lg",
          "multiple": true,
          "pickerSchema": {
            "mode": "table",
            "name": "thelist",
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
              }
            ],
            "onEvent": {
              "selectedChange": {
                "actions": [
                  {
                    "actionType": "toast",
                    "args": {
                      "msg": "已选择${event.data.selectedItems.length}条记录"
                    }
                  }
                ]
              }
            },
            "itemCheckableOn": "${id !== 2 && id !== 50}"
          },
          "validateApiFromAPIHub": false,
          "style": {
            "boxShadow": "var(--shadows-shadow-none)"
          },
          "value": "2,50",
          "valueField": "id",
          "visibleOn": "${buttonGroupSelect === 'service'}",
          "joinValues": false
        }
      ],
      "debug": true
    }
  ],
  "asideResizor": false,
  "style": {
    "boxShadow": "var(--shadows-shadow-none)"
  },
  "pullRefresh": {
    "disabled": true
  },
  "regions": [
    "body"
  ],
  "initApi": {
    "method": "get",
    "url": "/api/mock2/sample",
    "dataType": "json",
    "initFetch": true,
    "adaptor": "const data = payload.data.rows || payload.result.rows;\nconsole.log(' data', data)\nconst trainList = data.filter(item => item.grade === 'X');\nconst serviceList = data.filter(item => item.grade === 'C');\nreturn {\n  allList: data,\n  trainList,\n  serviceList,\n};"
  }
}
```

## 限制标签最大展示数量

设置`overflowConfig`后可以限制标签的最大展示数量，该属性仅在多选模式开启后生效，包含以下几个配置项：

- `maxTagCount`：最大展示数量，范围是正整数时启用，可以设置一个大一点数字，因为会自动根据可容纳控件尽可能的多展示，但是不会超出设定值。
- `displayPosition`：收纳标签生效的位置，类型为字符串数组，未开启内嵌模式默认为**选择器**, 开启后默认为**选择器**和**CRUD 顶部**，可选值为`'select'`(选择器)、`'crud'`(增删改查)。
- `overflowTagPopover`配置收纳标签 Popover 相关[属性](../tooltip#属性表)。
- `overflowTagPopoverInCRUD`可以配置**CRUD 顶部**收纳标签的 Popover 相关[属性](../tooltip#属性表)。

> `3.4.0` 及以上版本

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "picker",
      "overflowConfig": {
        "maxTagCount": 20,
      },
      "name": "maxTagCount1",
      "joinValues": true,
      "valueField": "id",
      "labelField": "engine",
      "label": "多选",
      "source": "/api/mock2/sample",
      "size": "lg",
      "value": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20",
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
        "footerToolbar": [
          "statistics",
          {
            "type": "pagination",
            "showPageInput": true,
            "layout": "perPage,pager,go"
          }
        ],
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

内嵌模式下

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "debug": true,
  "body": [
    {
      "type": "picker",
      "overflowConfig": {
        "maxTagCount": 20,
        "overflowTagPopoverInCRUD": {
          "placement": "top"
        }
      },
      "embed": true,
      "name": "maxTagCount2",
      "joinValues": true,
      "valueField": "id",
      "labelField": "engine",
      "label": "多选",
      "source": "/api/mock2/sample",
      "size": "lg",
      "value": "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20",
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
        "footerToolbar": [
          "statistics",
          {
            "type": "pagination",
            "showPageInput": true,
            "layout": "perPage,pager,go"
          }
        ],
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

| 属性名         | 类型                                                                                         | 默认值                                          | 说明                                                                                        | 版本     |
| -------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------- | -------- |
| options        | `Array<object>`或`Array<string>`                                                             |                                                 | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| source         | `string`或 [API](../../../docs/types/api) 或 [数据映射](../../../docs/concepts/data-mapping) |                                                 | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| multiple       | `boolean`                                                                                    |                                                 | 是否为多选。                                                                                |
| delimiter      | `boolean`                                                                                    | `false`                                         | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                   |
| labelField     | `boolean`                                                                                    | `"label"`                                       | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField     | `boolean`                                                                                    | `"value"`                                       | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues     | `boolean`                                                                                    | `true`                                          | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue   | `boolean`                                                                                    | `false`                                         | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
| autoFill       | `object`                                                                                     |                                                 | [自动填充](./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill)                         |
| modalTitle     | `string`                                                                                     | `"请选择"`                                      | 设置模态框的标题                                                                            |
| modalMode      | `string`                                                                                     | `"dialog"`                                      | 设置 `dialog` 或者 `drawer`，用来配置弹出方式。                                             |
| modalSize      | `string`                                                                                     |                                                 | 设置弹框大小                                                                                |
| pickerSchema   | `string`                                                                                     | `{mode: 'list', listItem: {title: '${label}'}}` | 即用 List 类型的渲染，来展示列表信息。更多配置参考 [CRUD](../crud)                          |
| embed          | `boolean`                                                                                    | `false`                                         | 是否使用内嵌模式                                                                            |
| overflowConfig | `OverflowConfig`                                                                             | 参考[OverflowConfig](./#overflowconfig)         | 开启最大标签展示数量的相关配置 `3.4.0`                                                      |
| itemClearable  | `itemClearable`                                                                              | `true`                                          | 用于控制是否显示选中项的删除图标，默认值为 `true`                                           | `6.10.0` |

### OverflowConfig

| 属性名                   | 类型                     | 默认值                                                                               | 说明                                                                                                                                   |
| ------------------------ | ------------------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| maxTagCount              | `number`                 | `-1`                                                                                 | 标签的最大展示数量，超出数量后以收纳浮层的方式展示，仅在多选模式开启后生效，默认为`-1` 不开启 `3.4.0`                                  |
| displayPosition          | `('select' \| 'crud')[]` | `['select', 'crud']`                                                                 | 收纳标签生效的位置，未开启内嵌模式默认为选择器, 开启后默认为选择器和 CRUD 顶部，可选值为`'select'`(选择器)、`'crud'`(增删改查) `3.4.0` |
| overflowTagPopover       | `TooltipObject`          | `{"placement": "top", "trigger": "hover", "showArrow": false, "offset": [0, -10]}`   | 选择器内收纳标签的 Popover 配置，详细配置参考[Tooltip](../tooltip#属性表) `3.4.0`                                                      |
| overflowTagPopoverInCRUD | `TooltipObject`          | `{"placement": "bottom", "trigger": "hover", "showArrow": false, "offset": [0, 10]}` | CRUD 顶部内收纳标签的 Popover 配置，详细配置参考[Tooltip](../tooltip#属性表) `3.4.0`                                                   |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称        | 事件参数                                                                                                                    | 说明                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| change          | `[name]: string` 组件的值（多个以逗号分隔)<br/>`selectedItems: object` \| `object[]`选中项（< 2.3.2 及以下版本 为`option`） | 选中值变化时触发           |
| itemClick       | `item: Option` 所点击的选项                                                                                                 | 选项被点击时触发           |
| staticItemClick | `item: Option` 所点击的选项                                                                                                 | 静态展示时选项被点击时触发 |

### change

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
            "label": "A",
            "value": "a"
          },
          {
            "label": "B",
            "value": "b"
          },
          {
            "label": "C",
            "value": "c"
          }
        ],
        "onEvent": {
          "change": {
            "actions": [
              {
                "actionType": "toast",
                "args": {
                  "msg": "${event.data.value}"
                }
              }
            ]
          }
        }
      }
    ]
  }
```

### itemClick

输入框内已被选中的选项被点击时触发。

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
            "label": "A",
            "value": "a"
          },
          {
            "label": "B",
            "value": "b"
          },
          {
            "label": "C",
            "value": "c"
          }
        ],
        "onEvent": {
          "itemClick": {
            "actions": [
              {
                "actionType": "toast",
                "args": {
                  "msg": "${event.data.item|json}"
                }
              }
            ]
          }
        }
      }
    ]
  }
```

### staticItemClick

> 6.13.0 起支持

静态展示时选项被点击时触发。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
      {
        "type": "picker",
        "name": "picker",
        "label": "picker",
        "static": true,
        "value": "a,b",
        "multiple": true,
        "options": [
          {
            "label": "A",
            "value": "a"
          },
          {
            "label": "B",
            "value": "b"
          },
          {
            "label": "C",
            "value": "c"
          }
        ],
        "onEvent": {
          "staticItemClick": {
            "actions": [
              {
                "actionType": "toast",
                "args": {
                  "msg": "${event.data.item|json}"
                }
              }
            ]
          }
        }
      }
    ]
  }
```
