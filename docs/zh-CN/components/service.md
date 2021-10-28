---
title: Service 功能型容器
description:
type: 0
group: ⚙ 组件
menuName: Service
icon:
order: 63
---

amis 中部分组件，作为展示组件，自身没有**使用接口初始化数据域的能力**，例如：[Table](./table)、[Cards](./cards)、[List](./list)等，他们需要使用某些配置项，例如`source`，通过[数据映射](../../docs/concepts/data-mapping)功能，在当前的 **数据链** 中获取数据，并进行数据展示。

而`Service`组件就是专门为该类组件而生，它的功能是：：**配置初始化接口，进行数据域的初始化，然后在`Service`内容器中配置子组件，这些子组件通过数据链的方法，获取`Service`所拉取到的数据**

## 基本使用

最基本的使用，是配置初始化接口`api`，将接口返回的数据添加到自身的数据域中，以供子组件通过[数据链](../../docs/concepts/datascope-and-datachain#%E6%95%B0%E6%8D%AE%E9%93%BE)进行获取使用。

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/page/initData",
    "body": {
        "type": "panel",
        "title": "$title",
        "body": "现在是：${date}"
    }
}
```

你可以通过查看网络面板看到，`service`接口返回的数据结构为：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "title": "Test Page Component",
    "date": "2017-10-13"
  }
}
```

在`service`的子组件中，就可以使用`${title}`和`${date}`展示数据

## 展示列表

另外一种使用较为频繁的场景是：serivce + table 进行列表渲染

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/crud/table?perPage=5",
    "body": [
        {
            "type": "table",
            "title": "表格1",
            "source": "$rows",
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine"
                },
                {
                    "name": "version",
                    "label": "Version"
                }
            ]
        },
        {
            "type": "table",
            "source": "$rows",
            "columns": [
                {
                    "name": "engine",
                    "label": "Engine"
                },
                {
                    "name": "version",
                    "label": "Version"
                }
            ]
        }
    ]
}
```

上例中 service 接口返回数据结构如下：

```json
{
  "status": 0,
  "msg": "ok",
  "data": {
    "count": 57,
    "rows": [
      {
        "engine": "Trident",
        "browser": "Internet Explorer 4.0",
        "platform": "Win 95+",
        "version": "4",
        "grade": "X",
        "id": 1
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.0",
        "platform": "Win 95+",
        "version": "5",
        "grade": "C",
        "id": 2
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 5.5",
        "platform": "Win 95+",
        "version": "5.5",
        "grade": "A",
        "id": 3
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 6",
        "platform": "Win 98+",
        "version": "6",
        "grade": "A",
        "id": 4
      },
      {
        "engine": "Trident",
        "browser": "Internet Explorer 7",
        "platform": "Win XP SP2+",
        "version": "7",
        "grade": "A",
        "id": 5
      },
      {
        "engine": "Trident",
        "browser": "AOL browser (AOL desktop)",
        "platform": "Win XP",
        "version": "6",
        "grade": "A",
        "id": 6
      },
      {
        "engine": "Gecko",
        "browser": "Firefox 1.0",
        "platform": "Win 98+ / OSX.2+",
        "version": "1.7",
        "grade": "A",
        "id": 7
      },
      {
        "engine": "Gecko",
        "browser": "Firefox 1.5",
        "platform": "Win 98+ / OSX.2+",
        "version": "1.8",
        "grade": "A",
        "id": 8
      },
      {
        "engine": "Gecko",
        "browser": "Firefox 2.0",
        "platform": "Win 98+ / OSX.2+",
        "version": "1.8",
        "grade": "A",
        "id": 9
      },
      {
        "engine": "Gecko",
        "browser": "Firefox 3.0",
        "platform": "Win 2k+ / OSX.3+",
        "version": "1.9",
        "grade": "A",
        "id": 10
      }
    ]
  }
}
```

`table`中配置`source`属性为`${rows}`就可以获取到`rows`变量的数据，并用于展示。

## 动态渲染页面

`Service` 还有个重要的功能就是支持配置 `schemaApi`，通过它可以实现动态渲染页面内容。

```schema: scope="body"
{
  "type": "service",
  "schemaApi": "/api/mock2/service/schema?type=tabs"
}
```

同样观察`schemaApi接口`返回的数据结构：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "type": "tabs",
    "tabs": [
      {
        "title": "TabA",
        "body": "卡片A内容"
      },
      {
        "title": "TabB",
        "body": "卡片B内容"
      }
    ]
  }
}
```

