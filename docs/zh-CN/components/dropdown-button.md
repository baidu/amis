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

| 属性名          | 类型               | 默认值            | 说明                                      |
| --------------- | ------------------ | ----------------- | ----------------------------------------- |
| type            | `string`           | `dropdown-button` | 类型                                      |
| label           | `string`           |                   | 按钮文本                                  |
| className       | `string`           |                   | 外层 CSS 类名                             |
| block           | `boolean`          |                   | 块状样式                                  |
| size            | `string`           |                   | 尺寸，支持`'xs'`、`'sm'`、`'md'` 、`'lg'` |
| align           | `string`           |                   | 位置，可选`'left'`或`'right'`             |
| buttons         | `Array<action>`    |                   | 配置下拉按钮                              |
| iconOnly        | `boolean`          |                   | 只显示 icon                               |
| defaultIsOpened | `boolean`          |                   | 默认是否打开                              |
| closeOnOutside  | `boolean`          |                   | 点击外侧区域是否收起                      |
| trigger         | `click` 或 `hover` | `click`           | 触发方式                                  |
| hideCaret       | `boolean`          | false             | 隐藏下拉图标                              |
