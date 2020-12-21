---
title: 辅助类 - 状态样式
---

除了给默认状态设置样式外，还支持几个特定状态的样式设置比如：hover（鼠标悬停）、active（当前选中）、focus（当前聚焦）或者 disabled（当前不可用）。

```html
<button
  class="Button
  rounded-xl text-light
  bg-pink-400 border-pink-600
  hover:bg-pink-500 hover:border-pink-800
  active:bg-pink-600 active:border-pink-900"
>
  按钮示例
</button>

<button
  class="Button m-l-16
  rounded-xl text-light
  bg-pink-500 border-pink-800
  hover:bg-pink-500 hover:border-pink-800"
>
  悬停态
</button>

<button
  class="Button m-l-xs
  rounded-xl text-light
  bg-pink-600 border-pink-900
  hover:bg-pink-600 hover:border-pink-900"
>
  按下态
</button>

<button
  class="Button m-l-xs
  rounded-xl text-light
  disabled:text-dark disabled:bg-pink-200 disabled:border-pink-400"
  disabled
>
  禁用态
</button>
```

## Hover

在 css 类名前面添加 `hover:` 表示在 hover 时启用这个样式比如。

```html
<button
  class="Button
  text-blue-500
  hover:text-red-500"
>
  蓝色按钮，hover 红色
</button>
```

## Group-Hover

当 hover 某个元素的时候，你想要给子元素设置不同的样式，需要两步操作。

1. 给容器添加 `group` 类名。
2. 给子元素添加 `group-hover:` 前缀形式的样式类。

```html
<div
  class="group p-4 border border-solid border-dark
  hover:bg-dark"
>
  <p class="group-hover:text-red-500">整体hover 红色</p>
  <p class="group-hover:text-green-500">整体hover 绿色</p>
</div>
```

## Focus

当要给元素设置「聚焦态」样式时，类名添加 `focus:` 前缀。

```html
<button
  class="Button
  text-blue-500
  focus:border-dark
  focus:text-red-500"
>
  蓝色按钮，focus 红色
</button>
```

## Active

当要给元素设置「选中态」样式时，类名添加 `active:` 前缀。

```html
<button
  class="Button
  text-blue-500
  active:border-dark
  active:text-red-500
  is-active"
>
  蓝色按钮，active 红色
</button>
```

## Disabled

当要给元素设置「禁用态」样式时，类名添加 `disabled:` 前缀。

```html
<button
  disabled
  class="Button
  text-blue-500
  disabled:border-dark
  disabled:text-red-500"
>
  蓝色按钮，disabled 红色
</button>
```

## 结合响应式设计一起？

那就先加「设备前缀」，再加「状态前缀」。如：`pc:hover:bg-pink-500`、`m:hover:bg-blue-500`

```html
<button
  class="Button
  rounded-xl text-light

  pc:bg-pink-400 pc:border-pink-600
  pc:hover:bg-pink-500 pc:hover:border-pink-800

  m:bg-blue-400 m:border-blue-600
  m:hover:bg-blue-500 m:hover:border-blue-800
  "
>
  按钮示例
</button>
```
