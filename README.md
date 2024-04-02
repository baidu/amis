<div align="center">
  <p>
    <img width="284" src="https://github.com/baidu/amis/raw/master/examples/static/logo.png">
  </p>

[文档（国内）](https://aisuda.bce.baidu.com/amis/) |
[文档（国外）](https://baidu.github.io/amis/) |
[可视化编辑器](https://aisuda.github.io/amis-editor-demo/) |
[amis-admin](https://github.com/aisuda/amis-admin) |
[爱速搭](https://aisuda.baidu.com/)

</div>

<div align="center">
  如流群：3395342 |
  如流群2：5511067|
</div>

<div align="center">

![build](https://img.shields.io/github/actions/workflow/status/baidu/amis/gh-pages.yml)
![license](https://img.shields.io/github/license/baidu/amis.svg)
![version](https://img.shields.io/npm/v/amis)
![language](https://img.shields.io/github/languages/top/baidu/amis)
[![codecov](https://codecov.io/gh/baidu/amis/branch/master/graph/badge.svg?token=9LwimHGoE5)](https://codecov.io/gh/baidu/amis)
![last](https://img.shields.io/github/last-commit/baidu/amis.svg)

</div>

前端低代码框架，通过 JSON 配置就能生成各种后台页面，极大减少开发成本，甚至可以不需要了解前端。

## 开发指南

以下是参与开发 amis 才需要看的，使用请看前面的文档。

> 如果 github 下载慢可以使用 [gitee](https://gitee.com/baidu/amis) 上的镜像。

推荐使用 node 12/14/16。npm 7+， 因为用到了 workspaces 功能。

```bash
# 安装项目 npm 依赖，在 node 12 下会有报错但不影响正常使用。
npm i --legacy-peer-deps

# 启动项目，等编译结束后通过 http://127.0.0.1:8888/examples/pages/simple 访问。
npm start
```

如果是开发编辑器，需要访问 `http://127.0.0.1:8888/packages/amis-editor/`

### 测试

> 注意：本地修改代码后，执行测试用例（`npm test --workspaces`）之前需要先执行`npm run build`完成编译，因为 jest 并不支持 TypeScript

```bash
# 安装依赖
npm i --legacy-peer-deps

# 执行构建
npm run build

# 执行测试用例
npm test --workspaces

# 测试某个用例
# <spec-name>为用例名称，比如inputImage
npm test --workspace amis -- -t <spec-name>

# 运行某个单测文件
./node_modules/.bin/jest packages/amis/__tests__/renderers/Form/buttonToolBar.test.tsx

# 运行某个单测文件里的某个例子
./node_modules/.bin/jest packages/amis/__tests__/renderers/Form/buttonToolBar.test.tsx -t 'Renderer:button-toolbar'

# 查看测试用例覆盖率
npm run coverage

# 更新 snapshot
npm run update-snapshot

# 更新单个 snapshot
# <spec-name>为用例名称，比如inputImage
npm run update-snapshot --workspace amis -- -t  <spec-name>
```

### 发布版本

```bash
# 发布内部 registry
npm run publish

# 发布外网环境
# 先通过一下命令设置版本号
npm run version
npm run release
```

### 如何贡献

请使用分支开发，首先创建分支

    git checkout -b feat-xxx

开发提交后使用 `git push --set-upstream origin feat-xxx` 创建远程分支。

然后通过系统提示的 https://github.com/xxx/amis/pull/new/feat-xxx 链接来提交 PR。

请采用 typescript 编写，所有合理的改动、新的公用渲染器、用例或者文档的提交都会被接收。

## 贡献者

<a href="https://github.com/baidu/amis/graphs/contributors"><img src="https://opencollective.com/amis/contributors.svg?width=890" /></a>

## 低代码平台

amis 只能实现前端低代码，如果需要完整的低代码平台推荐使用[爱速搭](https://aisuda.baidu.com/)。
