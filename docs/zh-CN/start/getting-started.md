---
title: 快速开始
description:
---

amis 有两种使用方法：

- [JS SDK](#SDK)，可以用在任意页面中
- [React](#react)，可以用在 React 项目中

SDK 版本适合对前端或 React 不了解的开发者，它不依赖 npm 及 webpack，可以像 Vue/jQuery 那样外链代码就能使用。

## SDK

下载方式：

1. github 的 [releases](https://github.com/baidu/amis/releases)，文件是 sdk.tar.gz。
1. 使用 `npm i amis` 来下载，在 `node_modules\amis\sdk` 目录里就能找到。

新建一个 hello.html 文件，内容如下：

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <title>amis demo</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <link rel="stylesheet" href="sdk.css" />
    <link rel="stylesheet" href="helper.css" />
    <link rel="stylesheet" href="iconfont.css" />
    <!-- 这是默认主题所需的，如果是其他主题则不需要 -->
    <!-- 从 1.1.0 开始 sdk.css 将不支持 IE 11，如果要支持 IE11 请引用这个 css，并把前面那个删了 -->
    <!-- <link rel="stylesheet" href="sdk-ie11.css" /> -->
    <!-- 不过 amis 开发团队几乎没测试过 IE 11 下的效果，所以可能有细节功能用不了，如果发现请报 issue -->
    <style>
      html,
      body,
      .app-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="root" class="app-wrapper"></div>
    <script src="sdk.js"></script>
    <script type="text/javascript">
      (function () {
        let amis = amisRequire('amis/embed');
        // 通过替换下面这个配置来生成不同页面
        let amisJSON = {
          type: 'page',
          title: '表单页面',
          body: {
            type: 'form',
            mode: 'horizontal',
            api: '/saveForm',
            body: [
              {
                label: 'Name',
                type: 'input-text',
                name: 'name'
              },
              {
                label: 'Email',
                type: 'input-email',
                name: 'email'
              }
            ]
          }
        };
        let amisScoped = amis.embed('#root', amisJSON);
      })();
    </script>
  </body>
</html>
```

### 切换主题

jssdk 版本默认使用 `sdk.css` 即云舍主题，如果你想用使用仿 Antd，请将 css 引用改成 `.antd.css`。同时 js 渲染地方第四个参数传入 `theme` 属性。如：

```js
amis.embed(
  '#root',
  {
    // amis schema
  },
  {
    // 这里是初始 props
  },
  // 注意是第四个参数
  {
    theme: 'antd'
  }
);
```

> 如果想使用 amis 1.2.2 之前的默认主题，名字是 ang

### 初始值

可以通过 props 里的 data 属性来赋予 amis 顶层数据域的值，类似下面的例子。

```js
let amis = amisRequire('amis/embed');
let amisJSON = {
  type: 'page',
  body: {
    type: 'tpl',
    tpl: '${myData}'
  }
};
let amisScoped = amis.embed('#root', amisJSON, {
  data: {
    myData: 'amis'
  }
});
```

### 控制 amis 的行为

`amis.embed` 函数还支持以下配置项来控制 amis 的行为，比如在 fetcher 的时候加入自己的处理逻辑，这些函数参数的说明在后面 React 中也有介绍。

```js
let amisScoped = amis.embed(
  '#root',
  amisJSON,
  {
    // 这里是初始 props，一般不用传。
    // locale: 'en-US' // props 中可以设置语言，默认是中文
  },
  {
    // 下面是一些可选的外部控制函数
    // 在 sdk 中可以不传，用来实现 ajax 请求，但在 npm 中这是必须提供的
    // fetcher: (url, method, data, config) => {},
    // 全局 api 请求适配器
    // 另外在 amis 配置项中的 api 也可以配置适配器，针对某个特定接口单独处理。
    //
    // requestAdaptor(api) {
    //   return api;
    // }
    //
    // 全局 api 适配器。
    // 另外在 amis 配置项中的 api 也可以配置适配器，针对某个特定接口单独处理。
    // responseAdaptor(api, payload, query, request, response) {
    //   return payload;
    // }
    //
    // 用来接管页面跳转，比如用 location.href 或 window.open，或者自己实现 amis 配置更新
    // jumpTo: to => { location.href = to; },
    //
    // 用来实现地址栏更新
    // updateLocation: (to, replace) => {},
    //
    // 用来判断是否目标地址当前地址。
    // isCurrentUrl: url => {},
    //
    // 用来实现复制到剪切板
    // copy: content => {},
    //
    // 用来实现通知
    // notify: (type, msg) => {},
    //
    // 用来实现提示
    // alert: content => {},
    //
    // 用来实现确认框。
    // confirm: content => {},
    //
    // 主题，默认是 default，还可以设置成 cxd 或 dark，但记得引用它们的 css，比如 sdk 目录下的 cxd.css
    // theme: 'cxd'
    //
    // 用来实现用户行为跟踪，详细请查看左侧高级中的说明
    // tracker: (eventTracker) => {},
  }
);
```

同时返回的 `amisScoped` 对象可以获取到 amis 渲染的内部信息，它有如下方法：

`getComponentByName(name)` 用于获取渲染出来的组件，比如下面的示例

```json
{
  "type": "page",
  "name": "page1",
  "title": "表单页面",
  "body": {
    "type": "form",
    "name": "form1",
    "body": [
      {
        "label": "Name",
        "type": "input-text",
        "name": "name1"
      }
    ]
  }
}
```

可以通过 `amisScoped.getComponentByName('page1.form1').getValues()` 来获取到所有表单的值，需要注意 page 和 form 都需要有 name 属性。

还可以通过 `amisScoped.getComponentByName('page1.form1').setValues({'name1': 'othername'})` 来修改表单中的值。

### 更新属性

可以通过 amisScoped 对象的 updateProps 方法来更新下发到 amis 的属性。

```ts
amisScoped.updateProps(
  {
    // 新的属性对象
  } /*, () => {} 更新回调 */
);
```

### 多页模式

默认 amis 渲染是单页模式，如果想实现多页应用，请使用 [app 渲染器](../../components/app)。

### Hash 路由

默认 JSSDK 不是 hash 路由，如果你想改成 hash 路由模式，请查看此处代码实现。只需要修改 env.isCurrentUrl、env.jumpTo 和 env.updateLocation 这几个方法即可。

参考：https://github.com/baidu/amis/blob/master/examples/components/Example.jsx#L551-L575

### 销毁

如果是单页应用，在离开当前页面的时候通常需要销毁实例，可以通过 unmount 方法来完成。

```ts
amisScoped.unmount();
```

## react

初始项目请参考 <https://github.com/aisuda/amis-react-starter>。

如果在已有项目中，React 版本需要是 `>=16.8.6`，mobx 需要 `^4.5.0`。

amis 1.6.5 及以上版本支持 React 17。

### 安装

```
npm i amis
```

### webpack 配置参考

如果要使用代码编辑器，需要 `monaco-editor-webpack-plugin` 插件

```javascript
const path = require('path');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.tsx'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'url-loader?limit=10000'
      },
      {
        test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.ttf$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new MonacoWebpackPlugin(),
    new ForkTsCheckerWebpackPlugin()
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.html']
  },
  output: {
    filename: '[name].bundle.js',
    publicPath: '/'
  }
};
```

### 主题样式

目前主要支持两个主题：`cxd（云舍）` 和 `antd（仿 Antd）`

1. 引入样式文件：

html 中引入：

```html
<link href="./node_modules/amis/lib/themes/cxd.css" />
<link href="./node_modules/amis/lib/helper.css" />
<link href="./node_modules/amis/sdk/iconfont.css" />
<!-- 或 <link href="./node_modules/amis/lib/themes/antd.css" /> -->
```

js 中引入：

```js
import './node_modules/amis/lib/themes/cxd.css';
import './node_modules/amis/lib/helper.css';
import './node_modules/amis/sdk/iconfont.css';
// 或 import './node_modules/amis/lib/themes/antd.css';
```

> 上面只是示例，请根据自己的项目结构调整引用路径
> 如果要支持 IE 11 请引入 ./node_modules/amis/sdk/cxd-ie11.css，但这样就没法支持 CSS 变量了

2. 渲染器使用配置主题

```js
renderAmis(
  {
    type: 'page',
    title: '简单页面',
    body: '内容'
  },
  {
    // props
  },
  {
    // env...
    theme: 'cxd' // cxd 或 antd
  }
);
```

### 使用指南

可以在 React Component 这么使用（TypeScript）。

1. 安装部分示例需要的插件库

```
npm i axios copy-to-clipboard
```

> 为了方便示例，上面选用了我们常用几个插件库，你完全可以选择自己喜欢的插件并重新实现

2. 代码实现（React Typescript）

```tsx
import * as React from 'react';
import axios from 'axios';
import copy from 'copy-to-clipboard';

import {render as renderAmis, ToastComponent, AlertComponent} from 'amis';
import {alert, confirm} from 'amis/lib/components/Alert';
import {toast} from 'amis/lib/components/Toast';

class MyComponent extends React.Component<any, any> {
  render() {
    let amisScoped;
    let theme = 'cxd';
    let locale = 'zh-CN';

    // 请勿使用 React.StrictMode，目前还不支持
    return (
      <div>
        <p>通过 amis 渲染页面</p>
        <ToastComponent
          theme={theme}
          key="toast"
          position={'top-right'}
          locale={locale}
        />
        <AlertComponent theme={theme} key="alert" locale={locale} />
        {renderAmis(
          {
            // 这里是 amis 的 Json 配置。
            type: 'page',
            title: '简单页面',
            body: '内容'
          },
          {
            // props...
            // locale: 'en-US' // 请参考「多语言」的文档
            // scopeRef: (ref: any) => (amisScoped = ref)  // 功能和前面 SDK 的 amisScoped 一样
          },
          {
            // 下面三个接口必须实现
            fetcher: ({
              url, // 接口地址
              method, // 请求方法 get、post、put、delete
              data, // 请求数据
              responseType,
              config, // 其他配置
              headers // 请求头
            }: any) => {
              config = config || {};
              config.withCredentials = true;
              responseType && (config.responseType = responseType);

              if (config.cancelExecutor) {
                config.cancelToken = new (axios as any).CancelToken(
                  config.cancelExecutor
                );
              }

              config.headers = headers || {};

              if (method !== 'post' && method !== 'put' && method !== 'patch') {
                if (data) {
                  config.params = data;
                }

                return (axios as any)[method](url, config);
              } else if (data && data instanceof FormData) {
                config.headers = config.headers || {};
                config.headers['Content-Type'] = 'multipart/form-data';
              } else if (
                data &&
                typeof data !== 'string' &&
                !(data instanceof Blob) &&
                !(data instanceof ArrayBuffer)
              ) {
                data = JSON.stringify(data);
                config.headers = config.headers || {};
                config.headers['Content-Type'] = 'application/json';
              }

              return (axios as any)[method](url, data, config);
            },
            isCancel: (value: any) => (axios as any).isCancel(value),
            copy: content => {
              copy(content);
              toast.success('内容已复制到粘贴板');
            },
            theme

            // 后面这些接口可以不用实现

            // 默认是地址跳转
            // jumpTo: (
            //   location: string /*目标地址*/,
            //   action: any /* action对象*/
            // ) => {
            //   // 用来实现页面跳转, actionType:link、url 都会进来。
            // },

            // updateLocation: (
            //   location: string /*目标地址*/,
            //   replace: boolean /*是replace，还是push？*/
            // ) => {
            //   // 地址替换，跟 jumpTo 类似
            // },

            // isCurrentUrl: (
            //   url: string /*url地址*/,
            // ) => {
            //   // 用来判断是否目标地址当前地址
            // },

            // notify: (
            //   type: 'error' | 'success' /**/,
            //   msg: string /*提示内容*/
            // ) => {
            //   toast[type]
            //     ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
            //     : console.warn('[Notify]', type, msg);
            // },
            // alert,
            // confirm,
            // tracker: (eventTracke) => {}
          }
        )}
      </div>
    );
  }
}
```

render 有三个参数，后面会详细说明这三个参数内的属性

```js
(schema, props, env) => JSX.Element;
```

### schema

即页面配置，请前往 [配置与组件](../concepts/schema) 了解

### props

一般都用不上，如果你想传递一些数据给渲染器内部使用，可以传递 data 数据进去。如：

```jsx
() =>
  renderAmis(schema, {
    data: {
      username: 'amis'
    }
  });
```

这样，内部所有组件都能拿到 `username` 这个变量的值。当然，这里的 key 并不一定必须是 data , 你也可以是其它 key，但必须配合 schema 中的 `detectField` 属性一起使用。 如：

```jsx
() =>
  renderAmis(
    {
      //其它配置
      detectField: 'somekey'
    },
    {
      somekey: {
        username: 'amis'
      }
    }
  );
```

### env

环境变量，可以理解为这个渲染器工具的配置项，需要使用 amis 用户实现部分接口。他有下面若干参数：

#### fetcher（必须实现）

接口请求器，实现该函数才可以实现 ajax 发送，函数签名如下：

```ts
(config: {
  url; // 接口地址
  method; // 请求方法 get、post、put、delete
  data; // 请求数据
  responseType;
  config; // 其他配置
  headers; // 请求头
}) => Promise<fetcherResult>;
```

> 你可以使用任何你喜欢的 ajax 请求库来实现这个接口

#### notify

```ts
(type: string, msg: string) => void
```

用来实现消息提示。

#### alert

```ts
(msg: string) => void
```

用来实现警告提示。

#### confirm

```ts
(msg: string) => boolean | Promise<boolean>
```

用来实现确认框。返回 boolean 值

#### jumpTo

```ts
(to: string, action?: Action, ctx?: object) => void
```

用来实现页面跳转，因为不清楚所在环境中是否使用了 spa 模式，所以用户自己实现吧。

#### updateLocation

```ts
(location: any, replace?: boolean) => void
```

地址替换，跟 jumpTo 类似。

#### blockRouting

设置阻止路由跳转的钩子函数，用来实现 form 未保存提前离开时出现确认框。

```ts
(fn: (nextLocation:any) => void | string) => () => void;
```

#### theme: string

目前支持是三种主题：`default`、`cxd` 和 `dark`

#### isCurrentUrl

```ts
(link: string) => boolean;
```

判断目标地址是否为当前页面。

#### copy

```ts
(contents: string, options?: {silent: boolean, format?: string})
```

用来实现内容复制，其中 `format` 可以为 text/html，或 text/plain

#### tracker

用户行为跟踪，请参考[这里](../extend/tracker)

#### session

默认为 'global'，决定 store 是否为全局共用的，如果想单占一个 store，请设置不同的值。

#### getModalContainer

```ts
() => HTMLElement;
```

用来决定弹框容器。

#### loadRenderer

```ts
(schema: any, path: string) => Promise<Function>
```

可以通过它懒加载自定义组件，比如： https://github.com/baidu/amis/blob/master/__tests__/factory.test.tsx#L64-L91。

#### affixOffsetTop: number

固顶间距，当你的有其他固顶元素时，需要设置一定的偏移量，否则会重叠。

#### affixOffsetBottom: number

固底间距，当你的有其他固底元素时，需要设置一定的偏移量，否则会重叠。

#### richTextToken: string

内置 rich-text 为 frolaEditor，想要使用，请自行购买，或者用免费的 Tinymce，不设置 token 默认就是 Tinymce。

#### hideValidateFailedDetail: boolean

Form 表单验证失败时在 notify 消息提示中是否隐藏详细信息，默认展示，设置为 true 时隐藏

#### replaceText

> 1.5.0 及以上版本

可以用来实现变量替换及多语言功能，比如下面的例子

```javascript
let amisScoped = amis.embed(
  '#root',
  {
    type: 'page',
    body: {
      type: 'service',
      api: 'service/api'
    }
  },
  {},
  {
    replaceText: {
      service: 'http://localhost'
    },
    replaceTextKeys: ['api']
  }
);
```

它会替换 `api` 里的 `service` 字符串

#### replaceTextIgnoreKeys

> 1.5.0 及以上版本

和前面的 `replaceText` 配合使用，某些字段会禁用文本替换，默认有以下：

```
type, name, mode, target, reload
```

如果发现有字段被意外替换了，可以通过设置这个属性来避免
