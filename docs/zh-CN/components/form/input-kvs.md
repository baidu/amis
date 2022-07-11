---
title: InputKVS 键值对象
description:
type: 0
group: null
menuName: InputKVS
icon:
order: 15
---

> 2.1.0 及以上版本

这个组件的功能和 `input-kv` 类似，`input-kv` 的 value 值只支持一个对象，`input-kvs` 的最大不同就是 value 支持对象和数组，可以用来支持深层结构编辑

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-kvs",
            "name": "field",
            "addButtonText": "新增字段",
            "keyItem": {
              "label": "字段名"
            },
            "valueItems": [
                {
                  "type": "switch",
                  "name": "primary",
                  "label": "是否是主键"
                },
                {
                  "type": "select",
                  "name": "type",
                  "label": "字段类型",
                  "options": [
                    "text",
                    "int",
                    "float"
                  ]
                }
            ]
        }
    ]
}
```

其中 `keyItem` 可以用来修改 key 值控件，比如可以改成下拉框

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-kvs",
            "name": "field",
            "addButtonText": "新增字段",
            "keyItem": {
              "label": "字段名",
              "type": "select",
              "options": [
                  "id",
                  "title",
                  "content"
              ]
            },
            "valueItems": [
                {
                  "type": "switch",
                  "name": "primary",
                  "label": "是否是主键"
                },
                {
                  "type": "select",
                  "name": "type",
                  "label": "字段类型",
                  "options": [
                    "text",
                    "int",
                    "float"
                  ]
                }
            ]
        }
    ]
}
```

而 `valueItems` 是用来控制值的控件，这里的配置和 combo 的 items 一样，唯一限制是不允许有 `"name": "_key"` 值的情况，因为这个值被当成对象 key 了。

## 水平模式

通过 `"mode": "horizontal"` 设置，需要分别在 `keyItem` 和 `valueItems` 里设置

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-kvs",
            "name": "field",
            "addButtonText": "新增字段",
            "keyItem": {
              "label": "字段名",
              "mode": "horizontal"
            },
            "valueItems": [
                {
                  "type": "switch",
                  "name": "primary",
                  "mode": "horizontal",
                  "label": "是否是主键"
                },
                {
                  "type": "select",
                  "name": "type",
                  "label": "字段类型",
                  "mode": "horizontal",
                  "options": [
                    "text",
                    "int",
                    "float"
                  ]
                }
            ]
        }
    ]
}
```

## 嵌套的场景

`valueItems` 可以进一步嵌套，比如里面又嵌一个 `input-kvs` 实现深层结构编辑

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-kvs",
            "name": "dataModel",
            "addButtonText": "新增表",
            "keyItem": {
              "label": "表名",
              "mode": "horizontal",
               "type": "select",
              "options": [
                  "table1",
                  "table2",
                  "table3"
              ]
            },
            "valueItems": [
                {
                  "type": "input-kvs",
                  "addButtonText": "新增字段",
                  "name": "column",
                  "keyItem": {
                    "label": "字段名",
                    "mode": "horizontal",
                    "type": "select",
                    "options": [
                        "id",
                        "title",
                        "content"
                    ]
                  },
                  "valueItems": [
                      {
                        "type": "switch",
                        "name": "primary",
                        "mode": "horizontal",
                        "label": "是否是主键"
                      },
                      {
                        "type": "select",
                        "name": "type",
                        "label": "字段类型",
                        "mode": "horizontal",
                        "options": [
                          "text",
                          "int",
                          "float"
                        ]
                      }
                  ]
              }
            ]
        }
    ]
}
```

前面的嵌套会多一个层级，如果想去掉这个层级 `column`，可以将 `"name": "column"` 改成 `"name": "_value"`，这时值就会直接放入

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-kvs",
            "name": "dataModel",
            "addButtonText": "新增表",
            "keyItem": {
              "label": "表名",
              "mode": "horizontal",
               "type": "select",
              "options": [
                  "table1",
                  "table2",
                  "table3"
              ]
            },
            "valueItems": [
                {
                  "type": "input-kvs",
                  "addButtonText": "新增字段",
                  "name": "_value",
                  "keyItem": {
                    "label": "字段名",
                    "mode": "horizontal",
                    "type": "select",
                    "options": [
                        "id",
                        "title",
                        "content"
                    ]
                  },
                  "valueItems": [
                      {
                        "type": "switch",
                        "name": "primary",
                        "mode": "horizontal",
                        "label": "是否是主键"
                      },
                      {
                        "type": "select",
                        "name": "type",
                        "label": "字段类型",
                        "mode": "horizontal",
                        "options": [
                          "text",
                          "int",
                          "float"
                        ]
                      }
                  ]
              }
            ]
        }
    ]
}
```

除了前面的对象，值也可以是数组，需要配置一下 `valueIsArray`

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-kvs",
            "name": "dataModel",
            "addButtonText": "新增表",
            "valueIsArray": true,
            "keyItem": {
              "label": "表名",
              "mode": "horizontal",
              "type": "select",
              "options": [
                  "table1",
                  "table2",
                  "table3"
              ]
            },
            "valueItems": [
              {
                type: 'checkboxes',
                name: '_value',
                joinValues: false,
                extractValue: true,
                options: [
                  {
                    label: '查询',
                    value: 'select'
                  },
                  {
                    label: '写入',
                    value: 'insert'
                  },
                  {
                    label: '更新',
                    value: 'update'
                  },
                  {
                    label: '删除',
                    value: 'delete'
                  }
                ]
              }

            ]
        }
    ]
}
```
