---
title: Top / Right / Bottom / Left
---

用来控制位置的样式集。

| Class        | Properties                                                                        |
| ------------ | --------------------------------------------------------------------------------- |
| inset-0      | top: 0px;<br/>right: 0px;<br/>bottom: 0px;<br/>left: 0px;                         |
| -inset-0     | top: 0px;<br/>right: 0px;<br/>bottom: 0px;<br/>left: 0px;                         |
| inset-y-0    | top: 0px;<br/>bottom: 0px;                                                        |
| inset-x-0    | right: 0px;<br/>left: 0px;                                                        |
| -inset-y-0   | top: 0px;<br/>bottom: 0px;                                                        |
| -inset-x-0   | right: 0px;<br/>left: 0px;                                                        |
| top-0        | top: 0px;                                                                         |
| right-0      | right: 0px;                                                                       |
| bottom-0     | bottom: 0px;                                                                      |
| left-0       | left: 0px;                                                                        |
| -top-0       | top: 0px;                                                                         |
| -right-0     | right: 0px;                                                                       |
| -bottom-0    | bottom: 0px;                                                                      |
| -left-0      | left: 0px;                                                                        |
| inset-0.5    | top: 0.125rem;<br/>right: 0.125rem;<br/>bottom: 0.125rem;<br/>left: 0.125rem;     |
| -inset-0.5   | top: -0.125rem;<br/>right: -0.125rem;<br/>bottom: -0.125rem;<br/>left: -0.125rem; |
| inset-y-0.5  | top: 0.125rem;<br/>bottom: 0.125rem;                                              |
| inset-x-0.5  | right: 0.125rem;<br/>left: 0.125rem;                                              |
| -inset-y-0.5 | top: -0.125rem;<br/>bottom: -0.125rem;                                            |
| -inset-x-0.5 | right: -0.125rem;<br/>left: -0.125rem;                                            |
| top-0.5      | top: 0.125rem;                                                                    |
| right-0.5    | right: 0.125rem;                                                                  |
| bottom-0.5   | bottom: 0.125rem;                                                                 |
| left-0.5     | left: 0.125rem;                                                                   |
| -top-0.5     | top: -0.125rem;                                                                   |
| -right-0.5   | right: -0.125rem;                                                                 |
| -bottom-0.5  | bottom: -0.125rem;                                                                |
| -left-0.5    | left: -0.125rem;                                                                  |

按以下尺寸表依次类推

| 尺寸 | 大小           |
| ---- | -------------- |
| 0    | 0              |
| 0.5  | 0.125rem;      |
| 1    | 0.25rem        |
| 1.5  | 0.375rem       |
| 1.5  | 0.375rem       |
| 2    | 0.5rem         |
| 2.5  | 0.625rem       |
| 3    | 0.75rem        |
| 3.5  | 0.875rem       |
| 4    | 1rem           |
| 5    | 1.25rem        |
| 6    | 1.5rem         |
| 7    | 1.75rem        |
| 8    | 2rem           |
| 9    | 2.25rem        |
| 10   | 2.5rem         |
| 11   | 2.75rem        |
| 12   | 3rem           |
| 14   | 3.5rem         |
| 16   | 4rem           |
| 20   | 5rem           |
| 24   | 6rem           |
| 28   | 7rem           |
| 32   | 8rem           |
| 36   | 9rem           |
| 40   | 10rem          |
| 44   | 11rem          |
| 48   | 12rem          |
| 52   | 13rem          |
| 56   | 14rem          |
| 60   | 15rem          |
| 64   | 16rem          |
| 68   | 17rem          |
| 72   | 18rem          |
| 76   | 19rem          |
| 80   | 20rem          |
| 96   | 24rem          |
| auto | auto           |
| 1/2  | 50%            |
| 1/3  | 33.333333%     |
| 2/3  | 66.666667%     |
| 1/4  | 25%;           |
| 2/4  | 50%;           |
| 3/4  | 75%;           |
| full | 100%;          |
| px   | 0.0625rem(1px) |

## 用法

结合 relative 和 absolute 定位 和位置样式 `{top|right|bottom|left|inset}-xxx`，可以很方便的实现各种组件布局。

```html
<div class="grid grid-cols-4 m:grid-cols-2 gap-4">

<!-- Span top edge -->
<div class="relative h-32 w-32 ... bg-blue-500">
  <div class="absolute inset-x-0 top-0 h-16 w-16 ... bg-red-500 text-white font-extrabold text-2xl flex items-center justify-center">1</div>
</div>

<!-- Span right edge -->
<div class="relative h-32 w-32 ... bg-blue-500">
  <div class="absolute inset-y-0 right-0 w-16 ... bg-red-500 text-white font-extrabold text-2xl flex items-center justify-center">2</div>
</div>

<!-- Span bottom edge -->
<div class="relative h-32 w-32 ... bg-blue-500">
  <div class="absolute inset-x-0 bottom-0 h-16 w-16 ... bg-red-500 text-white font-extrabold text-2xl flex items-center justify-center">3</div>
</div>

<!-- Span left edge -->
<div class="relative h-32 w-32 ... bg-blue-500">
  <div class="absolute inset-y-0 left-0 w-16 ... bg-red-500 text-white font-extrabold text-2xl flex items-center justify-center">4</div>
</div>

<!-- Fill entire parent -->
<div class="relative h-32 w-32 ... bg-blue-500">
  <div class="absolute inset-0 bg-red-500 text-white font-extrabold text-2xl flex items-center justify-center">5</div>
</div>

<!-- Pin to top left corner -->
<div class="relative h-32 w-32 ... bg-blue-500">
  <div class="absolute left-0 top-0 h-16 w-16 ... bg-red-500 text-white font-extrabold text-2xl flex items-center justify-center">6</div>
</div>

<!-- Pin to top right corner -->
<div class="relative h-32 w-32 ... bg-blue-500">
  <div class="absolute top-0 right-0 h-16 w-16 ... bg-red-500 text-white font-extrabold text-2xl flex items-center justify-center">7</div>
</div>

<!-- Pin to bottom right corner -->
<div class="relative h-32 w-32 ... bg-blue-500">
  <div class="absolute bottom-0 right-0 h-16 w-16 ... bg-red-500 text-white font-extrabold text-2xl flex items-center justify-center">8</div>
</div>

<!-- Pin to bottom left corner -->
<div class="relative h-32 w-32 ... bg-blue-500">
  <div class="absolute bottom-0 left-0 h-16 w-16 ... bg-red-500 text-white font-extrabold text-2xl flex items-center justify-center">9</div>
</div>

</div>
```

## 响应式设计

支持通过添加设备前缀 `m:` 或者 `pc:` 来分别针对「手机端」或者「pc端」设置样式，更多说明请前往[「响应式设计」](../../../docs/style/responsive-design.md)。

## 状态前缀

不支持[「状态前缀」](../../../docs/style/state.md)，有需求请提 [issue](https://github.com/baidu/amis/issues)。