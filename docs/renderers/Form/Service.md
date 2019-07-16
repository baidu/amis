### Service(FormItem)

请先参考Form外的[Service](../Service.md)用法。作为 FormItem 使用时最大的不同在于作为容器渲染器，他的孩子是优先用表单项还是非表单项。比如放置一个 `{type: 'text'}`，是渲染一个文本输入框、还是一个文本展示？

两种都存在可能，所以作为表单项的 Service, 有两种用法，当把孩子节点放在 `controls` 里面时输出表单项，如果放在 `body` 底下时输出非表单项。

```schema:height="200" scope="form-item"
{
    "type": "service",
    "api": "/api/mock2/page/initData",
    "body": {
        "type": "text",
        "text": "现在是：${date}"
    }
}
```

如果把子节点放在 `controls` 就输出表单项如：

```schema:height="500" scope="form-item"
{
    "type": "service",
    "api": "/api/mock2/page/initData",
    "controls": [
      {
          "type": "text",
          "label": "文本输入",
          "name": "a"
      },

      {
        "type": "date",
        "label": "日期",
        "name": "date",
        "format": "YYYY-MM-DD"
      }
    ]
}
```

从上面的栗子还可以发现，表单项的值是由 service 的 api 拉取过来的，也就是说，你可以利用 service 实现动态拉取部分表单项数据。

比如：

```schema:height="500" scope="form"
[
  {
    "label": "数据模板",
    "type": "select",
    "labelClassName": "text-muted",
    "name": "tpl",
    "value": "tpl1",
    "inline": true,
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
    "description": "<span class=\"text-danger\">请修改这里看效果</span>"
  },
  {
    "type": "service",
    "api": "/api/mock2/form/initData?tpl=${tpl}",
    "controls": [
      {
        "label": "名称",
        "type": "text",
        "labelClassName": "text-muted",
        "name": "name"
      },
      {
        "label": "作者",
        "type": "text",
        "labelClassName": "text-muted",
        "name": "author"
      },
      {
        "label": "请求时间",
        "type": "datetime",
        "labelClassName": "text-muted",
        "name": "date"
      }
    ]
  }
]
```

注意：为什么修改数据模板的时候会自动让下面的 service 重新拉取数据？因为 service 的 api 是 `/api/mock2/form/initData?tpl=${tpl}`，amis 有个机制就是，当 api 地址值发生变化时就会重新拉取，当修改数据模板的时候，form 底下 tpl 变量会发生改变，然后会导致 api 的计算结果发生变化，然后会让 service 重新拉取。 那怎样不自动拉取？换种写法就行，比如把上面的 api 换成 `{method: "get", url: "/api/mock2/form/initData", data: {tpl: "${tpl}"}}` 这种写法就不会自动刷新了，因为 `/api/mock2/form/initData` 是一个不会发生变化的值了。更多内容请查看[联动说明](../../advanced.md#数据联动)

有时候自动拉取触发会比较频繁，所以有时候需要用到手动刷新，注意看以下的配置。

```schema:height="500" scope="form"
[
  {
    "label": "数据模板",
    "type": "group",
    "labelClassName": "text-muted",
    "controls": [
      {
        "type": "select",
        "name": "tpl",
        "value": "tpl1",
        "mode": "inline",
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
        ]
      },
      {
        "type": "button",
        "label": "获取",
        "mode": "inline",
        "className": "p-l-none",
        "actionType": "reload",
        "target": "servcieName"
      }
    ]
  },
  {
    "type": "service",
    "name": "servcieName",
    "api": {
      "method": "get",
      "url": "/api/mock2/form/initData",
      "data": {
        "tpl": "${tpl}"
      }
    },
    "controls": [
      {
        "label": "名称",
        "type": "text",
        "labelClassName": "text-muted",
        "name": "name"
      },
      {
        "label": "作者",
        "type": "text",
        "labelClassName": "text-muted",
        "name": "author"
      },
      {
        "label": "请求时间",
        "type": "datetime",
        "labelClassName": "text-muted",
        "name": "date"
      }
    ]
  }
]
```

以上的栗子都是数据拉取，接下来要介绍 service 的另外一个重要功能，就是用它来拉取动态配置项。

```schema:height="200" scope="form-item"
{
  "type": "service",
  "schemaApi": "/api/mock2/service/schema?type=tabs"
}
```

你会发现上面的栗子其实并不是拉取的表单项，如果想直接渲染表单项，请返回这种格式

```js
{
  status: 0,
  msg: '',
  data: {
    controls: [
      {
        type: "text",
        name: "a",
        label: "文本输入"
      }
    ]
  }
}
```

比如


```schema:height="400" scope="form-item"
{
  "type": "service",
  "schemaApi": "/api/mock2/service/schema?type=controls"
}
```

`schemaApi` 同样支持上面的联动用法。
