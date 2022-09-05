---
title: DropDownButton
description:
type: 0
group: ⚙ 组件
menuName: DropDownButton
icon:
order: 44
---

## 基本用法

```schema
{
    "type": "page",
    "body": {
        "type": "dropdown-button",
        "label": "下拉菜单",
        "buttons": [
            {
                "type": "button",
                "label": "按钮1",
                "disabled": true
            },
            {
                "type": "button",
                "label": "按钮2"
            },
            {
                "type": "button",
                "label": "按钮3"
            }
        ]
    }
}
```

## 分组展示模式

配置`children`可以实现分组展示，分组标题支持配置`icon`。

> 1.5.7 及以上版本

```schema: scope="body"
{
    "type": "dropdown-button",
    "label": "下拉菜单",
    "buttons": [
        {
            "label": "RD",
            "icon": "fa fa-user",
            "children": [
                {
                    "type": "button",
                    "label": "前端FE"
                },
                {
                    "type": "button",
                    "label": "后端RD"
                }
            ]
        },
        {
            "label": "QA",
            "icon": "fa fa-user",
            "children": [
                {
                    "type": "button",
                    "label": "测试QA",
                },
                {
                    "type": "button",
                    "label": "交付测试DQA",
                    "disabled": true
                },
                {
                    "type": "divider"
                }
            ]
        },
        {
            "label": "Manager",
            "icon": "fa fa-user",
            "children": [
                {
                    "type": "button",
                    "label": "项目经理PM"
                },
                {
                    "type": "button",
                    "label": "项目管理中心PMO",
                    "visible": false
                }
            ]
        }
    ]
}
```

## 关闭下拉菜单

配置`"closeOnClick": true`可以实现点击按钮后自动关闭下拉菜单。

```schema
{
    "type": "page",
    "body": {
        "type": "dropdown-button",
        "label": "下拉菜单",
        "closeOnClick": true,
        "closeOnOutside": true,
        "buttons": [
            {
                "type": "button",
                "label": "按钮1",
                "disabled": true
            },
            {
                "type": "button",
                "label": "按钮2"
            },
            {
                "type": "button",
                "label": "按钮3"
            }
        ]
    }
}
```

## 触发方式

> 1.4.0 及以上版本

默认是点击鼠标触发，可以通过 `"trigger": "hover"` 配置为鼠标移上去后触发

```schema
{
    "type": "page",
    "body": {
        "type": "dropdown-button",
        "label": "下拉菜单",
        "trigger": "hover",
        "buttons": [
            {
                "type": "button",
                "label": "按钮1",
                "disabled": true
            },
            {
                "type": "button",
                "label": "按钮2"
            },
            {
                "type": "button",
                "label": "按钮3"
            }
        ]
    }
}
```

## 设置图标

通过 `icon` 可以设置左侧图标

```schema
{
    "type": "page",
    "body": {
        "type": "dropdown-button",
        "label": "下拉菜单",
        "trigger": "hover",
        "icon": "fa fa-home",
        "buttons": [
            {
                "type": "button",
                "label": "按钮1",
                "disabled": true
            },
            {
                "type": "button",
                "label": "按钮2"
            },
            {
                "type": "button",
                "label": "按钮3"
            }
        ]
    }
}
```

## 只显示图标

可以设置 `level` 及 `hideCaret` 来只显示图标，并配合 `tooltip` 来显示提示文字

```schema
{
    "type": "page",
    "body": {
        "type": "dropdown-button",
        "level": "link",
        "icon": "fa fa-ellipsis-h",
        "hideCaret": true,
        "tooltip": "提示",
        "buttons": [
            {
                "type": "button",
                "label": "按钮1",
                "disabled": true
            },
            {
                "type": "button",
                "label": "按钮2"
            },
            {
                "type": "button",
                "label": "按钮3"
            }
        ]
    }
}
```

## 设置右侧图标

> 1.5.0 及以上版本

通过 `rightIcon` 设置右侧图标，同时通过 `hideCaret` 隐藏右侧下拉图标

```schema
{
    "type": "page",
    "body": {
        "type": "dropdown-button",
        "label": "下拉菜单",
        "trigger": "hover",
        "rightIcon": "fa fa-ellipsis-v",
        "hideCaret": true,
        "buttons": [
            {
                "type": "button",
                "label": "按钮1",
                "disabled": true
            },
            {
                "type": "button",
                "label": "按钮2"
            },
            {
                "type": "button",
                "label": "按钮3"
            }
        ]
    }
}
```

## 属性表

| 属性名          | 类型                    | 默认值            | 说明                                      |
| --------------- | ----------------------- | ----------------- | ----------------------------------------- |
| type            | `string`                | `dropdown-button` | 类型                                      |
| label           | `string`                |                   | 按钮文本                                  |
| className       | `string`                |                   | 外层 CSS 类名                             |
| btnClassName    | `string`                |                   | 按钮 CSS 类名                             |
| menuClassName   | `string`                |                   | 下拉菜单 CSS 类名                         |
| block           | `boolean`               |                   | 块状样式                                  |
| size            | `string`                |                   | 尺寸，支持`'xs'`、`'sm'`、`'md'` 、`'lg'` |
| align           | `string`                |                   | 位置，可选`'left'`或`'right'`             |
| buttons         | `Array<DropdownButton>` |                   | 配置下拉按钮                              |
| iconOnly        | `boolean`               |                   | 只显示 icon                               |
| defaultIsOpened | `boolean`               |                   | 默认是否打开                              |
| closeOnOutside  | `boolean`               | `true`            | 点击外侧区域是否收起                      |
| closeOnClick    | `boolean`               | `false`           | 点击按钮后自动关闭下拉菜单                |
| trigger         | `click` 或 `hover`      | `click`           | 触发方式                                  |
| hideCaret       | `boolean`               | false             | 隐藏下拉图标                              |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.0 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

| 事件名称   | 事件参数                     | 说明                                    |
| ---------- | ---------------------------- | --------------------------------------- |
| mouseenter | items: Array<DropdownButton> | 触发方式为 hover 模式下，鼠标移入时触发 |
| mouseleave | items: Array<DropdownButton> | 触发方式为 hover 模式下，鼠标移出时触发 |

## 动作表

暂无
