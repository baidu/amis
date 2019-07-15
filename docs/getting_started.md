---
title: 快速开始
---

这是一个基于 React 框架的页面渲染器，有配置就能生成页面，配置是什么样的？请前往[基本用法](./basic.md)阅读。知道怎么配置后，就可以用以下方式用于自己的项目了。

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
  * `session` 默认为 'global'，决定 store 是否为全局共用的，如果想单占一个 store，请设置不同的值。
  * `fetcher` 用来实现 ajax 发送。
  * `isCancel` 判断 ajax 异常是否为一个 cancel 请求。
  * `notify` 用来实现消息提示。
  * `alert` 用来实现警告提示。
  * `confirm` 用来实现确认框。
  * `copy` 用来实现，内容复制。
  * `getModalContainer` 用来决定弹框容器。
  * `loadRenderer` 可以通过它加载自定义组件。
  * `affixOffsetTop` 固顶间距，当你的有其他固顶元素时，需要设置一定的偏移量，否则会重叠。
  * `affixOffsetBottom` 固底间距，当你的有其他固底元素时，需要设置一定的偏移量，否则会重叠。
  * `richTextToken` 内置 rich-text 为 frolaEditor，想要使用，请自行购买，或者自己实现 rich-text 渲染器。