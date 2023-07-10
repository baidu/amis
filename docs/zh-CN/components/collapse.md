---
title: Collapse 折叠器
description:
type: 0
group: ⚙ 组件
menuName: Collapse 折叠器
icon:
order: 36
---

## 基本用法

```schema: scope="body"
{
    "type": "collapse-group",
    "activeKey": ["1"],
    "body": [
      {
        "type": "collapse",
        "key": "1",
        "header": "标题1",
        "body": "这里是内容1"
      },
      {
        "type": "collapse",
        "key": "2",
        "header": "标题2",
        "body": "这里是内容2"
      },
      {
        "type": "collapse",
        "key": "3",
        "header": "标题3",
        "body": "这里是内容3"
      }
    ]
}
```

## 手风琴模式

```schema: scope="body"
{
    "type": "collapse-group",
    "activeKey": ["1"],
    "accordion": true,
    "body": [
      {
        "type": "collapse",
        "key": "1",
        "header": "标题1",
        "body": "这里是内容1"
      },
      {
        "type": "collapse",
        "key": "2",
        "header": "标题2",
        "body": "这里是内容2"
      },
      {
        "type": "collapse",
        "key": "3",
        "header": "标题3",
        "body": "这里是内容3"
      }
    ]
}
```

## 自定义图标

```schema: scope="body"
{
    "type": "collapse-group",
    "activeKey": ["1"],
    "expandIcon": {
      "type": "icon",
      "icon": "caret-right"
    },
    "body": [
      {
        "type": "collapse",
        "key": "1",
        "header": "标题1",
        "body": "这里是内容1"
      },
      {
        "type": "collapse",
        "key": "2",
        "header": "标题2",
        "body": "这里是内容2"
      },
      {
        "type": "collapse",
        "key": "3",
        "header": "标题3",
        "body": "这里是内容3"
      }
    ]
}
```

## 设置图标位置

```schema: scope="body"
{
    "type": "collapse-group",
    "expandIconPosition": "right",
    "activeKey": ["1"],
    "body": [
      {
        "type": "collapse",
        "key": "1",
        "header": "标题1",
        "body": "这里是内容1"
      },
      {
        "type": "collapse",
        "key": "2",
        "header": "标题2",
        "body": "这里是内容2"
      },
      {
        "type": "collapse",
        "key": "3",
        "header": "标题3",
        "body": "这里是内容3"
      }
    ]
}
```

## 面板嵌套

```schema: scope="body"
{
    "type": "collapse-group",
    "activeKey": ["1"],
    "body": [
      {
        "type": "collapse",
        "key": "1",
        "header": "标题1",
        "body": {
          "type": "collapse-group",
          "activeKey": ["1"],
          "body": [
            {
              "type": "collapse",
              "key": "1",
              "header": "嵌套面板标题",
              "body": "嵌套面板内容"
            }
          ]
        }
      },
      {
        "type": "collapse",
        "key": "2",
        "header": "标题2",
        "body": "这里是内容2"
      }
    ]
}
```

## 折叠面板禁用

```schema: scope="body"
{
    "type": "collapse-group",
    "activeKey": ["1"],
    "body": [
      {
        "type": "collapse",
        "key": "1",
        "header": "标题1",
        "body": "这里是内容1"
      },
      {
        "type": "collapse",
        "disabled": true,
        "key": "2",
        "header": "标题2",
        "body": "这里是内容2"
      }
    ]
}
```

## 折叠面板图标隐藏

```schema: scope="body"
{
    "type": "collapse-group",
    "body": [
      {
        "type": "collapse",
        "key": "1",
        "header": "标题1",
        "body": "这里是内容1"
      },
      {
        "type": "collapse",
        "showArrow": false,
        "key": "2",
        "header": "标题2",
        "body": "这里是内容2"
      }
    ]
}
```

## CollapseGroup 属性表

| 属性名             | 类型                                                   | 默认值             | 说明                                |
| ------------------ | ------------------------------------------------------ | ------------------ | ----------------------------------- |
| type               | `string`                                               | `"collapse-group"` | 指定为 collapse-group 渲染器        |
| activeKey          | `Array<string \| number \| never> \| string \| number` | -                  | 初始化激活面板的 key                |
| accordion          | `boolean`                                              | `false`            | 手风琴模式                          |
| expandIcon         | `SchemaNode`                                           | -                  | 自定义切换图标                      |
| expandIconPosition | `string`                                               | `"left"`           | 设置图标位置，可选值`left \| right` |

