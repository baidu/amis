---
title: 调试工具
---

> 1.6.1 及以上版本

amis 内置了调试工具，可以查看组件内部运行日志，方便分析问题，目前在文档右侧就有显示。

## 开启方法

默认不会开启这个功能，可以通过下面三种方式开启：

1. render 的 env 里设置 `enableAMISDebug`。
1. 配置全局变量 `enableAMISDebug` 的值为 `true`，比如 `window.enableAMISDebug = true`。
1. 在页面 URL 参数中加上 `amisDebug=1`，比如 `http://xxx.com/?amisDebug=1`。

开启之后，在页面右侧就会显示。

## 目前功能

目前 Debug 工具提供了两个功能:

1. 运行日志，主要是 api 及数据转换的日志
2. 查看组件数据链，Debug 工具展开后，点击任意组件就能看到这个组件的数据链
