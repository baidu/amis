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
            "tpl": "<span class='label label-default m-l-sm'><%= data.item %></span> "
        }
    }
}
```

### 如果是对象数组

如果数组中的数据是对象，可以直接使用 data.xxx 来获取，另外能用 data.index 来获取数组索引，但如果对象本身也有名字为 index 的字段就会覆盖到，获取不到索引了。

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
            "tpl": "<span class='label label-default m-l-sm'><%= data.name %>:<%= data.index %></span> "
        }
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
                "tpl": "<span class='label label-info m-l-sm'><%= this.item %></span>"
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
                "tpl": "<span class='label label-info m-l-sm'><%= this.item %></span>"
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
            "tpl": "<span class='label label-default m-l-sm'><%= data.item %></span> "
        }
    }
}
```

`name` 的优先级会比 `source` 更高

## 属性表

| 属性名      | 类型     | 默认值   | 说明                                                                 |
| ----------- | -------- | -------- | -------------------------------------------------------------------- |
| type        | `string` | `"each"` | 指定为 Each 组件                                                     |
| value       | `array`  | `[]`     | 用于循环的值                                                         |
| name        | `string` |          | 获取数据域中变量                                                     |
| source      | `string` |          | 获取数据域中变量， 支持 [数据映射](../../docs/concepts/data-mapping) |
| items       | `object` |          | 使用`value`中的数据，循环输出渲染器。                                |
| placeholder | `string` |          | 当 `value` 值不存在或为空数组时的占位文本                            |
