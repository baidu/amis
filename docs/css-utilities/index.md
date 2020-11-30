---
title: 快速开始
---

amis 参考 [tailwindcss](https://tailwindcss.com/) 加入了大量的帮助类 css，掌握这些用法，完全不用手写 css。

理念来自[tailwindcss](https://tailwindcss.com/), 不过这边做了一定的筛选，把一些不常用的用法剔除了，另外响应式方面只做了 pc 端和手机端，其他的设备并没有支持。这个文件未压缩版本大概是 300K 左右，比官方的要小很多。目前这个文件没有和主题文件合并在一起，用户可以选择性加载。

```html
<link rel="stylesheet" href="amis/lib/utilities.css" />
```

引入这个 css 后，就可以像下面那样直接给 html 标签加类名的方式来设定样式了。

```html
<div
  class="p-6 m-auto max-w-sm m-x-auto bg-white rounded-xl shadow-md flex items-center space-x-4"
>
  <div class="flex-shrink-0">
    <svg
      class="h-12 w-12"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
          <stop stop-color="#2397B3" offset="0%"></stop>
          <stop stop-color="#13577E" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="b">
          <stop stop-color="#73DFF2" offset="0%"></stop>
          <stop stop-color="#47B1EB" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g fill="none" fill-rule="evenodd">
        <path
          d="M28.872 22.096c.084.622.128 1.258.128 1.904 0 7.732-6.268 14-14 14-2.176 0-4.236-.496-6.073-1.382l-6.022 2.007c-1.564.521-3.051-.966-2.53-2.53l2.007-6.022A13.944 13.944 0 0 1 1 24c0-7.331 5.635-13.346 12.81-13.95A9.967 9.967 0 0 0 13 14c0 5.523 4.477 10 10 10a9.955 9.955 0 0 0 5.872-1.904z"
          fill="url(#a)"
          transform="translate(1 1)"
        ></path>
        <path
          d="M35.618 20.073l2.007 6.022c.521 1.564-.966 3.051-2.53 2.53l-6.022-2.007A13.944 13.944 0 0 1 23 28c-7.732 0-14-6.268-14-14S15.268 0 23 0s14 6.268 14 14c0 2.176-.496 4.236-1.382 6.073z"
          fill="url(#b)"
          transform="translate(1 1)"
        ></path>
        <path
          d="M18 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM24 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM30 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
          fill="#FFF"
        ></path>
      </g>
    </svg>
  </div>
  <div>
    <div class="text-xl font-medium text-black">ChitChat</div>
    <p class="text-gray-500">You have a new message!</p>
  </div>
</div>
```

比如这个栗子：

- 通过 `flex` `flex-shrink-0` 来设置布局方式。
- 通过 `bg-blue-100` `bg-white` 之类的类名设置背景色。
- 通过 `shadow-md` 设置投影。
- 通过 `rounded-xl` 设置圆角。
- 通过 `text-xl`、`font-medium` 设置字体大小粗细。
- 等等。。
