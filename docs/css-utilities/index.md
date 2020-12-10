---
title: 快速开始
---

> 1.0.20 版本中的功能

在 amis 中自定义样式有两种方式：

1. 自己生成主题，适合修改整体页面风格，影响所有组件，目前只能通过源码方式，请参考 `scss\themes\default.scss` 文件，修改变量后重新编译一个 css，后续我们将会有在线主题编辑工具。
2. 使用辅助 class，使用它们就能在 amis 配置中定制效果，无需单独编写 css，后续介绍的都主要是这种方式。

辅助 class 参考自[tailwindcss](https://tailwindcss.com/), 做了精简，把一些不常用的剔除了，响应式方面只保留 pc 和手机两种，css 未压缩版本大概是 800K 左右，比 tailwind 要小很多。

使用方法：

- JS SDK
  - 引入 sdk 中的文件 `<link rel="stylesheet" href="sdk/utilities.css" />`
- React
  - `import 'amis/lib/utilities.css'`;

目前这个文件没有和主题文件合并在一起，用户可以选择性加载。

大部分 amis 组件都有 `className` 或者 `xxxClassName` 的配置，比如下面的配置给表单增加了边框、圆角和阴影

```schema:height="300" scope="body"
{
  "type": "form",
  "panelClassName": "border-solid border-2 border-blue-500 rounded-xl shadow-lg",
  "controls": [
    {
      "type": "text",
      "className": "text-green-700",
      "label": "文本框",
      "name": "text"
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
