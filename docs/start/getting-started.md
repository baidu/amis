---
title: 快速开始
description:
---

amis 有两种使用方法：

- [npm](#npm)
- [JS SDK](#SDK)

npm 适合用在 React 项目中，可以完整使用 amis 的所有功能，方便扩展。

SDK 适合对前端或 React 不了解的开发者，它不依赖 npm 及 webpack，直接引入代码就能使用，但需要注意这种方式难以支持 [自定义组件](./custom)，只能使用 amis 内置的组件。

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

### 使用

可以在 React Component 这么使用（TypeScript）。

```tsx
import * as React from 'react';
import {render as renderAmis} from 'amis';

class MyComponent extends React.Component<any, any> {
  render() {
    return (
      <div>
        <p>通过 amis 渲染页面</p>
        {renderAmis(
          {
            // schema
            // 这里是 amis 的 Json 配置。
            type: 'page',
            title: '简单页面',
            body: '内容'
          },
          {
            // props
          },
          {
            // env
            // 这些是 amis 需要的一些接口实现
            // 可以参考后面的参数介绍。

            updateLocation: (
              location: string /*目标地址*/,
              replace: boolean /*是replace，还是push？*/
            ) => {
              // 用来更新地址栏
            },

            jumpTo: (location: string /*目标地址*/) => {
              // 页面跳转， actionType:  link、url 都会进来。
            },

            fetcher: ({
              url,
              method,
              data,
              config
            }: {
              url: string /*目标地址*/;
              method: 'get' | 'post' | 'put' | 'delete' /*发送方式*/;
              data: object | void /*数据*/;
              config: object /*其他配置*/;
            }) => {
              // 用来发送 Ajax 请求，建议使用 axios
            },
            notify: (
              type: 'error' | 'success' /**/,
              msg: string /*提示内容*/
            ) => {
              // 用来提示用户
            },
            alert: (content: string /*提示信息*/) => {
              // 另外一种提示，可以直接用系统框
            },
            confirm: (content: string /*提示信息*/) => {
              // 确认框。
            }
          }
        )}
      </div>
    );
  }
}
```

`(schema:Schema, props?:any, env?: any) => JSX.Element`

参数说明：

- `schema` 即页面配置，请前往 [配置与组件](../concepts/schema) 了解.
- `props` 一般都用不上，如果你想传递一些数据给渲染器内部使用，可以传递 data 数据进去。如：

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

- `env` 环境变量，可以理解为这个渲染器工具的配置项，需要调用者实现部分接口。

  - `session: string` 默认为 'global'，决定 store 是否为全局共用的，如果想单占一个 store，请设置不同的值。
  - `fetcher: (config: fetcherConfig) => Promise<fetcherResult>` 用来实现 ajax 发送。

    示例

    ```js
    fetcher: ({
        url,
        method,
        data,
        responseType,
        config,
        headers
    }: any) => {
        config = config || {};
        config.withCredentials = true;
        responseType && (config.responseType = responseType);

        if (config.cancelExecutor) {
            config.cancelToken = new (axios as any).CancelToken(config.cancelExecutor);
        }

        config.headers = headers || {};

        if (method !== 'post' && method !== 'put' && method !== 'patch') {
            if (data) {
                config.params = data;
            }

            return (axios as any)[method](url, config);
        } else if (data && data instanceof FormData) {
            // config.headers = config.headers || {};
            // config.headers['Content-Type'] = 'multipart/form-data';
        } else if (data
            && typeof data !== 'string'
            && !(data instanceof Blob)
            && !(data instanceof ArrayBuffer)
        ) {
            data = JSON.stringify(data);
            // config.headers = config.headers || {};
            config.headers['Content-Type'] = 'application/json';
        }

        return (axios as any)[method](url, data, config);
    }
    ```

  - `isCancel: (e:error) => boolean` 判断 ajax 异常是否为一个 cancel 请求。

    示例

    ```js
    isCancel: (value: any) => (axios as any).isCancel(value)
    ```

  - `notify: (type:string, msg: string) => void` 用来实现消息提示。
  - `alert: (msg:string) => void` 用来实现警告提示。
  - `confirm: (msg:string) => boolean | Promise<boolean>` 用来实现确认框。
  - `jumpTo: (to:string, action?: Action, ctx?: object) => void` 用来实现页面跳转，因为不清楚所在环境中是否使用了 spa 模式，所以用户自己实现吧。
  - `updateLocation: (location:any, replace?:boolean) => void` 地址替换，跟 jumpTo 类似。
  - `isCurrentUrl: (link:string) => boolean` 判断目标地址是否为当前页面。
  - `theme: 'default' | 'cxd'` 目前支持两种主题。
  - `copy: (contents:string, options?: {shutup: boolean}) => void` 用来实现，内容复制。
  - `getModalContainer: () => HTMLElement` 用来决定弹框容器。
  - `loadRenderer: (chema:any, path:string) => Promise<Function>` 可以通过它懒加载自定义组件，比如： https://github.com/baidu/amis/blob/master/__tests__/factory.test.tsx#L64-L91。
  - `affixOffsetTop: number` 固顶间距，当你的有其他固顶元素时，需要设置一定的偏移量，否则会重叠。
  - `affixOffsetBottom: number` 固底间距，当你的有其他固底元素时，需要设置一定的偏移量，否则会重叠。
  - `richTextToken: string` 内置 rich-text 为 frolaEditor，想要使用，请自行购买，或者自己实现 rich-text 渲染器。

## SDK

JSSDK 的代码从以下地址获取：

- JS： https://houtai.baidu.com/v2/jssdk
- CSS： https://houtai.baidu.com/v2/csssdk

以上的 SDK 地址是一个页面跳转，会跳转到一个 CDN 地址，而且每次跳转都是最新的版本，随着 amis 的升级这个地址会一直变动，需要将这两个文件下载到本地，分别命名为 sdk.js 和 sdk.css，然后类似如下的方式使用:

```html
<!DOCTYPE html>
<html lang="zh">
  <head>
    <meta charset="UTF-8" />
    <title>AMIS Demo</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1"
    />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <link rel="stylesheet" href="amis/sdk.css" />
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
    <script src="amis/sdk.js"></script>
    <script type="text/javascript">
      (function () {
        let amis = amisRequire('amis/embed');
        let amisScoped = amis.embed('#root', {
          type: 'page',
          title: 'AMIS Demo',
          body: 'hello world'
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
    title: 'AMIS Demo',
    body: 'This is a simple amis page.'
  },
  {
    // props 一般不用传。
  },
  {
    fetcher: (url, method, data, config) => {
      // 可以不传，用来实现 ajax 请求
    },

    jumpTo: (location) => {
      // 可以不传，用来实现页面跳转
    },

    updateLocation: (location, replace) => {
      // 可以不传，用来实现地址栏更新
    },

    isCurrentUrl: (url) => {
      // 可以不传，用来判断是否目标地址当前地址。
    },

    copy: (content) => {
      // 可以不传，用来实现复制到剪切板
    },

    notify: (type, msg) => {
      // 可以不传，用来实现通知
    },

    alert: (content) => {
      // 可以不传，用来实现提示
    },

    confirm: (content) => {
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
