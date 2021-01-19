---
title: Service 功能型容器
description:
type: 0
group: ⚙ 组件
menuName: Service
icon:
order: 63
---

amis 中部分组件，作为展示组件，自身没有**使用接口初始化数据域的能力**，例如：[Table](./table)、[Cards](./cards)、[List](./list)等，他们需要使用某些配置项，例如`source`，通过[数据映射](../concepts/data-mapping)功能，在当前的 **数据链** 中获取数据，并进行数据展示。

而`Service`组件就是专门为该类组件而生，它的功能是：：**配置初始化接口，进行数据域的初始化，然后在`Service`内容器中配置子组件，这些子组件通过数据链的方法，获取`Service`所拉取到的数据**

## 基本使用

最基本的使用，是配置初始化接口`api`，将接口返回的数据添加到自身的数据域中，以供子组件通过[数据链](../concepts/datascope-and-datachain#%E6%95%B0%E6%8D%AE%E9%93%BE)进行获取使用。

```schema: scope="body"
{
    "type": "service",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData",
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
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/crud/table?perPage=5",
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
  "schemaApi": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/service/schema?type=tabs"
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

## 接口联动

`api`和`schemaApi`都支持[接口联动](../concepts/linkage#%E6%8E%A5%E5%8F%A3%E8%81%94%E5%8A%A8)

```schema: scope="body"
{
    "title": "",
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock/saveForm?waitSeconds=1",
    "mode": "horizontal",
    "controls": [
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
        "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData?tpl=${tpl}",
        "controls": [
            {
            "label": "名称",
            "type": "text",
            "name": "name"
            },
            {
            "label": "作者",
            "type": "text",
            "name": "author"
            },
            {
            "label": "请求时间",
            "type": "datetime",
            "name": "date"
            }
        ]
        }
    ],
    "actions": []
}
```

上例可看到，变更**数据模板**的值，会触发 service 重新请求，并更新当前数据域中的数据

更多相关见[接口联动](../concepts/linkage#%E6%8E%A5%E5%8F%A3%E8%81%94%E5%8A%A8)

## 属性表

| 属性名                | 类型                              | 默认值         | 说明                                                                          |
| --------------------- | --------------------------------- | -------------- | ----------------------------------------------------------------------------- |
| type                  | `string`                          | `"service"`    | 指定为 service 渲染器                                                         |
| className             | `string`                          |                | 外层 Dom 的类名                                                               |
| body                  | [SchemaNode](../types/schemanode) |                | 内容容器                                                                      |
| api                   | [api](../types/api)               |                | 初始化数据域接口地址                                                          |
| initFetch             | `boolean`                         |                | 是否默认拉取                                                                  |
| schemaApi             | [api](../types/api)               |                | 用来获取远程 Schema 接口地址                                                  |
| initFetchSchema       | `boolean`                         |                | 是否默认拉取 Schema                                                           |
| messages              | `Object`                          |                | 消息提示覆写，默认消息读取的是接口返回的 toast 提示文字，但是在此可以覆写它。 |
| messages.fetchSuccess | `string`                          |                | 接口请求成功时的 toast 提示文字                                               |
| messages.fetchFailed  | `string`                          | `"初始化失败"` | 接口请求失败时 toast 提示文字                                                 |
| interval              | `number`                          |                | 轮询时间间隔(最低 3000)                                                       |
| silentPolling         | `boolean`                         | `false`        | 配置轮询时是否显示加载动画                                                    |
| stopAutoRefreshWhen   | [表达式](../concepts/expression)  |                | 配置停止轮询的条件                                                            |
