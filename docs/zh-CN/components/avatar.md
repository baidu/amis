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
  "src": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
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

src、text 都支持变量，可以从上下文中动态获取图片或文字，下面的例子中：

- 第一个获取到了，显示正常
- 第二个没获取到，因此降级为显示 icon
- 第三个图片没获取到，由于 text 优先级比 icon 高，所以显示 text

```schema
{
  "data": {
    "myAvatar": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
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
    },
    {
      "type": "avatar",
      "src": "$other",
      "icon": "fa fa-user",
      "text": "avatar"
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
    "size": 'large',
    "icon": "fa fa-user"
  },
  {
    "type": "avatar",
    "size": 'default',
    "icon": "fa fa-user"
  },
  {
    "type": "avatar",
    "size": 'small',
    "icon": "fa fa-user"
  },
  {
    "type": "avatar",
    "size": 60,
    "src": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
  },
  {
    "type": "avatar",
    "src": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
  },
  {
    "type": "avatar",
    "size": 20,
    "src": "https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg"
  },
]

```

## 控制字符类型距离左右两侧边界单位像素

通过 gap 可以控制字符类型距离左右两侧边界单位像素

```schema: scope="body"
[
  {
    "type": "avatar",
    "text": 'ejson',
    "gap": 2
  },
  {
    "type": "avatar",
    "text": "ejson",
    "gap": 7
  }
]

```

## 图片拉伸方式

通过 `fit` 可以控制图片拉伸方式，默认是 `'cover'`

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

## 控制图片是否允许拖动

通过 draggable 可以控制图片是否允许拖动

```schema: scope="body"
[
  {
    "type": "avatar",
    "fit": "cover",
    "src": "https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg",
    "draggable": false
  },
    {
    "type": "avatar",
    "fit": "cover",
    "src": "https://suda.cdn.bcebos.com/images/amis/plumeria.jpeg",
    "draggable": true
  }
]
```

## 图片加载失败后，通过 onError 控制是否进行 text、icon 置换

> 如果同时存在 text 和 icon，会优先用 text、接着 icon

```schema: scope="body"
{
  "type": "avatar",
  "src": "empty",
  "text": "avatar",
  "onError": "return true;"
},
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

| 属性名        | 类型                                                               | 默认值         | 说明                                                                                                                                                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------ | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| className     | `string`                                                           |                | 外层 dom 的类名                                                                                                                                                                                                                                                                                                                      |
| style         | `object`                                                           |                | 外层 dom 的样式                                                                                                                                                                                                                                                                                                                      |
| fit           | `'contain'` \| `'cover'` \| `'fill'` \| `'none'` \| `'scale-down'` | `'cover'`      | 具体细节可以参考 MDN [文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit)                                                                                                                                                                                                                                             |
| src           | `string`                                                           |                | 图片地址                                                                                                                                                                                                                                                                                                                             |
| defaultAvatar | `string`                                                           |                | 占位图                                                                                                                                                                                                                                                                                                                               |
| text          | `string`                                                           |                | 文字                                                                                                                                                                                                                                                                                                                                 |
| icon          | `string`                                                           | `'fa fa-user'` | 图标                                                                                                                                                                                                                                                                                                                                 |
| shape         | `'circle'` \| `'square'` \| `'rounded'`                            | `'circle'`     | 形状，有三种 `'circle'` （圆形）、`'square'`（正方形）、`'rounded'`（圆角）                                                                                                                                                                                                                                                          |
| size          | `number` \| `'default'` \| `'normal'` \| `'small'`                 | `'default'`    | `'default' \| 'normal' \| 'small'`三种字符串类型代表不同大小（分别是 48、40、32），也可以直接数字表示                                                                                                                                                                                                                                |
| gap           | `number`                                                           | 4              | 控制字符类型距离左右两侧边界单位像素                                                                                                                                                                                                                                                                                                 |
| alt           | `number`                                                           |                | 图像无法显示时的替代文本                                                                                                                                                                                                                                                                                                             |
| draggable     | `boolean`                                                          |                | 图片是否允许拖动                                                                                                                                                                                                                                                                                                                     |
| crossOrigin   | `'anonymous'` \| `'use-credentials'` \| `''`                       |                | 图片的 `CORS` 属性设置                                                                                                                                                                                                                                                                                                               |
| onError       | `string`                                                           |                | 图片加载失败的字符串，这个字符串是一个 New Function 内部执行的字符串，参数是 event（使用 event.nativeEvent 获取原生 dom 事件），这个字符串需要返回 boolean 值。设置 `"return ture;"` 会在图片加载失败后，使用 `text` 或者 `icon` 代表的信息来进行替换。目前图片加载失败默认是不进行置换。注意：图片加载失败，不包括$获取数据为空情况 |

## 事件表

> 6.1.0 及以上版本

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细查看[事件动作](../../docs/concepts/event-action)。

| 事件名称   | 事件参数 | 说明           |
| ---------- | -------- | -------------- |
| click      | -        | 点击时触发     |
| mouseenter | -        | 鼠标移入时触发 |
| mouseleave | -        | 鼠标移出时触发 |

### click

鼠标点击。可以尝试通过`${event.context.nativeEvent}`获取鼠标事件对象。

```schema: scope="body"
{
  "type": "avatar",
  "onEvent": {
    "click": {
      "actions": [
        {
          "actionType": "toast",
          "args": {
            "msgType": "info",
            "msg": "${event.context.nativeEvent.type}"
          }
        }
      ]
    }
  }
}
```

### mouseenter

鼠标移入。可以尝试通过`${event.context.nativeEvent}`获取鼠标事件对象。

```schema: scope="body"
{
  "type": "avatar",
  "onEvent": {
    "mouseenter": {
      "actions": [
        {
          "actionType": "toast",
          "args": {
            "msgType": "info",
            "msg": "${event.context.nativeEvent.type}"
          }
        }
      ]
    }
  }
}
```

### mouseleave

鼠标移出。可以尝试通过`${event.context.nativeEvent}`获取鼠标事件对象。

```schema: scope="body"
{
  "type": "avatar",
  "onEvent": {
    "mouseleave": {
      "actions": [
        {
          "actionType": "toast",
          "args": {
            "msgType": "info",
            "msg": "${event.context.nativeEvent.type}"
          }
        }
      ]
    }
  }
}
```
