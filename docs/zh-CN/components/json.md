---
title: Json
description:
type: 0
group: ⚙ 组件
menuName: Json
icon:
order: 54
---

JSON 展示组件

## 基本用法

可以配置 `value` 展示 `json` 格式数据

```schema
{
    "type": "page",
    "body": {
        "type": "json",
        "value": {
            "a": "a",
            "b": "b",
            "c": {
                "d": "d"
            }
        }
    }
}
```

## 获取数据链值

也可以通过配置 `source` 获取数据链中的值

```schema
{
    "type": "page",
    "data":{
        "json":{
            "a": "a",
            "b": {
                "c": "c"
            }
        }
    },
    "body": {
        "type": "json",
        "source": "${json}"
    }
}
```

## 用作 Field 时

当用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中时，可以设置`name`属性，映射同名变量

### Table 中的列类型

```schema: scope="body"
{
    "type": "table",
    "data": {
        "items": [
            {
                "id": "1",
                "json": {
                    "a": "a1",
                    "b": {
                        "c": "c1"
                    }
                }
            },
            {
                "id": "2",
                "json": {
                    "a": "a2",
                    "b": {
                        "c": "c2"
                    }
                }
            },
            {
                "id": "3",
                "json": {
                    "a": "a3",
                    "b": {
                        "c": "c3"
                    }
                }
            }
        ]
    },
    "columns": [
        {
            "name": "id",
            "label": "Id"
        },

        {
            "name": "json",
            "label": "颜色",
            "type": "json"
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
        "json": {
            "a": "a",
            "b": {
                "c": "c"
            }
        }
    },
    "body": [
        {
            "type": "control",
            "name": "json",
            "label": "Json",
            "body": {
                "type": "json"
            }
        }
    ]
}
```

## 主题

可配置`jsonTheme`，指定显示主题，可选`twilight`和`eighties`，默认为`twilight`。

```schema: scope="body"
[
{
    "type": "json",
    "value": {
        "a": "a",
        "b": "b",
        "c": {
            "d": "d"
        }
    }
},
{
    "type": "divider"
},
{
    "type": "json",
    "jsonTheme": "eighties",
    "value": {
        "a": "a",
        "b": "b",
        "c": {
            "d": "d"
        }
    }
}
]
```

## 配置默认展开层级

```schema
{
    "type": "page",
    "body": {
        "type": "json",
        "levelExpand": 0,
        "value": {
            "a": "a",
            "b": "b",
            "c": {
                "d": "d"
            }
        }
    }
}
```

如上，`levelExpand`配置为`0`，则默认不展开。

## 开启 json 修改

> since 1.2.3

可配置`mutable` 为 true，展示 json 的同时支持修改。记得配置 name 属性。

```schema: scope="body"
[
{
    "type": "json",
    "name": "json",
    "mutable": true,
    "value": {
        "a": "a",
        "b": "b",
        "c": {
            "d": "d"
        }
    }
}
]
```

## 属性表

| 属性名      | 类型              | 默认值     | 说明                                                                                 |
| ----------- | ----------------- | ---------- | ------------------------------------------------------------------------------------ |
| type        | `string`          |            | 如果在 Table、Card 和 List 中，为`"json"`；在 Form 中用作静态展示，为`"static-json"` |
| className   | `string`          |            | 外层 CSS 类名                                                                        |
| value       | `object`/`string` |            | json 值，如果是 string 会自动 parse                                                  |
| source      | `string`          | `''`       | 通过数据映射获取数据链中的值                                                         |
| placeholder | `string`          | `-`        | 占位文本                                                                             |
| levelExpand | `number`          | `1`        | 默认展开的层级                                                                       |
| jsonTheme   | `string`          | `twilight` | 主题，可选`twilight`和`eighties`                                                     |
| mutable     | `boolean`         | `false`    | 是否可修改                                                                           |
