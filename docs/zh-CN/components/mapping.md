---
title: Mapping 映射
description:
type: 0
group: ⚙ 组件
menuName: Mapping 映射
icon:
order: 57
---

## 基本用法

```schema
{
    "type": "page",
    "body": {
        "type": "mapping",
        "value": "1",
        "map": {
            "1": "第一",
            "2": "第二",
            "3": "第三",
            "*": "其他"
        }
    }
}
```

## 渲染 HTML

```schema
{
    "type": "page",
    "body": {
        "type": "mapping",
        "value": "2",
        "map": {
            "1": "<span class='label label-info'>漂亮</span>",
            "2": "<span class='label label-success'>开心</span>",
            "3": "<span class='label label-danger'>惊吓</span>",
            "4": "<span class='label label-warning'>紧张</span>",
            "*": "<span class='label label-default'>其他：${type}</span>"
        }
    }
}
```

## 渲染其它组件

映射的值也可以是 amis schema，渲染其它组件

```schema
{
    "type": "page",
    "body": {
        "type": "mapping",
        "value": "1",
        "map": {
            "1":  {
                "type": "tag",
                "label": "#4096ff",
                "displayMode": "rounded",
                "color": "#4096ff"
            },
            "2":  {
                "type": "tpl",
                "tpl": "2"
            },
            "*": "其他"
        }
    }
}
```

## 支持数组

> 1.5.0 及以上版本

如果返回值是数组会显示为多个

```schema
{
    "type": "page",
    "body": {
        "type": "mapping",
        "value": ["1", "2", "3", "4", "5"],
        "map": {
            "1": "<span class='label label-info'>漂亮</span>",
            "2": "<span class='label label-success'>开心</span>",
            "3": "<span class='label label-danger'>惊吓</span>",
            "4": "<span class='label label-warning'>紧张</span>",
            "*": "<span class='label label-default'>其他</span>"
        }
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
                "type": "1"
            },
            {
                "id": "2",
                "type": "2"
            },
            {
                "id": "3",
                "type": "3"
            }
        ]
    },
    "columns": [
        {
            "name": "id",
            "label": "Id"
        },
        {
            "name": "type",
            "label": "映射",
            "type": "mapping",
            "map": {
                "1": "<span class='label label-info'>漂亮</span>",
                "2": "<span class='label label-success'>开心</span>",
                "3": "<span class='label label-danger'>惊吓</span>",
                "4": "<span class='label label-warning'>紧张</span>",
                "*": "其他：${type}"
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
        "type": "2"
    },
    "body": [
        {
            "type": "static-mapping",
            "name": "type",
            "label": "映射",
            "map": {
                "1": "<span class='label label-info'>漂亮</span>",
                "2": "<span class='label label-success'>开心</span>",
                "3": "<span class='label label-danger'>惊吓</span>",
                "4": "<span class='label label-warning'>紧张</span>",
                "*": "其他：${type}"
            }
        }
    ]
}
```

### 布尔值映射

```schema: scope="body"
{
    "type": "form",
    "data": {
        "type": true
    },
    "body": [
        {
            "type": "static-mapping",
            "name": "type",
            "label": "映射",
            "map": {
                "1": "<span class='label label-info'>开</span>",
                "0": "<span class='label label-default'>关</span>"
            }
        }
    ]
}
```

或者

```schema: scope="body"
{
    "type": "form",
    "data": {
        "type": true
    },
    "body": [
        {
            "type": "static-mapping",
            "name": "type",
            "label": "映射",
            "map": {
                "true": "<span class='label label-info'>开</span>",
                "false": "<span class='label label-default'>关</span>"
            }
        }
    ]
}
```

### 远程拉取字典

> since 1.1.6

通过配置 `source` 接口来实现，接口返回字典对象即可，数据格式参考 map 配置。

```schema: scope="body"
{
    "type": "form",
    "data": {
        "type": "2"
    },
    "body": [
        {
            "type": "mapping",
            "name": "type",
            "label": "映射",
            "source": "/api/mapping"
        }
    ]
}
```

> 默认 source 是有 30s 缓存的，通常字典数据不长变更。如果想修改，请参考 [API](../../../docs/types/api) 文档配置缓存。

### 关联上下文变量

> since 1.1.6

同样通过配置 `source` 来实现，只是格式是取变量。

> 注意：当数据域里的变量值为`$$`时, 表示将所有接口返回的`data`字段值整体赋值到对应的 key 中

```schema: scope="body"
{
    "type": "form",
    "initApi": {
        "url": "/api/mapping",
        "method": "get",
        "responseData": {
            "zidian": "$$$$",
            "type": "2"
        }
    },
    "body": [
        {
            "type": "mapping",
            "name": "type",
            "label": "映射",
            "source": "$${zidian}"
        }
    ]
}
```

## 占位文本

通过 `placeholder` 可以控制数据不存在时的展现

```schema
{
    "type": "page",
    "body": {
        "type": "mapping",
        "placeholder": "数据不存在",
        "map": {
            "1": "第一",
            "2": "第二",
            "3": "第三",
            "*": "其他"
        }
    }
}
```

## 属性表

| 属性名      | 类型              | 默认值 | 说明                                                                              |
| ----------- | ----------------- | ------ | --------------------------------------------------------------------------------- |
| className   | `string`          |        | 外层 CSS 类名                                                                     |
| placeholder | `string`          |        | 占位文本                                                                          |
| map         | `object`          |        | 映射配置                                                                          |
| source      | `string` or `API` |        | [API](../../../docs/types/api) 或 [数据映射](../../../docs/concepts/data-mapping) |
