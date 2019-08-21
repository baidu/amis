---
title: 快速开始
---

这是一个基于 React 框架的页面渲染器，有配置就能生成页面，配置是什么样的？请前往[基本用法](./basic.md)阅读。知道怎么配置后，就可以用以下方式用于自己的项目了。

如果你不会 React 也没关系可以看看 [JSSDK 用法](#JSSDK)。

## 安装依赖

直接通过 npm 安装即可。

```
npm i amis
```

## 如何使用？

可以在 React Component 这么使用。

```tsx
import * as React from 'react';
import {
    render as renderAmis
} from 'amis';

class MyComponent extends React.Component<any, any> {
    render() {
        return (
            <div>
                <p>通过 amis 渲染页面</p>
                {renderAmis({
                    // schema
                    // 这里是 amis 的 Json 配置。
                    type: 'page',
                    title: '简单页面',
                    body: '内容'
                }, {
                    // props
                }, {
                    // env
                    // 这些是 amis 需要的一些接口实现
                    // 可以参考本项目里面的 Demo 部分代码。

                    updateLocation: (location:string/*目标地址*/, replace:boolean/*是replace，还是push？*/) => {
                        // 用来更新地址栏
                    },

                    jumpTo: (location:string/*目标地址*/) => {
                        // 页面跳转， actionType:  link、url 都会进来。
                    },

                    fetcher: ({
                        url,
                        method,
                        data,
                        config
                    }:{
                        url:string/*目标地址*/,
                        method:'get' | 'post' | 'put' | 'delete'/*发送方式*/,
                        data: object | void/*数据*/,
                        config: object/*其他配置*/
                    }) => {
                        // 用来发送 Ajax 请求，建议使用 axios
                    },
                    notify: (type:'error'|'success'/**/, msg:string/*提示内容*/) => {
                        // 用来提示用户
                    },
                    alert: (content:string/*提示信息*/) => {
                        // 另外一种提示，可以直接用系统框
                    },
                    confirm: (content:string/*提示信息*/) => {
                        // 确认框。
                    }
                });}
            </div>
        );
    }
}
```

`(schema:Schema, props?:any, env?: any) => JSX.Element`

参数说明：

* `schema` 即页面配置，请前往[基本用法](./basic.md)了解.
* `props` 一般都用不上，如果你想传递一些数据给渲染器内部使用，可以传递 data 数据进去。如：

  ```jsx
  () => renderAmis(schema, {
    data: {
      username: 'amis'
    }
  })
  ```

  这样，内部所有组件都能拿到 `username` 这个变量的值。
* `env` 环境变量，可以理解为这个渲染器工具的配置项，需要调用者实现部分接口。
  * `session: string` 默认为 'global'，决定 store 是否为全局共用的，如果想单占一个 store，请设置不同的值。
  * `fetcher: (config: fetcherConfig) => Promise<fetcherResult>` 用来实现 ajax 发送。

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
  * `isCancel: (e:error) => boolean` 判断 ajax 异常是否为一个 cancel 请求。

    示例

    ```js
    isCancel: (value: any) => (axios as any).isCancel(value)
    ```
  * `notify: (type:string, msg: string) => void` 用来实现消息提示。
  * `alert: (msg:string) => void` 用来实现警告提示。
  * `confirm: (msg:string) => boolean | Promise<boolean>` 用来实现确认框。
  * `jumpTo: (to:string, action?: Action, ctx?: object) => void` 用来实现页面跳转，因为不清楚所在环境中是否使用了 spa 模式，所以用户自己实现吧。
  * `updateLocation: (location:any, replace?:boolean) => void` 地址替换，跟 jumpTo 类似。
  * `isCurrentUrl: (link:string) => boolean` 判断目标地址是否为当前页面。
  * `theme: 'default' | 'cxd'` 目前支持两种主题。 
  * `copy: (contents:string, options?: {shutup: boolean}) => void` 用来实现，内容复制。
  * `getModalContainer: () => HTMLElement` 用来决定弹框容器。
  * `loadRenderer: (chema:any, path:string) => Promise<Function>` 可以通过它懒加载自定义组件，比如： https://github.com/baidu/amis/blob/master/__tests__/factory.test.tsx#L64-L91。
  * `affixOffsetTop: number` 固顶间距，当你的有其他固顶元素时，需要设置一定的偏移量，否则会重叠。
  * `affixOffsetBottom: number` 固底间距，当你的有其他固底元素时，需要设置一定的偏移量，否则会重叠。
  * `richTextToken: string` 内置 rich-text 为 frolaEditor，想要使用，请自行购买，或者自己实现 rich-text 渲染器。

## JSSDK

如果你没有组件定制需求直接使用，而且不想折腾 React 相关的，我建议你直接用这种方式。

首先请引用一下 CSS 和 JS。

* JS 地址： https://houtai.baidu.com/v2/jssdk
* CSS 地址： https://houtai.baidu.com/v2/csssdk

然后执行以下代码就能渲染了。

```js
(function() {
    var amis = amisRequire('amis/embed');
    amis.embed('#container', {
        type: 'page',
        title: 'AMIS Demo',
        body: 'This is a simple amis page.'
    }, {
        // props 一般不用传。
    }, {
        // env
        fetcher: () => {
            // 可以不传，用来实现 ajax 请求
        },

        jumpTo: () => {
            // 可以不传，用来实现页面跳转
        },

        updateLocation: () => {
            // 可以不传，用来实现地址栏更新
        },

        isCurrentUrl: () => {
            // 可以不传，用来判断是否目标地址当前地址。
        },

        copy: () => {
            // 可以不传，用来实现复制到剪切板
        },

        notify: () => {
            // 可以不传，用来实现通知
        },

        alert: () => {
            // 可以不传，用来实现提示
        },

        confirm: () => {
            // 可以不传，用来实现确认框。
        }
    });
})();
```

注意：以上的 SDK 地址是一个页面跳转，会跳转到一个 CDN 地址，而且每次跳转都是最新的版本，随着 amis 的升级这个地址会一直变动，如果你的页面已经完成功能回归，请直接使用某个固定地址，这样才不会因为 amis 升级而导致你的页面不可用。

另外，sdk 代码也伴随 npm 一起发布了，不使用 CDN 版本，直接替换成npm包里面的 `amis/sdk/sdk.js` 和 `amis/sdk/sdk.css` 即可。

示例:

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>AMIS Demo</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <link rel="stylesheet" 
        href="https://houtai.baidu.com/v2/csssdk">
    <style>
        html, body, .app-wrapper {
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
    <script src="https://houtai.baidu.com/v2/jssdk"></script>
    <script type="text/javascript">
    (function() {
        var amis = amisRequire('amis/embed');
        amis.embed('#root', {
            type: 'page',
            title: 'AMIS Demo',
            body: 'hello world'
        });
    })();
    </script>
</body>
</html>
```

