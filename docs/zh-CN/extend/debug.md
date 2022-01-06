---
title: Debug 工具
---

> 1.6.1 及以上版本

amis 内置了 Debug 功能，可以查看组件内部运行日志，方便分析问题，目前在文档右侧就有显示。

## 显示方法

默认不会显示这个功能，可以通过下面两种方式开启：

1. 配置全局变量 `enableAMISDebug` 的值为 `true`，比如 `window.enableAMISDebug = true`。
2. 在页面 URL 参数中加上 `amisDebug=1`，比如 `http://xxx.com/?amisDebug=1`。

## 目前功能

目前主要提供了两个功能

1. 运行日志，主要是 api 及数据转换的日志
2. 查看组件数据域
