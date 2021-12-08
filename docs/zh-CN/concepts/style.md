---
title: 样式
description:
type: 0
group: 💡 概念
menuName: 样式
icon:
order: 18
---

amis 中有大量的功能类 class 可以使用，即可以用在 schema 中，也可以用在自定义组件开发中，掌握这些 class, 几乎可以不用写样式。

<div class="bg-pink-500 text-light shadow p-4 rounded-md hover:bg-pink-600">
  <div class="text-lg b-b p-b-sm">注意</div>
  <div class="p-t-xs">CSS辅助类样式做了全新的升级，请点击顶部的「样式」查看新版。旧版本可以继续，但将不再更新。</div>
</div>

## 基本使用

例如，下面这个例子，我们内容区渲染了两个按钮，但是可以看到，两个按钮紧贴在一起，并不是很美观，于是我们想添加一定的间隔

```schema: scope="body"
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
2. 再查阅当前页面下面 [外边距部分](#%E5%A4%96%E8%BE%B9%E8%B7%9D) 可知，我们可以添加`m-l`类名实现`margin-left: 15px;`的 CSS 效果
3. 于是我们在`按钮2`的配置中添加`"className": "m-l"`，就能实现间距效果了

```schema: scope="body"
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

绝大部分组件都支持各种形式的 CSS 类名自定义，然后搭配该文档中的各种类名可以实现各式各样的样式调整。具体请查阅组件文档；

> 你可能需要掌握一些基础的 CSS 知识

## 字体颜色

实际颜色取决于主题，下面示例是默认主题的颜色。

```css
.text-primary {
  color: #7266ba;
}

.text-primary-lt {
  color: #6254b2;
}

.text-primary-lter {
  color: #564aa3;
}

.text-primary-dk {
  color: #6254b2;
}

.text-primary-dker {
  color: #564aa3;
}

.text-info {
  color: #23b7e5;
}

.text-info-lt {
  color: #19a9d5;
}

.text-info-lter {
  color: #1797be;
}

.text-info-dk {
  color: #19a9d5;
}

.text-info-dker {
  color: #1797be;
}

.text-success {
  color: #27c24c;
}

.text-success-lt {
  color: #23ad44;
}

.text-success-lter {
  color: #1e983b;
}

.text-success-dk {
  color: #23ad44;
}

.text-success-dker {
  color: #1e983b;
}

.text-warning {
  color: #fad733;
}

.text-warning-lt {
  color: #f9d21a;
}

.text-warning-lter {
  color: #f4ca06;
}

.text-warning-dk {
  color: #f9d21a;
}

.text-warning-dker {
  color: #f4ca06;
}

.text-danger {
  color: #f05050;
}

.text-danger-lt {
  color: #ee3939;
}

.text-danger-lter {
  color: #ec2121;
}

.text-danger-dk {
  color: #ee3939;
}

.text-danger-dker {
  color: #ec2121;
}

.text-dark {
  color: #3a3f51;
}

.text-dark-lt {
  color: #2f3342;
}

.text-dark-lter {
  color: #252833;
}

.text-dark-dk {
  color: #2f3342;
}

.text-dark-dker {
  color: #252833;
}

.text-white {
  color: #fff;
}

.text-white-lt {
  color: #f2f2f2;
}

.text-white-lter {
  color: #e6e6e6;
}

.text-white-dk {
  color: #f2f2f2;
}

.text-white-dker {
  color: #e6e6e6;
}

.text-black {
  color: #1c2b36;
}

.text-black-lt {
  color: #131e25;
}

.text-black-lter {
  color: #0b1014;
}

.text-black-dk {
  color: #131e25;
}

.text-black-dker {
  color: #0b1014;
}

.text-muted {
  color: var(--text--muted-color);
}

.text-loud {
  color: var(--text--loud-color);
}
```

## 图标

