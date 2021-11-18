---
title: Sparkline 走势图
description:
type: 0
group: ⚙ 组件
menuName: SparkLine
icon:
order: 63
---

简单走势图，只做简单的展示，详细展示请采用 Chart 来完成。

## 基本使用

配置类型，然后设置值即可，值为数组格式。

当前例子为静态值，通常你会需要配置成 `name` 与当前环境数据关联。

```schema
{
    "type": "page",
    "body": {
        "type": "sparkline",
        "height": 30,
        "value": [3, 5, 2, 4, 1, 8, 3, 7]
    }
}
```

## 点击行为

可以通过配置`"clickAction": {}`，来指定图表节点的点击行为，支持 amis 的 [行为](./action)。

```schema
{
    "type": "page",
    "body": {
        "type": "sparkline",
        "value": [3, 5, 2, 4, 1, 8, 3, 7],
        "clickAction": {
          "actionType": "dialog",
          "dialog": {
            "title": "走势详情",
            "body": "这里你可以放个 chart 来展示详情。"
          }
        }
    }
}
```

## 空数据显示

> 1.4.2 及以上版本

通过 `placeholder` 可以设置空数据时显示的内容

```schema
{
    "type": "page",
    "body": {
        "type": "sparkline",
        "value": [],
        "placeholder": "无数据"
    }
}
```

## 属性表

| 属性名      | 类型     | 默认值 | 说明                 |
| ----------- | -------- | ------ | -------------------- |
| name        | `string` |        | 关联的变量           |
| width       | `number` |        | 宽度                 |
| height      | `number` |        | 高度                 |
| placeholder | `string` |        | 数据为空时显示的内容 |
