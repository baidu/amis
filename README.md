# amis

前端低代码框架，通过 JSON 配置就能生成各种后台页面，极大减少开发成本，甚至可以不需要了解前端。

目前在百度广泛用于内部平台的前端开发，已有 100+ 部门使用，创建了 3w+ 页面。

## 文档

<https://baidu.gitee.io/amis/docs/index>

## 相关工具及平台

- 通过 amis 搭建自己的后台系统：https://github.com/fex-team/amis-admin
- 可视化编辑器：https://github.com/fex-team/amis-editor
- 爱速搭，基于 amis 的低代码平台：https://suda.baidu.com/

## 开发指南

以下是参与开发 amis 才需要看的，使用请看前面的文档。

> 如果 github 下载慢可以使用 [gitee](https://gitee.com/baidu/amis) 上的镜像。

推荐使用 node 8/10/12。

```bash
# 安装项目 npm 依赖，在 node 12 下会有报错但不影响正常使用。
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

- [2betop](https://github.com/2betop)
- [RickCole21](https://github.com/RickCole21)
- [catchonme](https://github.com/catchonme)
- [nwind](https://github.com/nwind)

## 讨论

- Issues: https://github.com/baidu/amis/issues
- [如流](https://infoflow.baidu.com/)群：3395342
- QQ 群: 1147750223
