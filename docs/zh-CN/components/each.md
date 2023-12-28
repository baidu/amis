---
title: Each 循环渲染器
description:
type: 0
group: ⚙ 组件
menuName: Each 循环渲染器
icon:
order: 45
---

## 基本用法

通过 name 属性指定要循环的数组，items 属性指定循环的内容。

```schema: scope="page"
{
  "type": "page",
  "data": {
    "arr": ["A", "B", "C"]
  },
  "body": {
        "type": "each",
        "name": "arr",
        "items": {
            "type": "tpl",
            "tpl": "<span class='label label-default m-l-sm'>${item}</span> "
        }
    }
}
```

### 如果是对象数组

如果数组中的数据是对象，可以直接使用内部变量 xxx 来获取，或者通过 `item.xxxx`。另外能用 index 来获取数组索引。

> 如果成员对象本身也有名字为 index 的字段就会覆盖到，获取不到索引了，请查看「循环嵌套」的章节解决

```schema:height="160" scope="page"
{
  "type": "page",
  "data": {
    "arr": [{"name": "a"}, {"name": "b"}, {"name": "c"}]
  },
  "body": {
        "type": "each",
        "name": "arr",
        "items": {
            "type": "tpl",
            "tpl": "<span class='label label-default m-l-sm'>${name}:${index}</span> "
        }
    }
}
```

### 循环嵌套

如果存在嵌套使用，通过默认的 `item` 或者 `index` 始终是拿的最里面那层的信息，想要获取上层 each 的信息，则需要自定义 `itemKeyName` 和 `indexKeyName` 来指定字段名。

```schema:height="160" scope="page"
{
  "type": "page",
  "data": {
    "arr": [{"name": "a", "subList": ["a1", "a2"]}, {"name": "b", "subList": ["b1", "b2"]}, {"name": "c", "subList": ["c1", "c2"]}]
  },
  "body": {
        "type": "each",
        "name": "arr",
        "itemKeyName": "itemOutter",
        "indexKeyName": "indexOutter",
        "items": [
            {
                "type": "tpl",
                "inline": false,
                "tpl": "<span class='label label-default m-l-sm'>${name}:${index}</span> "
            },

            {
                "type": "each",
                "name": "subList",
                "items": [
                    {
                        "type": "tpl",
                        "tpl": "<span class='label label-default m-l-sm'>${itemOutter.name}-${item}:${indexOutter}-${index}</span> "
                    }
                ]
            }
        ]
    }
}
```

## 用作 Field 时

当用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中时，可以设置`name`属性，映射同名变量，然后用可以通过 `item` 变量获取单项值

### Table 中的列类型

```schema: scope="body"
{
    "type": "table",
    "data": {
        "items": [
            {
                "id": "1",
                "each": ["A1", "B1", "C1"]
            },
            {
                "id": "2",
                "each": ["A2", "B2", "C2"]
            },
            {
                "id": "3",
                "each": []
            }
        ]
    },
    "columns": [
        {
            "name": "id",
            "label": "Id"
        },

        {
            "name": "each",
            "label": "循环",
            "type": "each",
            "placeholder": "暂无内容",
            "items": {
                "type": "tpl",
                "tpl": "<span class='label label-info m-l-sm'>${item}</span>"
            }
        }
    ]
}
```

List 的内容、Card 卡片的内容配置同上

### Form 中静态展示

```schema: scope="body"
{
    "type": "form",
    "data": {
        "each": ["A", "B", "C"]
    },
    "body": [
        {
            "type": "each",
            "label": "静态展示each",
            "name": "each",
            "items": {
                "type": "tpl",
                "tpl": "<span class='label label-info m-l-sm'>${item}</span>"
            }
        }
    ]
}
```

## 使用数据映射

```schema: scope="page"
{
  "type": "page",
  "data": {
    "arr": ["A", "B", "C"]
  },
  "body": {
        "type": "each",
        "source": "${arr}",
        "items": {
            "type": "tpl",
            "tpl": "<span class='label label-default m-l-sm'>${item}</span> "
        }
    }
}
```

`name` 的优先级会比 `source` 更高

## 动态表单项

> 3.5.0 版本开始支持

表单项支持通过表达式配置动态表单项，可结合 `each` 组件一起使用。

```schema: scope="page"
{
  "type": "page",
  "data": {
    "arr": ["A", "B", "C"]
  },
  "body": [
    {
        type: "form",
        debug: true,
        body: [
            {
                "type": "each",
                "source": "${arr}",
                "items": {
                    "type": "input-text",
                    "label": "Input${item}",
                    "name": "text${index}"
                }
            }
        ]
    }
  ]
}
```

## 属性表

| 属性名       | 类型     | 默认值   | 说明                                                                 |
| ------------ | -------- | -------- | -------------------------------------------------------------------- |
| type         | `string` | `"each"` | 指定为 Each 组件                                                     |
| value        | `array`  | `[]`     | 用于循环的值                                                         |
| name         | `string` |          | 获取数据域中变量                                                     |
| source       | `string` |          | 获取数据域中变量， 支持 [数据映射](../../docs/concepts/data-mapping) |
| items        | `object` |          | 使用`value`中的数据，循环输出渲染器。                                |
| placeholder  | `string` |          | 当 `value` 值不存在或为空数组时的占位文本                            |
| itemKeyName  | `string` | `item`   | 获取循环当前数组成员                                                 |
| indexKeyName | `string` | `index`  | 获取循环当前索引                                                     |
