---
title: 响应式设计
---

响应式设计目前只支持 pc 端和手机端，其他设备目前不支持，貌似也没必要支持。默认就是 pc，如果你在 css 类名前面再加个 `mobile:` 开头，就是专门给手机端设置样式了。

<!-- ```html
<div class="text-black-500 mobile:text-red-500">
  这是一段文字，pc 端我是黑色的，在移动端查看，我是红色的。
</div>
``` -->

```schema:height="100" scope="body"
{
  "type": "tpl",
  "className": "text-black-500 mobile:text-red-500",
  "tpl": "这是一段文字，pc 端我是黑色的，在移动端查看，我是红色的。"
}
```

几乎所有的类名都可以在开头处加个 `mobile:` 用来表示是移动端样式。
