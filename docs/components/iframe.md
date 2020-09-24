---
title: iFrame
description: 
type: 0
group: ⚙ 组件
menuName: iFrame
icon: 
order: 51
---
## 基本使用

内嵌外部站点，可用 iframe 来实现。

```schema:height="300" scope="body"
{
    "type": "iframe",
    "src": "https://www.baidu.com"
}
```

## 属性表

| 属性名      | 类型     | 默认值     | 说明                 |
| ----------- | -------- | ---------- | -------------------- |
| type        | `string` | `"iframe"` | 指定为 iFrame 渲染器 |
| className   | `string` |            | iFrame 的类名        |
| frameBorder | `Array`  |            | frameBorder          |
| style       | `object` |            | 样式                 |
| src         | `string` |            | iframe地址           |
| height      | `string` | `"100%"`   | iframe高           |
| width       | `string` | `"100%"`   | iframe宽           |





