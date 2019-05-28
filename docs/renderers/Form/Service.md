### Service(FormItem)

目前看到的配置方式都是静态配置，如果你想动态配置，即配置项由接口决定，那么就使用此渲染器。

-   `type` 请设置成 `service`。
-   `api` 数据接口
-   `initFetch` 初始是否拉取
-   `schemaApi` 配置接口，即由接口返回内容区的配置信息。
    正常期待返回是一个渲染器的配置如：

    ```json
    {
        "type": "tpl",
        "tpl": "这是内容。"
    }
    ```

    但是，由于是在 form 里面，支持返回

    ```json
    {
        "controls": [
            // 表单项配置
        ]
    }
    ```

-   `initFetchSchema` 是否初始拉取配置接口。
-   `name` 取个名字方便别的组件与之交互。比如某个按钮的 target 设置成次 name, 则会触发重新拉取。
-   `body` 内容容器，如果配置 schemaApi 则不需要配置，否则不配置的话，就没有内容展现。

```schema:height="300" scope="form"
[
  {
    "name": "tpl",
    "type": "select",
    "label": "模板",
    "inline": true,
    "required": true,
    "value": "tpl1",
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
    "type": "service",
    "className": "m-t",
    "initFetchSchemaOn": "data.tpl",
    "schemaApi": "/api/mock2/service/form?tpl=$tpl"
  }
]
```
