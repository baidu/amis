---
title: 快速开始
description:
---

amis 有两种使用方法：

- [JS SDK](#SDK)
- [npm](#npm)

npm 适合用在 React 项目中，可以完整使用 amis 的所有功能，方便扩展。

SDK 适合对前端或 React 不了解的开发者，它不依赖 npm 及 webpack，直接引入代码就能使用，但需要注意这种方式难以支持 [自定义组件](./custom)，只能使用 amis 内置的组件。

## SDK

JSSDK 版本可以在 github 的 [releases](https://github.com/baidu/amis/releases) 或 gitee 的[发布](https://gitee.com/baidu/amis/releases)页面下载，文件是 sdk.tar.gz。

或者可以使用 `npm i amis` 来下载，在 `node_modules\amis\sdk` 目录里就能找到。

新建一个 html 文件，简单示例如下，将其中的 `sdk.css` 和 `sdk.js` 改成实际的路径:

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
        let amisScoped = amis.embed('#root', {
          type: 'page',
          title: '表单页面',
          body: {
            type: 'form',
            mode: 'horizontal',
            api: '/saveForm',
            controls: [
              {
                label: 'Name',
                type: 'text',
                name: 'name'
              },
              {
                label: 'Email',
                type: 'email',
                name: 'email'
              }
            ]
          }
        });
      })();
    </script>
  </body>
</html>
```

### 控制 amis 的行为

`amis.embed` 函数还支持以下配置项来控制 amis 的行为，比如在 fetcher 的时候加入自己的处理逻辑，这些函数参数的说明在前面也有介绍。

```js
let amisScoped = amis.embed(
  '#root',
  {
    type: 'page',
    title: 'amis demo',
    body: 'This is a simple amis page.'
  },
  {
    // props 一般不用传。
  },
  {
    fetcher: (url, method, data, config) => {
      // 可以不传，用来实现 ajax 请求
    },

    // 全局 api 适配器。
    // api 自己也可以配置适配器，这里最好只处理通用逻辑。
    responseAdpater(api, response, query, request) {
      debugger;
      return response;
    },

    jumpTo: location => {
      // 可以不传，用来实现页面跳转
    },

    updateLocation: (location, replace) => {
      // 可以不传，用来实现地址栏更新
    },

    isCurrentUrl: url => {
      // 可以不传，用来判断是否目标地址当前地址。
    },

    copy: content => {
      // 可以不传，用来实现复制到剪切板
    },

    notify: (type, msg) => {
      // 可以不传，用来实现通知
    },

    alert: content => {
      // 可以不传，用来实现提示
    },

    confirm: content => {
      // 可以不传，用来实现确认框。
    }
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
    "controls": [
      {
        "label": "Name",
        "type": "text",
        "name": "name1"
      }
    ]
  }
}
```

可以通过 `amisScoped.getComponentByName('page1.form1').getValues()` 来获取到所有表单的值，需要注意 page 和 form 都需要有 name 属性。

## npm

### 安装

```
npm i amis
```

### 主题样式

目前支持三种主题：`default（默认主题）`、`cxd（云舍）`和`dark（暗黑）`

1. 引入样式文件：

html 中引入：

```html
<link href="./node_modules/amis/lib/themes/default.css" />
<!-- 或 <link href="./node_modules/amis/lib/themes/cxd.css" /> -->
<!-- 或 <link href="./node_modules/amis/lib/themes/dark.css" /> -->
```

js 中引入：

```js
import './node_modules/amis/lib/themes/default.css';
// 或 import './node_modules/amis/lib/themes/cxd.css';
// 或 import './node_modules/amis/lib/themes/dark.css';
```

> 上面只是示例，请根据自己的项目结构调整引用路径

2. 渲染器使用配置主题

```js
renderAmis(
  {
    type: 'page',
    title: '简单页面',
    body: '内容'
  },
  {},
  {
    // env...
    theme: 'default' // cxd 或 dark
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

import {render as renderAmis} from 'amis';
import {alert, confirm} from 'amis/lib/components/Alert';
import {toast} from 'amis/lib/components/Toast';

class MyComponent extends React.Component<any, any> {
  render() {
    return (
      <div>
        <p>通过 amis 渲染页面</p>
        {renderAmis(
          {
            // 这里是 amis 的 Json 配置。
            type: 'page',
            title: '简单页面',
            body: '内容'
          },
          {
            // props...
          },
          {
            // env
            // 这些是 amis 需要的一些接口实现
            // 可以参考后面的参数介绍。

            jumpTo: (
              location: string /*目标地址*/,
              action: any /* action对象*/
            ) => {
              // 用来实现页面跳转, actionType:link、url 都会进来。
              // 因为不清楚所在环境中是否使用了 spa 模式，所以自己实现这个方法吧。
            },

            updateLocation: (
              location: string /*目标地址*/,
              replace: boolean /*是replace，还是push？*/
            ) => {
              // 地址替换，跟 jumpTo 类似
            },

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
            notify: (
              type: 'error' | 'success' /**/,
              msg: string /*提示内容*/
            ) => {
              toast[type]
                ? toast[type](msg, type === 'error' ? '系统错误' : '系统消息')
                : console.warn('[Notify]', type, msg);
            },
            alert,
            confirm,
            copy: content => {
              copy(content);
              toast.success('内容已复制到粘贴板');
            }
          }
        )}
      </div>
    );
  }
}
```

### render 函数介绍

```js
(schema, props, env) => JSX.Element;
```

#### schema

即页面配置，请前往 [配置与组件](../concepts/schema) 了解

#### props

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

#### env

环境变量，可以理解为这个渲染器工具的配置项，需要使用 amis 用户实现部分接口。他有下面若干参数：

##### fetcher（必须实现）

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

##### notify

```ts
(type: string, msg: string) => void
```

用来实现消息提示。

##### alert

```ts
(msg: string) => void
```

用来实现警告提示。

##### confirm

```ts
(msg: string) => boolean | Promise<boolean>
```

用来实现确认框。返回 boolean 值

##### jumpTo

```ts
(to: string, action?: Action, ctx?: object) => void
```

用来实现页面跳转，因为不清楚所在环境中是否使用了 spa 模式，所以用户自己实现吧。

##### updateLocation

```ts
(location: any, replace?: boolean) => void
```

地址替换，跟 jumpTo 类似。

##### theme: string

目前支持是三种主题：`default`、`cxd` 和 `dark`

##### isCurrentUrl

```ts
(link: string) => boolean;
```

判断目标地址是否为当前页面。

##### copy

```ts
(contents: string, options?: {shutup: boolean})
```

用来实现内容复制。

##### session

默认为 'global'，决定 store 是否为全局共用的，如果想单占一个 store，请设置不同的值。

##### getModalContainer

```ts
() => HTMLElement;
```

用来决定弹框容器。

##### loadRenderer

```ts
(schema: any, path: string) => Promise<Function>
```

可以通过它懒加载自定义组件，比如： https://github.com/baidu/amis/blob/master/__tests__/factory.test.tsx#L64-L91。

##### affixOffsetTop: number

固顶间距，当你的有其他固顶元素时，需要设置一定的偏移量，否则会重叠。

##### affixOffsetBottom: number

固底间距，当你的有其他固底元素时，需要设置一定的偏移量，否则会重叠。

##### richTextToken: string

内置 rich-text 为 frolaEditor，想要使用，请自行购买，或者用免费的 Tinymce，不设置 token 默认就是 Tinymce。
