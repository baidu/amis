# amis Editor

amis 可视化编辑工具

## 如何使用

```jsx
import {Editor} from 'amis-editor';


render() {
  return (
    <Editor
      {...props}
    />
  )
}
```

属性说明：

- `value: any` 值，amis 的 json 配置。
- `onChange: (value: any) => void`。 当编辑器修改的时候会触发。
- `preview?: boolean` 是否为预览状态。
- `autoFocus?: boolean` 是否自动聚焦第一个可编辑的组件。

## 开发相关

```
# 设置 @fex npm 包走 内部 registry
npm config set @fex:registry http://registry.efe.tech

# 安装项目 npm 依赖。
npm i

# 启动项目，请通过 http://127.0.0.1:8888/examples/pages/simple 访问。
npm start
```

## 测试

目前还没有集成测试用例，请在 exmples 目录添加相应的示例。

## 编辑 npm 版本

```
npm run build
```

## 使用本地 amis

在 amis 目录运行

```
./node_modules/.bin/fis3 release publish -cwd ../editor/node_modules/amis/lib/
```

## 内网版本发版

1. 注册帐号并登陆，内网仓库是没帐号密码的

   npm adduser --registry=http://registry.npm.baidu-int.com
   npm login --registry=http://registry.npm.baidu-int.com

2. 查看最新版本号

   npm view @fex/amis-editor versions --registry=http://registry.npm.baidu-int.com

3. 修改 package.json 里的版本号
4. 运行 `npm run publish-to-internal`

如果要发外网版本，需要使用 `npm login --registry=npm login --registry=http://registry.npmjs.com`，帐号是 fis-dev，密码问群里.

然后使用 `npm publish --registry=http://registry.npmjs.com` 发版
