---
title: Checkboxes 复选框
description:
type: 0
group: null
menuName: Checkboxes
icon:
order: 9
---

用于实现多选。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
        "name": "checkboxes",
        "type": "checkboxes",
        "label": "复选框",
        "options": [
            {
                "label": "OptionA",
                "value": "a"
            },
            {
                "label": "OptionB",
                "value": "b"
            },
            {
                "label": "OptionC",
                "value": "c"
            },
            {
                "label": "OptionD",
                "value": "d"
            }
            ]
        }
    ]
}
```

## 显示全选

通过 `checkAll` 属性配置全选

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
        "name": "checkboxes",
        "type": "checkboxes",
        "label": "复选框",
        "checkAll": true,
        "options": [
            {
                "label": "OptionA",
                "value": "a"
            },
            {
                "label": "OptionB",
                "value": "b"
            },
            {
                "label": "OptionC",
                "value": "c"
            },
            {
                "label": "OptionD",
                "value": "d"
            }
            ]
        }
    ]
}
```

## 按钮模式

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
        "name": "checkboxes",
        "type": "checkboxes",
        "label": "复选框",
        "optionType": "button",
        "options": [
            {
                "label": "OptionA",
                "value": "a"
            },
            {
                "label": "OptionB",
                "value": "b"
            },
            {
                "label": "OptionC",
                "value": "c"
            },
            {
                "label": "OptionD",
                "value": "d"
            }
            ]
        }
    ]
}
```

## 按列显示

设置 `"inline": false`

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
        "name": "checkboxes",
        "type": "checkboxes",
        "label": "复选框",
        "inline": false,
        "options": [
            {
                "label": "OptionA",
                "value": "a"
            },
            {
                "label": "OptionB",
                "value": "b"
            },
            {
                "label": "OptionC",
                "value": "c"
            },
            {
                "label": "OptionD",
                "value": "d"
            }
            ]
        }
    ]
}
```

## 展示多行

可以配置`columnsCount`属性调整展示列的个数

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "checkboxes1",
            "type": "checkboxes",
            "label": "默认的复选框",
            "options": [
                {
                    "label": "OptionA",
                    "value": "a"
                },
                {
                    "label": "OptionB",
                    "value": "b"
                },
                {
                    "label": "OptionC",
                    "value": "c"
                },
                {
                    "label": "OptionD",
                    "value": "d"
                }
            ]
        },
        {
            "type": "divider"
        },
        {
            "name": "checkboxes2",
            "type": "checkboxes",
            "label": "显示两列的复选框",
            "columnsCount": 2,
            "inline": false,
            "options": [
                {
                    "label": "OptionA",
                    "value": "a"
                },
                {
                    "label": "OptionB",
                    "value": "b"
                },
                {
                    "label": "OptionC",
                    "value": "c"
                },
                {
                    "label": "OptionD",
                    "value": "d"
                }
            ]
        }
    ]
}
```

> 1.8.0 及以上版本

`columnsCount` 还有一种数组形式，可以手动控制每行显示的列数

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "name": "checkboxes1",
            "type": "checkboxes",
            "label": "默认的复选框",
            "columnsCount": [1, 2, 3],
            "options": [
                {
                    "label": "OptionA",
                    "value": "a"
                },
                {
                    "label": "OptionB",
                    "value": "b"
                },
                {
                    "label": "OptionC",
                    "value": "c"
                },
                {
                    "label": "OptionD",
                    "value": "d"
                },
                {
                    "label": "OptionE",
                    "value": "e"
                },
                {
                    "label": "OptionF",
                    "value": "f"
                }
            ]
        }
    ]
}
```

## 分组显示

`"inline": false` 下，选项中配置 `children` 字段可以实现分组展示效果。