## CollapseGroup 事件表

当前组件会对外派发以下事件，可以通过 onEvent 来监听这些事件，并通过 actions 来配置执行的动作，在 actions 中可以通过${事件参数名}或${event.data.[事件参数名]}来获取事件产生的数据，详细查看事件动作。

| 事件名称 | 事件参数                                                                                                                                        | 说明                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| change   | `activeKeys: Array<string \| number>` 当前展开的索引列表 <br /> `collapseId: string \| number` 折叠器索引 <br/> `collapsed: boolean` 折叠器状态 | 折叠面板折叠状态改变时触发 |

### change

折叠面板折叠状态改变时触发。

```schema: scope="body"
{
  "type": "collapse-group",
  "activeKey": [
    "1"
  ],
  "body": [
    {
      "type": "collapse",
      "key": "1",
      "active": true,
      "header": "标题1",
      "body": [
        {
          "type": "tpl",
          "tpl": "这里是内容1",
          "wrapperComponent": "",
          "inline": false,
          "id": "u:757ad799da08"
        }
      ],
      "id": "u:b1b68dfbb08d"
    },
    {
      "type": "collapse",
      "key": "2",
      "header": "标题2",
      "body": [
        {
          "type": "tpl",
          "tpl": "这里是内容1",
          "wrapperComponent": "",
          "inline": false,
          "id": "u:92caa03f227e"
        }
      ],
      "id": "u:621a22c8b18c"
    }
  ],
  "id": "u:23e4c5ec9c89",
  "onEvent": {
    "change": {
      "weight": 0,
      "actions": [
        {
          "actionType": "toast",
          "args": {
            "msgType": "info",
            "position": "top-right",
            "closeButton": true,
            "showIcon": true,
            "title": "折叠状态改变",
            "msg": "activeKeys: ${event.data.activeKeys | json}, collapseId: ${event.data.collapseId}, collapsed: ${event.data.collapsed}",
            "className": "theme-toast-action-scope"
          }
        }
      ]
    }
  }
}
```

## Collapse 属性表

| 属性名    | 类型                   | 默认值       | 说明                   |
| --------- | ---------------------- | ------------ | ---------------------- |
| type      | `string`               | `"collapse"` | 指定为 collapse 渲染器 |
| disabled  | `boolean`              | `false`      | 禁用                   |
| collapsed | `boolean`              | `true`       | 初始状态是否折叠       |
| key       | `string \| number`     | -            | 标识                   |
| header    | `string \| SchemaNode` | -            | 标题                   |
| body      | `string \| SchemaNode` | -            | 内容                   |
| showArrow | `boolean`              | `true`       | 是否展示图标           |

## Collapse 事件表

当前组件会对外派发以下事件，可以通过 onEvent 来监听这些事件，并通过 actions 来配置执行的动作，在 actions 中可以通过${事件参数名}或${event.data.[事件参数名]}来获取事件产生的数据，详细查看事件动作。

| 事件名称 | 事件参数                        | 说明                     |
| -------- | ------------------------------- | ------------------------ |
| change   | `collapsed: boolean` 折叠器状态 | 折叠器折叠状态改变时触发 |

### change

折叠面板折叠状态改变时触发。

```schema: scope="body"
{
  "type": "collapse",
  "header": "标题",
  "body": [
    {
      "type": "tpl",
      "tpl": "内容",
      "wrapperComponent": "",
      "inline": false,
      "id": "u:6588c12ee3b0"
    }
  ],
  "id": "u:62aa2f0c7fd9",
  "onEvent": {
    "change": {
      "weight": 0,
      "actions": [
        {
          "actionType": "toast",
          "args": {
            "msgType": "info",
            "position": "top-right",
            "closeButton": true,
            "showIcon": true,
            "title": "collapsedChange",
            "msg": "collapsed: ${event.data.collapsed}",
            "className": "theme-toast-action-scope"
          }
        }
      ]
    }
  }
}
```
