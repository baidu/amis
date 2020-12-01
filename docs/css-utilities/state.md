---
title: 状态样式
---

除了给默认状态设置样式外，还支持几个特定状态的样式设置比如：hover（鼠标悬停）、active（当前选中）、focus（当前聚焦）或者 disabled（当前不可用）。

```html
<button
  class="Button 
  rounded-xl text-light 
  bg-pink-400 border-pink-600 
  pc:hover:bg-pink-500 pc:hover:border-pink-800 
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

## Focus

## Active

## Group-hover

## Disabled

## Combining with responsive prefixes
