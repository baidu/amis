---
title: Avatar 头像
description:
type: 0
group: ⚙ 组件
menuName: Avatar 头像
icon:
order: 27
---

用来显示用户头像

## 基本使用

```schema: scope="body"
{
  "type": "avatar",
  "src": "https://suda.cdn.bcebos.com/images/amis/ai-fake-face.jpg"
}
```

## 文字

```schema: scope="body"
{
  "type": "avatar",
  "text": "AM"
}
```

## 图标

通过 icon 设置图标

```schema: scope="body"
{
  "type": "avatar",
  "icon": "fa fa-user"
}
```

> 如果同时存在 src、text 和 icon，会优先用 src、接着 text、最后 icon

## 动态图片或文字

src、text 都支持变量，可以从上下文中动态获取图片或文字，下面的例子中第一个获取到了，而第二个没获取到，因此降级为显示 icon

```schema
{
  "data": {
    "myAvatar": "https://suda.cdn.bcebos.com/images/amis/ai-fake-face.jpg"
  },
  "type": "page",
  "body": [
    {
      "type": "avatar",
      "icon": "fa fa-user",
      "src": "$myAvatar"
    },
    {
      "type": "avatar",
      "icon": "fa fa-user",
      "src": "$other"
    }
  ]
}
```

## 方形和圆角形

可以通过 shape 改成方形或圆角形

```schema: scope="body"
[
  {
    "type": "avatar",
    "shape": "square",
    "text": "AM"
  },
  {
    "type": "avatar",
    "shape": "rounded",
    "text": "AM",
    "style": {
      "marginLeft": "10px"
    }
  }
]

```

## 大小

通过 size 可以控制头像的大小

```schema: scope="body"
[
  {
    "type": "avatar",
    "size": 20,
    "src": "https://suda.cdn.bcebos.com/images/amis/ai-fake-face.jpg"
  },
  {
    "type": "avatar",
    "size": 60,
    "src": "https://suda.cdn.bcebos.com/images/amis/ai-fake-face.jpg"
  }
]

```

## 图片拉伸方式

通过 `fit` 可以控制图片拉伸方式，默认是 `cover`，具体细节可以参考 MDN [文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit)

```schema: scope="body"
[
  {
    "type": "avatar",
    "fit": "cover",
    "src": "https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg"
  },
  {
    "type": "avatar",
    "fit": "fill",
    "src": "https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg"
  },
  {
    "type": "avatar",
    "fit": "contain",
    "src": "https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg"
  },
  {
    "type": "avatar",
    "fit": "none",
    "src": "https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg"
  },
    {
    "type": "avatar",
    "fit": "scale-down",
    "src": "https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg"
  }
]
```

## 样式

可以通过 style 来控制背景及文字颜色

```schema: scope="body"
{
  "type": "avatar",
  "text": "AM",
  "style": {
    "background": "#DB3E35",
    "color": "#FFFFFF"
  }
}
```

## 属性表

| 属性名    | 类型     | 默认值 | 说明                  |
| --------- | -------- | ------ | --------------------- |
| className | `string` |        | 外层 dom 的类名       |
| fit       | `string` | cover  | 图片缩放类型          |
| src       | `string` |        | 图片地址              |
| text      | `string` |        | 文字                  |
| icon      | `string` |        | 图标                  |
| shape     | `string` | circle | 形状，也可以是 square |
| size      | `number` | 40     | 大小                  |
| style     | `object` |        | 外层 dom 的样式       |
