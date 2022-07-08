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

## 结合 Each 组件使用
```schema: scope="body"
{
    "type": "page",
    "data": {
        "arr": [
          "A",
          "B",
          "C"
        ]
    },
    "body": {
        "type": "collapse-group",
        "body": {
          "type":"each",
          "source": "${arr}",
          "items":{
             "type":"collapse",
             "key": "${index}",
             "header": "标题${index}",
             "collapsed": "data.index == 1",
             "body": "这里是内容${index}"
          }
        }
    }
}
```

## CollapseGroup 属性表

| 属性名 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| type | `string` | `"collapse-group"` | 指定为 collapse-group 渲染器 |
| activeKey | `Array<string \| number \| never> \| string \| number` | - | 初始化激活面板的key |
| accordion | `boolean` | `false` | 手风琴模式 |
| expandIcon | `SchemaNode` | - | 自定义切换图标 |
| expandIconPosition | `string` | `"left"` | 设置图标位置，可选值`left \| right` |

## Collapse 属性表

| 属性名 | 类型 | 默认值 | 说明 |
| - | - | - | - |
| type | `string` | `"collapse"` | 指定为 collapse 渲染器 |
| disabled | `boolean` | `false` | 禁用 |
| collapsed | [表达式](../../docs/concepts/expression) | "true" | 初始状态是否折叠 |
| key | `string \| number` | - | 标识 |
| header | `string \| SchemaNode` | - | 标题 |
| body | `string \| SchemaNode` | - | 内容 |
| showArrow | `boolean` | `true` | 是否展示图标 |

