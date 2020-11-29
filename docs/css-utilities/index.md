---
title: 样式
---

amis 参考 [tailwindcss](https://tailwindcss.com/) 加入了大量的帮助类 css，掌握这些用法，完全不用手写 css。

这个文件大概有 300K 左右，所以并没有和主题文件合并在一起，用户可以选择性加载。

```
<link rel="stylesheet" href="amis/lib/utilities.css">
```

## 基本使用

例如，下面这个例子，我们内容区渲染了两个按钮，但是可以看到，两个按钮紧贴在一起，并不是很美观，于是我们想添加一定的间隔

```schema:height="100" scope="body"
[
  {
    "type": "button",
    "label": "按钮1",
    "actionType": "dialog",
    "dialog": {
      "title": "弹框",
      "body": "Hello World!"
    }
  },
  {
    "type": "button",
    "label": "按钮2",
    "actionType": "dialog",
    "dialog": {
      "title": "弹框",
      "body": "Hello World!"
    }
  }
]
```

1. 通过查阅按钮文档可知，按钮支持 className 配置项，也就是说可以在按钮上添加 CSS 类名；
2. 再查阅样式相关文档，我们可以添加`m-l`类名实现`margin-left: 15px;`的 CSS 效果
3. 于是我们在`按钮2`的配置中添加`"className": "m-l"`，就能实现间距效果了

```schema:height="100" scope="body"
[
  {
    "type": "button",
    "label": "按钮1",
    "actionType": "dialog",
    "dialog": {
      "title": "弹框",
      "body": "Hello World!"
    }
  },
  {
    "type": "button",
    "label": "按钮2",
    "className": "m-l",
    "actionType": "dialog",
    "dialog": {
      "title": "弹框",
      "body": "Hello World!"
    }
  }
]
```

除了按钮提供的默认样式外，还可以自己自定义比如。

```schema:height="100" scope="body"
[
    {
        "type": "button",
        "label": "按钮1",
        "actionType": "dialog",
        "className": "border-pink-700 shadow-md text-light bg-pink-500 hover:bg-pink-600 hover:text-light hover:border-pink-800",
        "dialog": {
        "title": "弹框",
        "body": "Hello World!"
        }
    },

    {
        "type": "button",
        "label": "按钮2",
        "actionType": "dialog",
        "className": "m-l-xs border-purple-700 shadow-md text-light bg-purple-500 hover:bg-purple-600 hover:text-light hover:border-purple-800",
        "dialog": {
        "title": "弹框",
        "body": "Hello World!"
        }
    }
]
```

绝大部分组件都支持各种形式的 CSS 类名自定义，然后搭配该文档中的各种类名可以实现各式各样的样式调整。具体请查阅组件文档；

<div class="rounded-t-xl overflow-hidden bg-blue-100 p-x-6 p-y-12">
    <div class="p-6 m-auto max-w-sm m-x-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
    <div class="flex-shrink-0">
        <svg class="h-12 w-12" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a"><stop stop-color="#2397B3" offset="0%"></stop><stop stop-color="#13577E" offset="100%"></stop></linearGradient><linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="b"><stop stop-color="#73DFF2" offset="0%"></stop><stop stop-color="#47B1EB" offset="100%"></stop></linearGradient></defs><g fill="none" fill-rule="evenodd"><path d="M28.872 22.096c.084.622.128 1.258.128 1.904 0 7.732-6.268 14-14 14-2.176 0-4.236-.496-6.073-1.382l-6.022 2.007c-1.564.521-3.051-.966-2.53-2.53l2.007-6.022A13.944 13.944 0 0 1 1 24c0-7.331 5.635-13.346 12.81-13.95A9.967 9.967 0 0 0 13 14c0 5.523 4.477 10 10 10a9.955 9.955 0 0 0 5.872-1.904z" fill="url(#a)" transform="translate(1 1)"></path><path d="M35.618 20.073l2.007 6.022c.521 1.564-.966 3.051-2.53 2.53l-6.022-2.007A13.944 13.944 0 0 1 23 28c-7.732 0-14-6.268-14-14S15.268 0 23 0s14 6.268 14 14c0 2.176-.496 4.236-1.382 6.073z" fill="url(#b)" transform="translate(1 1)"></path><path d="M18 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM24 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM30 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#FFF"></path></g></svg>
    </div>
    <div>
        <div class="text-xl font-medium text-black">ChitChat</div>
        <p class="text-gray-500">You have a new message!</p>
    </div>
    </div>
</div>
