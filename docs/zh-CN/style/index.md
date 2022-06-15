---
title: 快速开始
---

示例有个[主题编辑器](../../examples/theme)，可以在线实时预览效果。

> 这是 1.1.0 版本中新增的功能

在 amis 中自定义样式有四种方式：

1. 使用 CSS 变量动态修改，通过这种方式修改大部分 amis 组件的样式，所有组件都会生效，注意这种方法不支持 IE11。
2. 使用辅助 class，可以对单个组件做定制修改。
3. 自己生成主题 CSS，可以修改所有配置，目前只能通过源码方式，请参考 `scss\themes\cxd.scss` 文件，修改变量后重新编译一个 css，需要注意这种方式在更新 amis 版本的时候最好重新编译，否则就会出现使用旧版 css 的情况，可能导致出错，因此不推荐使用。
4. `wrapper` 组件可以直接写内嵌 `style`。

本文主要介绍前两种方法：

## CSS 变量

在 page 下可以设置 cssVars 属性，通过它来动态修改 amis 内的 css 变量。

```schema
{
  "type": "page",
  "cssVars": {
    "--text-color": "#CD3632",
    "--primary": "#CD3632",
    "--primary-onHover": "#F23F3A",
    "--primary-onActive": "#BB312D"
  },
  "body": {
    "type": "form",
    "body": [
      {
        "type": "input-text",
        "label": "文本",
        "name": "text"
      },
      {
        "type": "input-password",
        "label": "密码",
        "name": "password"
      }
    ]
  }
}
```

具体有哪些变量请参考左侧的 [CSS 变量](css-vars) 说明。

## 辅助 class

辅助 class 参考自[tailwindcss](https://tailwindcss.com/), 做了精简，把一些不常用的剔除了，响应式方面只保留 pc 和手机两种，css 未压缩版本大概是 800K 左右，比 tailwind 要小很多。

使用方法：

- JS SDK
  - 引入 sdk 中的文件 `<link rel="stylesheet" href="sdk/helper.css" />`
- React
  - `import 'amis/lib/helper.css'`;

目前这个文件没有和主题文件合并在一起，用户可以选择性加载。

大部分 amis 组件都有 `className` 或者 `xxxClassName` 的配置，比如下面的配置给表单增加了边框、圆角和阴影

```schema: scope="body"
{
  "type": "form",
  "panelClassName": "border-solid border-2 border-blue-500 rounded-xl shadow-lg",
  "body": [
    {
      "type": "input-text",
      "className": "text-green-700",
      "label": "文本框",
      "name": "text"
    },
    {
      "type": "input-password",
      "label": "密码",
      "name": "password"
    }
  ]
}
```

还可以：

- 通过 `flex` `flex-shrink-0` 来设置布局方式。
- 通过 `bg-blue-100` `bg-white` 之类的类名设置背景色。
- 通过 `shadow-md` 设置投影。
- 通过 `rounded-xl` 设置圆角。
- 通过 `text-xl`、`font-medium` 设置字体大小粗细。
- 等等。。

具体用法请查看左边的文档列表。
