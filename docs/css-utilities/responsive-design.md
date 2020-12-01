---
title: 响应式设计
---

响应式设计目前只支持 pc 端和手机端，其他设备目前不支持，貌似也没必要支持。默认 pc 和移动，如果你在 css 类名前面再加个 `m:` 开头，就是专门给手机端设置样式，如果你在类名前面加个 `pc:`，则是给桌面端设置样式。

<!-- ```html
<div class="text-black-500 m:text-red-500">
  这是一段文字，pc 端我是黑色的，在移动端查看，我是红色的。
</div>
``` -->

```schema:height="100" scope="body"
{
  "type": "tpl",
  "className": "text-blue-500 m:text-red-500",
  "tpl": "这是一段文字，pc 端是蓝色的，在移动端查看是红色的。"
}
```
