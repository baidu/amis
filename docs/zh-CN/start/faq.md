---
title: 常见问题
---

## 如何实现左侧导航栏页面跳转？

为了能更容易嵌入其它平台，amis 只负责单页面渲染，不接管前端路由，因此无法只靠 amis 配置实现多页面切换功能，推荐使用以下几种方法：

1. 自己实现左侧导航栏，用 amis 渲染右侧页面，类似 <https://github.com/fex-team/amis-admin> 项目里的做法。
2. 使用传统的页面跳转，这样就能使用 amis 的 aside，其中通过 link 类型来跳转到另一个页面。
3. 使用「[爱速搭](http://suda.baidu.com/)」，它可以配置左侧导航，还自带了权限管理等功能。

## 集成到 React 项目中报错

一般都是因为 React、Mobx、mobx-react 版本有关，参考 amis 项目的 [package.json](https://github.com/baidu/amis/blob/master/package.json)，将版本保持一致，尤其是 Mobx，目前 amis 中使用的版本是 4，因为兼容性的考虑短期内不会升级到 5，使用 MobX 5 肯定会报错。

## 有的功能在官网示例中能用，但在 React/SDK 中无法使用

如果提示找不到渲染器，那肯定是版本较老，尝试以下两种方法解决：

1. 使用最新 beta 版本，方法是去 [npm](https://www.npmjs.com/package/amis?activeTab=versions) 查看最新版本号，比如最新版本是 1.0.20-beta.18
   ，就运行运行 `npm i amis@1.0.20-beta.18` 命令，在 `node_modules/amis/sdk` 目录中也能找到对应的 sdk 代码。
2. 如果还是报错，可以使用 master 分支的最新版本，下载项目源码后运行 `fis3 release publish-sdk -c`，在 sdk 目录中就能找到。