```schema: scope="body"
{
  "type": "form",
  "mode": "horizontal",
  "body": [
    {
      "type": "checkboxes",
      "name": "checkboxes",
      "label": "城市选择",
      "inline": false,
      "options": [
        {
          "label": "A类型",
          "children": [
            {
              "value": "选项 A-1",
              "label": "a-1"
            },
            {
              "value": "选项 A-2",
              "label": "a-2"
            }
          ]
        },
        {
          "label": "B类型",
          "children": [
            {
              "value": "选项 B-1",
              "label": "b-1"
            },
            {
              "value": "选项 B-2",
              "label": "b-2"
            },
            {
              "value": "选项 B-3",
              "label": "b-3"
            },
            {
              "value": "选项 B-4",
              "label": "b-4"
            }
          ]
        }
      ]
    }
  ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名          | 类型                                      | 默认值       | 说明                                                                                                                |
| --------------- | ----------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| options         | `Array<object>`或`Array<string>`          |              | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                                           |
| source          | `string`或 [API](../../../docs/types/api) |              | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                                        |
| delimiter       | `string`                                  | `,`          | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                                           |
| labelField      | `string`                                  | `"label"`    | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield)                         |
| valueField      | `string`                                  | `"value"`    | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)                                    |
| joinValues      | `boolean`                                 | `true`       | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                                          |
| extractValue    | `boolean`                                 | `false`      | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)                                      |
| columnsCount    | `number`                                  | `1`          | 选项按几列显示，默认为一列                                                                                          |
| checkAll        | `boolean`                                 | `false`      | 是否支持全选                                                                                                        |
| inline          | `boolean`                                 | `true`       | 是否显示为一行                                                                                                      |
| defaultCheckAll | `boolean`                                 | `false`      | 默认是否全选                                                                                                        |
| creatable       | `boolean`                                 | `false`      | [新增选项](./options#%E5%89%8D%E7%AB%AF%E6%96%B0%E5%A2%9E-creatable)                                                |
| createBtnLabel  | `string`                                  | `"新增选项"` | [新增选项](./options#%E6%96%B0%E5%A2%9E%E9%80%89%E9%A1%B9)                                                          |
| addControls     | Array<[表单项](./formitem)>               |              | [自定义新增表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%B0%E5%A2%9E%E8%A1%A8%E5%8D%95%E9%A1%B9-addcontrols)  |
| addApi          | [API](../../docs/types/api)               |              | [配置新增选项接口](./options#%E9%85%8D%E7%BD%AE%E6%96%B0%E5%A2%9E%E6%8E%A5%E5%8F%A3-addapi)                         |
| editable        | `boolean`                                 | `false`      | [编辑选项](./options#%E5%89%8D%E7%AB%AF%E7%BC%96%E8%BE%91-editable)                                                 |
| editControls    | Array<[表单项](./formitem)>               |              | [自定义编辑表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BC%96%E8%BE%91%E8%A1%A8%E5%8D%95%E9%A1%B9-editcontrols) |
| editApi         | [API](../../docs/types/api)               |              | [配置编辑选项接口](./options#%E9%85%8D%E7%BD%AE%E7%BC%96%E8%BE%91%E6%8E%A5%E5%8F%A3-editapi)                        |
| removable       | `boolean`                                 | `false`      | [删除选项](./options#%E5%88%A0%E9%99%A4%E9%80%89%E9%A1%B9)                                                          |
| deleteApi       | [API](../../docs/types/api)               |              | [配置删除选项接口](./options#%E9%85%8D%E7%BD%AE%E5%88%A0%E9%99%A4%E6%8E%A5%E5%8F%A3-deleteapi)                      |

## 事件表

| 事件名称 | 事件参数               | 说明                 |
| -------- | ---------------------- | -------------------- |
| change   | `value: string` 选中值 | 选中值发生变化时触发 |

## 动作表

| 动作名称 | 动作配置                 | 说明                                                   |
| -------- | ------------------------ | ------------------------------------------------------ |
| clear    | -                        | 清空                                                   |
| reset    | -                        | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| reload   | -                        | 刷新（重新加载），只针对配置了`source`的点选按钮有效   |
| setValue | `value: string` 更新的值 | 更新数据，多个值用`,`分隔                              |
