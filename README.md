# amis

前端低代码框架，通过 JSON 配置就能生成各种后台页面。

目前在百度大量用于内部平台的前端开发，已有 100+ 部门使用，创建了 1.2w+ 页面。

通过 amis 搭建自己的后台系统，可以参考这： https://github.com/fex-team/amis-admin

## 快速开始

请参考 <https://baidu.github.io/amis/docs/getting-started>

## 开发指南

推荐使用 node 10，node 6 和 node 8 也可以。node 12 未测试，可能 fis3 还有些插件不支持。

```bash
# 安装项目 npm 依赖。
npm i

# 开始编译，把代码产出到刚开启的服务的 webroot 目录。
# 这个程序不会自动结束，进入一个 watch 模式，文件变动会重新编译。
npm run dev

# 开启 fis3 服务，请通过 http://127.0.0.1:8888/examples/pages/simple 访问。
npm start
```

### 测试

```bash
# 安装依赖
npm i

# 执行测试用例
npm test

# 查看测试用例覆盖率
npm run coverage
```

### 如何贡献

请采用 typescript 编写，所有合理的改动、新的公用渲染器、用例或者文档的提交都会被接收。

## 维护者

-   [2betop](https://github.com/2betop)
-   [RickCole21](https://github.com/RickCole21)
-   [catchonme](https://github.com/catchonme)

## 讨论

<https://github.com/baidu/amis/issues>
