---
title: Button 按钮
description:
type: 0
group: ⚙ 组件
menuName: Button 按钮
icon:
order: 29
---

## 基本用法

```schema: scope="body"
{
  "label": "弹个框",
  "type": "button",
  "actionType": "dialog",
  "dialog": {
    "title": "弹框",
    "body": "这是个简单的弹框。"
  }
}
```

<!-- `button` 实际上是 `action` 的别名，更多用法见[action](./action) -->

## 属性表

| 属性名           | 类型                                                                                                                | 默认值  | 说明                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------- |
| className        | `string`                                                                                                            |         | 指定添加 button 类名                                  |
| href             | `string`                                                                                                            |         | 点击跳转的地址，指定此属性 button 的行为和 a 链接一致 |
| size             | `'xs' \| 'sm' \| 'md' \| 'lg' `                                                                                     |         | 设置按钮大小                                          |
| actionType       | `'button' \| 'reset' \| 'submit'\| 'clear'\| 'url'`                                                                 | button  | 设置按钮类型                                          |
| level            | `'link' \| 'primary'  \| 'enhance' \| 'secondary' \| 'info'\|'success' \| 'warning' \| 'danger' \| 'light'\| 'dark' \| 'default'` | default | 设置按钮样式                                          |
| tooltip          | `'string' \| 'TooltipObject'`                                                                                       |         | 气泡提示内容                                          |
| tooltipPlacement | `'top' \| 'right' \| 'bottom' \| 'left' `                                                                           | top     | 气泡框位置器                                          |
| tooltipTrigger   | `'hover' \| 'focus'`                                                                                                |         | 触发 tootip                                           |
| disabled         | `'boolean'`                                                                                                         | false   | 按钮失效状态                                          |
| block            | `'boolean'`                                                                                                         | false   | 将按钮宽度调整为其父宽度的选项                        |
| loading          | `'boolean'`                                                                                                         | false   | 显示按钮 loading 效果                                 |
| loadingOn        | `'string'`                                                                                                          |         | 显示按钮 loading 表达式                               |

更多使用说明，请参看 [Grid Props](https://react-bootstrap.github.io/layout/grid/#col-props)