amis 集成了 [fontawesome](http://fontawesome.io/icons/)，所以关于图标部分，请前往 [fontawesome](http://fontawesome.io/icons/) 查看。

## 布局

水平布局可以考虑用 Bootstrap 的 [Grids](http://getbootstrap.com/css/#grid) 或者用 `hobx` 加 `col`

```html
<div class="hbox b-a">
  <div class="col wrapper-sm bg-success">Col A</div>
  <div class="col wrapper-sm bg-info">Col B</div>
  <div class="col wrapper-sm bg-danger">Col C</div>
</div>
```

## 宽高

```css

  width: 1em;
}

.w-2x {
  width: 2em;
}

.w-3x {
  width: 3em;
}

.w-xxs {
  width: 60px;
}

.h-xxs {
  height: 60px;
}

.w-xs {
  width: 90px;
}

.h-xs {
  height: 90px;
}

.w-ssm {
  width: 120px;
}

.w-sm {
  width: 150px;
}

.h-sm {
  height: 150px;
}

.h-ssm {
  height: 120px;
}

.w {
  width: 200px;
}

.h {
  height: 200px;
}

.w-md {
  width: 240px;
}

.h-md {
  height: 240px;
}

.w-lg {
  width: 280px;
}

.h-lg {
  height: 280px;
}

.w-xl {
  width: 320px;
}

.h-xl {
  height: 320px;
}

.w-xxl {
  width: 360px;
}

.h-xxl {
  height: 360px;
}

.w-xxxl {
  width: 420px;
}

.h-xxxl {
  height: 420px;
}

.w-full {
  width: 100%;
}

.w-auto {
  width: auto;
}

.h-auto {
  height: auto;
}

.h-full {
  height: 100%;
}
```

```html
<div class="hbox b-a bg-primary">
  <div class="col wrapper-sm b-r w-1x">w-1x</div>
  <div class="col wrapper-sm b-r w-2x">w-2x</div>
  <div class="col wrapper-sm b-r w-3x">w-3x</div>
  <div class="col wrapper-sm b-r w-xxs">w-xxs</div>
  <div class="col wrapper-sm b-r w-xs">w-xs</div>
  <div class="col wrapper-sm b-r w-sm">w-sm</div>
  <div class="col wrapper-sm b-r w">w</div>
  <div class="col wrapper-sm  lter">...</div>
</div>
<div class="hbox b-a bg-primary m-t">
  <div class="col wrapper-sm b-r w-md">w-md</div>
  <div class="col wrapper-sm b-r w-lg">w-lg</div>
  <div class="col wrapper-sm b-r w-xl">w-xl</div>
  <div class="col wrapper-sm lter">...</div>
</div>
<div class="hbox b-a bg-primary m-t">
  <div class="col wrapper-sm b-r w-xxl">w-xxl</div>
  <div class="col wrapper-sm lter">...</div>
</div>
```

## 外边距

```css
.m-xxs {
  margin: 2px 4px;
}
.m-xs {
  margin: 5px;
}
.m-sm {
  margin: 10px;
}
.m {
  margin: 15px;
}
.m-md {
  margin: 20px;
}
.m-lg {
  margin: 30px;
}
.m-xl {
  margin: 50px;
}
.m-n {
  margin: 0 !important;
}
.m-l-none {
  margin-left: 0 !important;
}
.m-l-xs {
  margin-left: 5px;
}
.m-l-sm {
  margin-left: 10px;
}
.m-l {
  margin-left: 15px;
}
.m-l-md {
  margin-left: 20px;
}
.m-l-lg {
  margin-left: 30px;
}
.m-l-xl {
  margin-left: 40px;
}
.m-l-xxl {
  margin-left: 50px;
}
.m-l-n-xxs {
  margin-left: -1px;
}
.m-l-n-xs {
  margin-left: -5px;
}
.m-l-n-sm {
  margin-left: -10px;
}
.m-l-n {
  margin-left: -15px;
}
.m-l-n-md {
  margin-left: -20px;
}
.m-l-n-lg {
  margin-left: -30px;
}
.m-l-n-xl {
  margin-left: -40px;
}
.m-l-n-xxl {
  margin-left: -50px;
}
.m-t-none {
  margin-top: 0 !important;
}
.m-t-xxs {
  margin-top: 1px;
}
.m-t-xs {
  margin-top: 5px;
}
.m-t-sm {
  margin-top: 10px;
}
.m-t {
  margin-top: 15px;
}
.m-t-md {
  margin-top: 20px;
}
.m-t-lg {
  margin-top: 30px;
}
.m-t-xl {
  margin-top: 40px;
}
.m-t-xxl {
  margin-top: 50px;
}
.m-t-n-xxs {
  margin-top: -1px;
}
.m-t-n-xs {
  margin-top: -5px;
}
.m-t-n-sm {
  margin-top: -10px;
}
.m-t-n {
  margin-top: -15px;
}
.m-t-n-md {
  margin-top: -20px;
}
.m-t-n-lg {
  margin-top: -30px;
}
.m-t-n-xl {
  margin-top: -40px;
}
.m-t-n-xxl {
  margin-top: -50px;
}
.m-r-none {
  margin-right: 0 !important;
}
.m-r-xxs {
  margin-right: 1px;
}
.m-r-xs {
  margin-right: 5px;
}
.m-r-sm {
  margin-right: 10px;
}
.m-r {
  margin-right: 15px;
}
.m-r-md {
  margin-right: 20px;
}
.m-r-lg {
  margin-right: 30px;
}
.m-r-xl {
  margin-right: 40px;
}
.m-r-xxl {
  margin-right: 50px;
}
.m-r-n-xxs {
  margin-right: -1px;
}
.m-r-n-xs {
  margin-right: -5px;
}
.m-r-n-sm {
  margin-right: -10px;
}
.m-r-n {
  margin-right: -15px;
}
.m-r-n-md {
  margin-right: -20px;
}
.m-r-n-lg {
  margin-right: -30px;
}
.m-r-n-xl {
  margin-right: -40px;
}
.m-r-n-xxl {
  margin-right: -50px;
}
.m-b-none {
  margin-bottom: 0 !important;
}
.m-b-xxs {
  margin-bottom: 1px;
}
.m-b-xs {
  margin-bottom: 5px;
}
.m-b-sm {
  margin-bottom: 10px;
}
.m-b {
  margin-bottom: 15px;
}
.m-b-md {
  margin-bottom: 20px;
}
.m-b-lg {
  margin-bottom: 30px;
}
.m-b-xl {
  margin-bottom: 40px;
}
.m-b-xxl {
  margin-bottom: 50px;
}
.m-b-n-xxs {
  margin-bottom: -1px;
}
.m-b-n-xs {
  margin-bottom: -5px;
}
.m-b-n-sm {
  margin-bottom: -10px;
}
.m-b-n {
  margin-bottom: -15px;
}
.m-b-n-md {
  margin-bottom: -20px;
}
.m-b-n-lg {
  margin-bottom: -30px;
}
.m-b-n-xl {
  margin-bottom: -40px;
}
.m-b-n-xxl {
  margin-bottom: -50px;
}
```

## 内边距

```css
.wrapper-xs {
  padding: 5px;
}
.wrapper-sm {
  padding: 10px;
}
.wrapper {
  padding: 15px;
}
.wrapper-md {
  padding: 20px;
}
.wrapper-lg {
  padding: 30px;
}
.wrapper-xl {
  padding: 50px;
}
.padder-xs {
  padding-left: 5px;
  padding-right: 5px;
}
.padder-sm {
  padding-left: 10px;
  padding-right: 10px;
}
.padder-lg {
  padding-left: 30px;
  padding-right: 30px;
}
.padder-md {
  padding-left: 20px;
  padding-right: 20px;
}
.padder {
  padding-left: 15px;
  padding-right: 15px;
}
.padder-v-xs {
  padding-top: 5px;
  padding-bottom: 5px;
}
.padder-v-sm {
  padding-top: 10px;
  padding-bottom: 10px;
}
.padder-v-lg {
  padding-top: 30px;
  padding-bottom: 30px;
}
.padder-v-md {
  padding-top: 20px;
  padding-bottom: 20px;
}
.padder-v {
  padding-top: 15px;
  padding-bottom: 15px;
}
.no-padder {
  padding: 0 !important;
}
.pull-in {
  margin-left: -15px;
  margin-right: -15px;
}
.pull-out {
  margin: -10px -15px;
}
```

## 边框

```css
.b {
  border: 1px solid rgba(0, 0, 0, 0.05);
}
.b-a {
  border: 1px solid @border-color;
}
.b-t {
  border-top: 1px solid @border-color;
}
.b-r {
  border-right: 1px solid @border-color;
}
.b-b {
  border-bottom: 1px solid @border-color;
}
.b-l {
  border-left: 1px solid @border-color;
}
.b-light {
  border-color: @brand-light;
}
.b-dark {
  border-color: @brand-dark;
}
.b-black {
  border-color: @brand-dark;
}
.b-primary {
  border-color: @brand-primary;
}
.b-success {
  border-color: @brand-success;
}
.b-info {
  border-color: @brand-info;
}
.b-warning {
  border-color: @brand-warning;
}
.b-danger {
  border-color: @brand-danger;
}
.b-white {
  border-color: #fff;
}
.b-dashed {
  border-style: dashed !important;
}
.b-l-light {
  border-left-color: @brand-light;
}
.b-l-dark {
  border-left-color: @brand-dark;
}
.b-l-black {
  border-left-color: @brand-dark;
}
.b-l-primary {
  border-left-color: @brand-primary;
}
.b-l-success {
  border-left-color: @brand-success;
}
.b-l-info {
  border-left-color: @brand-info;
}
.b-l-warning {
  border-left-color: @brand-warning;
}
.b-l-danger {
  border-left-color: @brand-danger;
}
.b-l-white {
  border-left-color: #fff;
}
.b-l-2x {
  border-left-width: 2px;
}
.b-l-3x {
  border-left-width: 3px;
}
.b-l-4x {
  border-left-width: 4px;
}
.b-l-5x {
  border-left-width: 5px;
}
.b-2x {
  border-width: 2px;
}
.b-3x {
  border-width: 3px;
}
.b-4x {
  border-width: 4px;
}
.b-5x {
  border-width: 5px;
}
```

## 圆角

```css
.r {
  border-radius: @border-radius-base @border-radius-base @border-radius-base
    @border-radius-base;
}
.r-2x {
  border-radius: @border-radius-base * 2;
}
.r-3x {
  border-radius: @border-radius-base * 3;
}
.r-l {
  border-radius: @border-radius-base 0 0 @border-radius-base;
}
.r-r {
  border-radius: 0 @border-radius-base @border-radius-base 0;
}
.r-t {
  border-radius: @border-radius-base @border-radius-base 0 0;
}
.r-b {
  border-radius: 0 0 @border-radius-base @border-radius-base;
}
```

## 字体相关

```css
.font-normal {
  font-weight: normal;
}
.font-thin {
  font-weight: 300;
}
.font-bold {
  font-weight: 700;
}
.text-3x {
  font-size: 3em;
}
.text-2x {
  font-size: 2em;
}
.text-lg {
  font-size: @font-size-lg;
}
.text-md {
  font-size: @font-size-md;
}
.text-base {
  font-size: @font-size-base;
}
.text-sm {
  font-size: @font-size-sm;
}
.text-xs {
  font-size: @font-size-xs;
}
.text-xxs {
  text-indent: -9999px;
}
.text-ellipsis {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-u-c {
  text-transform: uppercase;
}
.text-l-t {
  text-decoration: line-through;
}
.text-u-l {
  text-decoration: underline;
}
.text-left {
  text-align: left;
}
.text-center {
  text-align: center;
}
.text-right {
  text-align: right;
}
.word-break {
  white-space: normal;
  word-break: break-all;
  word-wrap: break-word;
}
.white-space-pre {
  white-space: pre;
}
```

## 定位

```css
.pos-rlt {
  position: relative;
}
.pos-stc {
  position: static !important;
}
.pos-abt {
  position: absolute;
}
.pos-fix {
  position: fixed;
}
```

## 背景

```html
<div class="hbox b-a bg-light">
  <div class="col wrapper-sm b-r bg-white">bg-white</div>
  <div class="col wrapper-sm b-r bg-dark">bg-dark</div>
  <div class="col wrapper-sm b-r bg-info">bg-info</div>
  <div class="col wrapper-sm b-r bg-success">bg-success</div>
  <div class="col wrapper-sm b-r bg-warning">bg-warning</div>
  <div class="col wrapper-sm b-r bg-danger">bg-danger</div>
  <div class="col wrapper-sm bg-primary">bg-primary</div>
</div>
```

## 其他

```css
.show {
  visibility: visible;
}
.line {
  width: 100%;
  height: 2px;
  margin: 10px 0;
  font-size: 0;
  overflow: hidden;
  background-color: transparent;
  border-width: 0;
  border-top: 1px solid @border-color;
}
.line-xs {
  margin: 0;
}
.line-lg {
  margin-top: 15px;
  margin-bottom: 15px;
}
.line-dashed {
  border-style: dashed;
  background: transparent;
}
.no-line {
  border-width: 0;
}
.no-border,
.no-borders {
  border-color: transparent;
  border-width: 0;
}
.no-radius {
  border-radius: 0;
}
.block {
  display: block;
}
.block.hide {
  display: none;
}
.inline {
  display: inline-block !important;
}
.none {
  display: none;
}
.pull-left {
  float: left;
}
.pull-right {
  float: right;
}
.pull-none {
  float: none;
}
.rounded {
  border-radius: 500px;
}
.clear {
  display: block;
  overflow: hidden;
}
.no-bg {
  background-color: transparent;
  color: inherit;
}
.no-select {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```
