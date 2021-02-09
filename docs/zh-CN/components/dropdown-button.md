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

## 属性表

| 属性名          | 类型            | 默认值            | 说明                                      |
| --------------- | --------------- | ----------------- | ----------------------------------------- |
| type            | `string`        | `dropdown-button` | 类型                                      |
| label           | `string`        |                   | 按钮文本                                  |
| className       | `string`        |                   | 外层 CSS 类名                             |
| block           | `boolean`       |                   | 块状样式                                  |
| size            | `string`        |                   | 尺寸，支持`'xs'`、`'sm'`、`'md'` 、`'lg'` |
| align           | `string`        |                   | 位置，可选`'left'`或`'right'`             |
| buttons         | `Array<action>` |                   | 配置下拉按钮                              |
| caretIcon       | `string`        |                   | caretIcon                                 |
| iconOnly        | `boolean`       |                   | 只显示 icon                               |
| defaultIsOpened | `boolean`       |                   | 默认是否打开                              |
| closeOnOutside  | `boolean`       |                   | 点击外侧区域是否收起                      |