它将`data`返回的对象作为 amis 页面配置，进行了解析渲染，实现动态渲染页面的功能。

## 动态渲染表单项

默认 Service 可以通过配置`schemaApi` [动态渲染页面内容](../service#%E5%8A%A8%E6%80%81%E6%B8%B2%E6%9F%93%E9%A1%B5%E9%9D%A2)，但是如果想渲染表单项，请返回下面这种格式：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "type": "container",
    "body": [
      {
        "type": "input-text",
        "name": "text",
        "label": "文本输入"
      }
    ]
  }
}
```

例如下例：

```schema: scope="form-item2"
{
  "type": "service",
  "schemaApi": "/api/mock2/service/schema?type=controls"
}
```

`schemaApi` 除了能返回表单项之外，还能同时返回表单数据，如果你这样返回接口

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "data": {
      "a": "b" // 这样返回的选项会选中第二个选项B
    },
    "body": [
      {
        "type": "select",
        "name": "a",
        "label": "选项",
        "options": [
          {"label": "A", "value": "a"},
          {"label": "B", "value": "b"}
        ]
      }
    ]
  }
}
```

## 接口联动

`api`和`schemaApi`都支持[接口联动](../../docs/concepts/linkage#%E6%8E%A5%E5%8F%A3%E8%81%94%E5%8A%A8)

```schema: scope="body"
{
    "title": "",
    "type": "form",
    "api": "/api/mock/saveForm?waitSeconds=1",
    "mode": "horizontal",
    "body": [
        {
        "label": "数据模板",
        "type": "select",
        "name": "tpl",
        "value": "tpl1",
        "size": "sm",
        "options": [
            {
            "label": "模板1",
            "value": "tpl1"
            },
            {
            "label": "模板2",
            "value": "tpl2"
            },
            {
            "label": "模板3",
            "value": "tpl3"
            }
        ],
        "description": "<span class=\"text-danger\">请修改该下拉选择器查看效果</span>"
        },
        {
        "type": "service",
        "api": "/api/mock2/form/initData?tpl=${tpl}",
        "body": [
            {
            "label": "名称",
            "type": "input-text",
            "name": "name"
            },
            {
            "label": "作者",
            "type": "input-text",
            "name": "author"
            },
            {
            "label": "请求时间",
            "type": "input-datetime",
            "name": "date"
            }
        ]
        }
    ],
    "actions": []
}
```

上例可看到，变更**数据模板**的值，会触发 service 重新请求，并更新当前数据域中的数据

更多相关见[接口联动](../../docs/concepts/linkage#%E6%8E%A5%E5%8F%A3%E8%81%94%E5%8A%A8)

## 定时轮询刷新

设置 `interval` 可以定时刷新 api 接口，单位是毫秒，最小间隔是 1 秒。

## 通过 WebSocket 实时获取数据

Service 支持通过 WebSocket 获取数据，只需要设置 ws（由于无示例服务，所以无法在线演示）。

```json
{
  "type": "service",
  "ws": "ws://localhost:8777",
  "body": {
    "type": "panel",
    "title": "$title",
    "body": "随机数：${random}"
  }
}
```

> 1.4.0 及以上版本

或者是对象的方式支持配置初始 `data`，这个 data 会在建立连接时发送初始数据

```json
{
  "type": "service",
  "ws": {
    "url": "ws://localhost:8777?name=${name}",
    "data": {
      "name": "${name}"
    }
  },
  "body": {
    {
      "label": "名称",
      "type": "input-text",
      "value": "name",
      "name": "amis"
    }
  }
}
```

可以只设置 ws，通过 ws 来获取所有数据，也可以同时设置 api 和 ws，让 api 用于获取全部数据，而 ws 用于获取实时更新的数据。

后端实现示例，基于 [ws](https://github.com/websockets/ws)：

```javascript
const WebSocket = require('ws');

const ws = new WebSocket.Server({port: 8777});

ws.on('connection', function connection(ws) {
  setInterval(() => {
    const random = Math.floor(Math.random() * Math.floor(100));
    // 返回给 amis 的数据
    const data = {
      random
    };
    // 发送前需要转成字符串
    ws.send(JSON.stringify(data));
  }, 500);
});
```

WebSocket 客户端的默认实现是使用标准 WebSocket，如果后端使用定制的 WebSocket，比如 socket.io，可以通过覆盖 `env.wsFetcher` 来自己实现数据获取方法，默认实现是：

> 1.4.0 及以上版本修改了 ws 类型，将之前的字符串改成了对象的方式，会有两个参数 url 和 body

```javascript
wsFetcher(ws, onMessage, onError) {
  if (ws) {
    const socket = new WebSocket(ws.url);
    socket.onopen = event => {
      if (ws.body) {
        socket.send(JSON.stringify(ws.body));
      }
    };
    socket.onmessage = event => {
      if (event.data) {
        onMessage(JSON.parse(event.data));
      }
    };
    socket.onerror = onError;
    return {
      close: socket.close
    };
  } else {
    return {
      close: () => {}
    };
  }
}
```

通过 onMessage 来通知 amis 数据修改了，并返回 close 函数来关闭连接。

## 调用外部函数获取数据

> 1.4.0 及以上版本

对于更复杂的数据获取情况，可以使用 `dataProvider` 属性来实现外部函数获取数据，它支持字符串和函数两种形式

```schema: scope="body"
{
    "type": "service",
    "dataProvider": "setData({ now: new Date().toString() })",
    "body": {
        "type": "tpl",
        "tpl": "现在是：${now}"
    }
}
```

函数将会传递两个参数：`data` 和 `setData`，其中 `data` 可以拿到上下文数据，而 `setData` 函数可以用来更新数据，比如下面的例子

```schema: scope="body"
{
    "type": "service",
    "dataProvider": "const timer = setInterval(() => { setData({date: new Date().toString()}) }, 1000); return () => { clearInterval(timer) }",
    "body": {
        "type": "tpl",
        "tpl": "现在是：${date}"
    }
}
```

上面这个例子还返回了一个函数，这个函数会在组件销毁的时候执行，可以用来清理资源。

下面是使用函数类型的示例，注意这个示例不能放在 JSON 中，只能在 jssdk 或 react 项目里使用。

```javascript
{
    "type": "service",
    "func": async (data, setData) => {
      const timer = setInterval(() => {
        setData({date: new Date().toString()})
      }, 1000);
      return () => { clearInterval(timer) }
    },
    "body": {
        "type": "tpl",
        "tpl": "现在是：${now}"
    }
}
```

函数里可以使用 `await` 调用异步方法

## 属性表

| 属性名                | 类型                                      | 默认值         | 说明                                                                          |
| --------------------- | ----------------------------------------- | -------------- | ----------------------------------------------------------------------------- |
| type                  | `string`                                  | `"service"`    | 指定为 service 渲染器                                                         |
| className             | `string`                                  |                | 外层 Dom 的类名                                                               |
| body                  | [SchemaNode](../../docs/types/schemanode) |                | 内容容器                                                                      |
| api                   | [api](../../docs/types/api)               |                | 初始化数据域接口地址                                                          |
| ws                    | `string`                                  |                | WebScocket 地址                                                               |
| dataProvider          | `string`                                  |                | 数据获取函数                                                                  |
| initFetch             | `boolean`                                 |                | 是否默认拉取                                                                  |
| schemaApi             | [api](../../docs/types/api)               |                | 用来获取远程 Schema 接口地址                                                  |
| initFetchSchema       | `boolean`                                 |                | 是否默认拉取 Schema                                                           |
| messages              | `Object`                                  |                | 消息提示覆写，默认消息读取的是接口返回的 toast 提示文字，但是在此可以覆写它。 |
| messages.fetchSuccess | `string`                                  |                | 接口请求成功时的 toast 提示文字                                               |
| messages.fetchFailed  | `string`                                  | `"初始化失败"` | 接口请求失败时 toast 提示文字                                                 |
| interval              | `number`                                  |                | 轮询时间间隔(最低 3000)                                                       |
| silentPolling         | `boolean`                                 | `false`        | 配置轮询时是否显示加载动画                                                    |
| stopAutoRefreshWhen   | [表达式](../../docs/concepts/expression)  |                | 配置停止轮询的条件                                                            |
