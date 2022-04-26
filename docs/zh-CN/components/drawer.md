---
title: Drawer 抽屉
description:
type: 0
group: ⚙ 组件
menuName: Drawer 抽屉
icon:
order: 43
---

## 基本用法

```schema: scope="body"
{
    "label": "弹出",
    "type": "button",
    "actionType": "drawer",
    "drawer": {
      "title": "抽屉标题",
      "body": "这是一个抽屉"
    }
}
```

## 抽屉尺寸

```schema: scope="body"
{
    "type": "button-toolbar",
    "className": "block m-t",
    "buttons": [
        {
            "type": "button",
            "label": "极小框",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "size": "xs",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "小框",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "size": "sm",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "中框",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "size": "md",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "大框",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "size": "lg",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "超大框",
            "actionType": "drawer",
            "drawer": {
                "size": "xl",
                "position": "right",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
    ]
}
```

## 自定义抽屉尺寸

值如果是数字类型单位默认使用`px`, 如果是字符串类型可以使用自定义 css 宽度变量，如：`%`、`vw`、`px`等

```schema: scope="body"
{
    "type": "button-toolbar",
    "className": "block m-t",
    "buttons": [
        {
            "type": "button",
            "label": "自定义宽度",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "width": 300,
                "title": "提示",
                "body": "这是个自定义300px宽度的弹框"
            }
        },
        {
            "type": "button",
            "label": "自定义高度",
            "actionType": "drawer",
            "drawer": {
                "position": "bottom",
                "height": 300,
                "title": "提示",
                "body": "这是个自定义300px高度的弹框"
            }
        },
    ]
}
```

## 指定弹出方向

```schema: scope="body"
{
    "type": "button-toolbar",
    "className": "block m-t",
    "buttons": [
        {
            "type": "button",
            "label": "左侧弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "left",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "右侧弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "right",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "顶部弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "top",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        },
        {
            "type": "button",
            "label": "底部弹出",
            "actionType": "drawer",
            "drawer": {
                "position": "bottom",
                "title": "提示",
                "body": "这是个简单的弹框"
            }
        }
    ]
}
```

## 可拖拽抽屉大小

配置`"resizable": true`，可以拖拽调整`drawer`大小

```schema: scope="body"
{
    "type": "button",
    "label": "可拖拽调整大小",
    "actionType": "drawer",
    "drawer": {
        "position": "right",
        "resizable": true,
        "title": "提示",
        "body": "这是个简单的弹框"
    }
}
```

## 是否展示关闭按钮

配置`"showCloseButton": false`，可以隐藏关闭按钮

```schema: scope="body"
{
    "type": "button",
    "label": "无关闭按钮",
    "actionType": "drawer",
    "drawer": {
        "position": "right",
        "title": "提示",
        "body": "这是个简单的弹框",
        "showCloseButton": false
    }
}
```

## 不显示蒙层

```schema: scope="body"
{
    "type": "button",
    "label": "不显示蒙层",
    "actionType": "drawer",
    "drawer": {
        "position": "right",
        "overlay": false,
        "title": "提示",
        "body": "这是个简单的弹框"
    }
}
```

## 点击抽屉外自动关闭

配置`"closeOnOutside":true`

### 显示蒙层

```schema: scope="body"
{
    "type": "button",
    "label": "点击抽屉外自动关闭",
    "actionType": "drawer",
    "drawer": {
        "position": "right",
        "closeOnOutside": true,
        "title": "提示",
        "body": "这是个简单的弹框"
    }
}
```

### 不显示蒙层

```schema: scope="body"
{
    "type": "button",
    "label": "点击抽屉外自动关闭",
    "actionType": "drawer",
    "drawer": {
        "position": "right",
        "overlay": false,
        "closeOnOutside": true,
        "title": "提示",
        "body": "这是个简单的弹框"
    }
}
```

## 属性表

| 属性名          | 类型                                      | 默认值             | 说明                                                                                              |
| --------------- | ----------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------- |
| type            | `string`                                  |                    | `"drawer"` 指定为 Drawer 渲染器                                                                   |
| title           | [SchemaNode](../../docs/types/schemanode) |                    | 弹出层标题                                                                                        |
| body            | [SchemaNode](../../docs/types/schemanode) |                    | 往 Drawer 内容区加内容                                                                            |
| size            | `string`                                  |                    | 指定 Drawer 大小，支持: `xs`、`sm`、`md`、`lg`、`xl`                                              |
| position        | `string`                                  |                    | 指定 Drawer 方向，支持: `left`、`right`、`top`、`bottom`                                          |
| className       | `string`                                  | ``                 | Drawer 最外层容器的样式类名                                                                       |
| headerClassName | `string`                                  |                    | Drawer 头部 区域的样式类名                                                                        |
| bodyClassName   | `string`                                  | `modal-body`       | Drawer body 区域的样式类名                                                                        |
| footerClassName | `string`                                  |                    | Drawer 页脚 区域的样式类名                                                                        |
| showCloseButton | `boolean`                                 | `true`             | 是否展示关闭按钮，当值为 false 时，默认开启 closeOnOutside                                        |
| closeOnEsc      | `boolean`                                 | `false`            | 是否支持按 `Esc` 关闭 Drawer                                                                      |
| closeOnOutside  | `boolean`                                 | `false`            | 点击内容区外是否关闭 Drawer                                                                       |
| overlay         | `boolean`                                 | `true`             | 是否显示蒙层                                                                                      |
| resizable       | `boolean`                                 | `false`            | 是否可通过拖拽改变 Drawer 大小                                                                    |
| width           | `string \| number`                        | `500px`            | 容器的宽度，在 position 为 `left` 或 `right` 时生效                                               |
| height          | `string \| number`                        | `500px`            | 容器的高度，在 position 为 `top` 或 `bottom` 时生效                                               |
| actions         | Array<[Action](./action)>                 | 【确认】和【取消】 | 可以不设置，默认只有两个按钮。                                                                    |
| data            | `object`                                  |                    | 支持 [数据映射](../../docs/concepts/data-mapping)，如果不设定将默认将触发按钮的上下文中继承数据。 |

## 事件表

| 事件名称 | 事件参数 | 说明 |
| -------- | -------- | ---- |
| confirm  | 抽屉数据 | 确认 |
| cancel   | 抽屉数据 | 取消 |

## 动作表

| 动作名称 | 动作配置                   | 说明         |
| -------- | -------------------------- | ------------ |
| confirm  | -                          | 确认（提交） |
| cancel   | -                          | 取消（关闭） |
| setValue | `value: object` 更新的数据 | 更新数据     |
