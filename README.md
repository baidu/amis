# amis

一种页面渲染器，可以直接基于特定格式的 JSON 配置将页面渲染出来，结合业务方 API 可快速完成各类管理页面的开发。

目前用于百度内部 [AMIS](http://amis.baidu.com) 平台，已有 100+ 部门接入使用，创建 1.2w+ 页面，欢迎大家使用和提建议。

通过 amis 搭建自己的后台系统，可以参考这： https://github.com/fex-team/amis-admin

## 快速开始

推荐使用 node 10，理论上 node 6 和 node 8 都可以。node 12 太新估计 fis3 还有些插件不支持。

```
# 安装项目 npm 依赖。
npm i

# 开始编译，把代码产出到刚开启的服务的 webroot 目录。
# 这个程序不会自动结束，进入一个 watch 模式，文件变动会重新编译。
npm run dev

# 开启 fis3 服务，请通过 http://127.0.0.1:8888/examples/pages/simple 访问。
npm start
```

## 测试

```bash
# 安装依赖
npm i 

# 执行测试用例
npm test

# 查看测试用例覆盖率
npm run coverage
```

## 使用文档

为了更好的阅读体验，建议直接在 gh-pages 中阅读 https://baidu.github.io/amis/ 。

* [快速开始](/docs/getting_started.md)
* [基本用法](/docs/basic.md)
* [高级用法](/docs/advanced.md)
* [渲染器手册](/docs/renderers.md)
* [如何定制](/docs/sdk.md)
* [自定义组件](/docs/dev.md)
* [辅助样式](/docs/style.md)

## 如何贡献

请采用 typescript 编写，所有合理的改动、新的公用渲染器、用例或者文档的提交都会被接收。

## 维护者

* [2betop](https://github.com/2betop)
* [RickCole21](https://github.com/RickCole21)
* [catchonme](https://github.com/catchonme)

## 讨论

欢迎提 ISSUE 讨论。
