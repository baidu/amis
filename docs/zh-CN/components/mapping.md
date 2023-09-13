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

> 配置了`itemSchema`后，映射值不会再作为`schema`渲染

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

## 渲染 自定义模板

> since 2.5.2

可配置`itemSchema` 渲染自定义模板，支持`HTML`或`schema`；  
当映射值是`非object`时，可使用`${item}`获取映射值；

### html 或字符串模板

使用`${item}` 获取映射值

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
        },
        "itemSchema": "自定义模板：<span style='color: red'>${item}</span>"
    }
}
```

### SchemaNode 模板

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
        },
        "itemSchema": {
            "type": "tag",
            "label": "${item}"
        }
    }
}
```

### 在模板中渲染数据

- 当映射值是`object`时，使用模板语法可获取`object`属性值
- 当映射值是`非object`时，使用`${item}` 获取映射值
- 也可以获取数据域中的其他数据

```schema
{
    "type": "page",
    "data": {
        "myName": "cat"
    },
    "body": {
        "type": "mapping",
        "value": "1",
        "map": {
            "1": {
                "label": "开心",
                "color": "red"
            },
            "2": {
                "label": "伤心",
                "color": "blue"
            },
            "3": {
                "label": "冷漠",
                "color": "gray"
            },
            "*": "其他"
        },
        "itemSchema": {
            "type": "tag",
            "label": "${myName} ${label}",
            "color": "${color}"
        }
    }
}
```

## 映射展示多个

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

## map 映射源

### k-v 对象

```json
{
  "type": "mapping",
  "value": "1",
  "map": {
    "1": "第一",
    "2": "第二",
    "3": "第三",
    "*": "其他"
  }
}
```

### 对象数组

> since 2.5.2

#### 简单对象数组

```json
{
  "type": "mapping",
  "value": "1",
  "map": [{"1": "第一"}, {"2": "第二"}, {"3": "第三"}, {"*": "其他"}]
}
```

#### 多 key 对象数组

当映射值有多个 key 时，需要使用`valueField`指定字段作为`mapping`的`key`, 也就是用来匹配`value`的值  
可使用`labelField`指定展示字段，不配置时，默认为`label`  
**注意：**配置`labelField`后，映射值无法再作为`schema`渲染

```json
{
  "type": "mapping",
  "value": "happy",
  "valueField": "name",
  "map": [
    {
      "name": "happy",
      "label": "开心"
    },
    {
      "name": "sad",
      "label": "悲伤"
    },
    {
      "name": "*",
      "label": "其他"
    }
  ]
}
```

```schema
{
    "type": "page",
    "body": {
        "type": "mapping",
        "value": "happy",
        "valueField": "name",
        "labelField": "label",
        "map": [
            {
                "name": "happy",
                "label": "开心",
                "color": "red"
            },
            {
                "name": "sad",
                "label": "悲伤",
                "color": "blue"
            },
            {
                "name": "*",
                "label": "其他",
                "color": "gray"
            }
        ]
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

| 属性名      | 类型                                                | 默认值 | 说明                                                                                                                                                                                                                                        |
| ----------- | --------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className   | `string`                                            |        | 外层 CSS 类名                                                                                                                                                                                                                               |
| placeholder | `string`                                            |        | 占位文本                                                                                                                                                                                                                                    |
| map         | `object`或`Array<object>`                           |        | 映射配置                                                                                                                                                                                                                                    |
| source      | `string` or `API`                                   |        | [API](../../../docs/types/api) 或 [数据映射](../../../docs/concepts/data-mapping)                                                                                                                                                           |
| valueField  | `string`                                            | value  | `2.5.2` map 或 source 为`Array<object>`时，用来匹配映射的字段名                                                                                                                                                                             |
| labelField  | `string`                                            | label  | `2.5.2` map 或 source 为`Array<object>`时，用来展示的字段名<br />注：配置后映射值无法作为`schema`组件渲染                                                                                                                                   |
| itemSchema  | `string`或[SchemaNode](../../docs/types/schemanode) |        | `2.5.2` 自定义渲染模板，支持`html`或`schemaNode`；<br /> 当映射值是`非object`时，可使用`${item}`获取映射值；<br />当映射值是`object`时，可使用映射语法: `${xxx}`获取`object`的值；<br /> 也可使用数据映射语法：`${xxx}`获取数据域中变量值。 |
