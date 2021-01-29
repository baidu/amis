---
title: 常见问题
---

## 如何实现左侧导航栏页面跳转？

在 1.1.1 之后的版本提供了新的 app 组件，可以基于它实现导航功能，请参考 `https://github.com/aisuda/amis-admin` 项目。

另外 amis 团队还开发了「[爱速搭](http://suda.baidu.com/)」，即便完全不懂前端也能基于它开发应用。

## 集成到 React 项目中报错

一般都是因为 React、Mobx、mobx-react 版本有关，参考 amis 项目的 [package.json](https://github.com/baidu/amis/blob/master/package.json)，将版本保持一致，尤其是 Mobx，目前 amis 中使用的版本是 4，因为兼容性的考虑短期内不会升级到 5/6，使用 MobX 5/6 肯定会报错。

## 有的功能在官网示例中能用，但在 React/SDK 中无法使用

如果提示找不到渲染器，那肯定是版本较老，尝试以下两种方法解决：

1. 使用最新 beta 版本，方法是去 [npm](https://www.npmjs.com/package/amis?activeTab=versions) 查看最新版本号，比如最新版本是 1.1.2-beta.2
   ，就运行运行 `npm i amis@1.1.2-beta.2` 命令，在 `node_modules/amis/sdk` 目录中也能找到对应的 sdk 代码。
2. 如果还是报错，可以使用最新代码自动编译的 sdk，下载地址是 `https://github.com/baidu/amis/blob/gh-pages/sdk.tar.gz`
