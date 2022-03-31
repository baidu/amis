---
title: Steps 步骤条
description:
type: 0
group: ⚙ 组件
menuName: Steps
icon:
order: 68
---

步骤条组件

## 基本用法

```schema
{
  "type": "page",
  "body": [
    {
      "type": "steps",
      "value": 1,
      "steps": [
        {
          "title": "Frist",
          "subTitle": "this is subTitle",
          "description": "this is description"
        },
        {
          "title": "Second"
        },
        {
          "title": "Last"
        }
      ]
    }
  ]
}
```

## 设置状态

```schema
{
  "type": "page",
  "body": {
    "type": "steps",
    "value": 1,
    "status": "error",
    "steps": [
      {
        "title": "First"
      },
      {
        "title": "Second",
        "subTitle": "this is subTitle",
        "description": "this is description"
      },
      {
        "title": "Last"
      }
    ]
  }
}
```

## 指定步骤条方向

```schema
{
  "type": "page",
  "body": {
    "type": "steps",
    "mode": 'vertical',
    "value": 1,
    "steps": [
      {
        "title": "First",
        "subTitle": "this is subTitle",
        "description": "this is description"
      },
      {
        "title": "Second",
        "subTitle": "this is subTitle",
        "description": "this is description"
      },
      {
        "title": "Last",
        "subTitle": "this is subTitle",
        "description": "this is description"
      }
    ]
  }
}
```

## 指定标签放置位置

```schema
{
  "type": "page",
  "body": {
    "type": "steps",
    "value": 1,
    "labelPlacement": "vertical",
    "steps": [
      {
        "title": "First",
        "subTitle": "this is subTitle",
        "description": "this is description"
      },
      {
        "title": "Second",
        "subTitle": "this is subTitle",
        "description": "this is description"
      },
      {
        "title": "Last",
        "subTitle": "this is subTitle",
        "description": "this is description"
      }
    ]
  }
}
```

## 点状步骤条

```schema
{
  "type": "page",
  "body": {
    "type": "steps",
    "value": 1,
    "progressDot": true,
    "steps": [
      {
        "title": "First",
        "subTitle": "this is subTitle",
        "description": "this is description"
      },
      {
        "title": "Second",
        "subTitle": "this is subTitle",
        "description": "this is description"
      },
      {
        "title": "Last",
        "subTitle": "this is subTitle",
        "description": "this is description"
      }
    ]
  }
}
```
## 数据映射

当前处于第几步统一通过 `name` 关联变量名，其他配置可通过 `"${xxx}"` 关联上下文变量。

```schema
{
  "type": "page",
  "data": {
    "step": 1,
    "status": "error",
    "secondTitle": "Second"
  },
  "body": [
    {
      "type": "steps",
      "name": "step",
      "status": "${status}",
      "steps": [
        {
          "title": "First",
          "subTitle": "this is subTitle",
          "description": "this is description"
        },
        {
          "title": "${secondTitle}"
        },
        {
          "title": "Last"
        }
      ]
    }
  ]
}
```

## 接口映射

接口返回的数据也是一样，都会在同一个数据域，所以取值方式是一样的。

```schema
{
  "type": "page",
  "initApi": "/api/mock2/steps/get",
  "body": [
    {
      "type": "steps",
      "name": "step",
      "status": "${status}",
      "steps": [
        {
          "title": "First",
          "subTitle": "this is subTitle",
          "description": "this is description"
        },
        {
          "title": "Secord"
        },
        {
          "title": "Last"
        }
      ]
    }
  ]
}
```

## Form 中静态展示

```schema
{
  "type": "page",
  "body": {
    "type": "form",
    "initApi": "/api/mock2/steps/steps",
    "body": [
      {
        "type": "steps",
        "source": "${steps}",
        "name": "current"
      }
    ]
  }
}
```

## 远程拉取

除了可以通过数据映射获取当前数据域中的变量以外，source 还支持配置接口，格式为 API，用于动态返回选项组。

```schema
{
  "type": "page",
  "body": {
    "type": "form",
    "body": [
      {
        "type": "steps",
        "name": "steps",
        "source": "/api/mock2/steps/steps"
      }
    ]
  }
}
```

远程拉取接口时，返回的数据结构除了需要满足 amis 接口要求的基本数据结构 以外，必须用"steps"作为选项组的 key 值，如下：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "steps": [
      {
        "title": "First",
        "subTitle": "this is sub title",
        "value": "first"
      },
      {
        "title": "Secord",
        "description": "this is description",
        "value": "secord"
      },
      {
        "title": "Last",
        "value": "last"
      }
    ]
  }
}
```

## 自定义不同步骤以及状态

```schema
{
  "type": "page",
  "body": {
    "type": "steps",
    "value": "b",
    "status": {
      "a": "finish",
      "b": "error",
      "c": "wait"
    },
    "steps": [
      {
        "title": "First",
        "value": "a"
      },
      {
        "title": "Second",
        "subTitle": "this is subTitle",
        "description": "this is description",
        "value": "b"
      },
      {
        "title": "Third",
        "value": "c"
      }
    ]
  }
}
```

## 属性表

| 属性名    | 类型                                                                              | 默认值       | 说明                                                                 |
| --------- | --------------------------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| type      | `string`                                                                          |              | `"steps"` 指定为 步骤条 渲染器                                       |
| steps     | Array<[step](#step)>                                                              | []           | 数组，配置步骤信息                                                   |
| source    | [API](../../../docs/types/api) 或 [数据映射](../../../docs/concepts/data-mapping) |              | 选项组源，可通过数据映射获取当前数据域变量、或者配置 API 对象        |
| name      | `string`                                                                          |              | 关联上下文变量                                                       |
| value     | `string` \| `number`                                                              | `-`          | 设置默认值，注意不支持表达式                                         |
| status    | [StepStatus](#StepStatus) \| {[propName: string]: stepStatus;}                    | `-`          | 状态                                                                 |
| className | `string`                                                                          | `-`          | 自定义类名                                                           |
| mode      | `horizontal` \| `vertical`                                                        | `horizontal` | 指定步骤条方向。目前支持水平（horizontal）和竖直（vertical）两种方向 |
| labelPlacement      | `horizontal` \| `vertical`                                                        | `horizontal` | 指定标签放置位置，默认水平放图标右侧，可选 (vertical) 放图标下方 |
| progressDot      | `boolean`                                                        | `false` | 点状步骤条 |
### step

| 属性名      | 类型                                                  | 默认值 | 说明                                    |
| ----------- | ----------------------------------------------------- | ------ | --------------------------------------- |
| title       | `string` \| [SchemaNode](../../docs/types/schemanode) |        | 标题                                    |
| subTitle    | `string` \| [SchemaNode](../../docs/types/schemanode) |        | 子标题                                  |
| description | `string` \| [SchemaNode](../../docs/types/schemanode) |        | 详细描述                                |
| icon        | `string`                                              |        | icon 名，支持 fontawesome v4 或使用 url |
| value       | `string`                                              |        | value                                   |
| className   | `string`                                              |        | 自定义类名                              |

### StepStatus

`wait` | `process` | `finish` | `error`
