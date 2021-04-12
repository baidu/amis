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
          "title": "First",
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

## Form 中静态展示

```schema
{
  "type": "form",
  "data": {
    "step": 1
  },
  "controls": [
    {
      "type": "steps",
      "name": "step",
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
  ]
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
      "c": "wait",
      "d": "error"
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
      },
      {
        "title": "Last",
        "value": "d"
      }
    ]
  }
}
```

## 属性表

| 属性名 | 类型                                                           | 默认值 | 说明                                                 |
| ------ | -------------------------------------------------------------- | ------ | ---------------------------------------------------- |
| type   | `string`                                                       |        | `"steps"` 指定为 步骤条 渲染器                       |
| steps  | Array<[step](#step)>                                           | []     | 数组，配置步骤信息                                   |
| value  | `string` \| `number`                                           | `-`    | 指定当前步骤，如果是`string`需要在 step 中配置 value |
| status | [StepStatus](#StepStatus) \| {[propName: string]: stepStatus;} | `-`    | 状态                                                 |

### step

| 属性名   | 类型     | 默认值 | 说明                                    |
| -------- | -------- | ------ | --------------------------------------- |
| title    | `string` | `-`    | 标题                                    |
| subTitle | `string` | `-`    | 子标题                                  |
| icon     | `string` |        | icon 名，支持 fontawesome v4 或使用 url |
| value    | `string` |        | value                                   |

### StepStatus

`wait` | `process` | `finish` | `error`
