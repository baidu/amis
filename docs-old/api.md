---
title: 动态数据
---

除了渲染静态页面及表单，amis 还能渲染动态数据，比如下面这个表格数据是来自 api 这个接口的请求

```json
{
  "type": "crud",
  "api": " http://xxx/api/sample",
  "columns": [
    {
      "name": "engine",
      "label": "引擎"
    },
    {
      "name": "browser",
      "label": "浏览器"
    }
  ]
}
```

amis 期望这个 api 接口返回的是如下的格式：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "items": [
      {
        "engine": "Trident",
        "browser": "IE 9"
      },
      {
        "engine": "Gecko",
        "browser": "Firefox 70"
      }
    ]
  }
}
```

下面是具体介绍

### 整体格式

要求每个接口都返回 `status` 字段用来表示成功还是失败，如果失败了，通过 `msg` 字段来说明失败原因。当然如果成功 `msg` 也可以用来设置提示信息。

```json
{
  "status": 0, // 0 表示成功，非0 表示失败
  "msg": "", // 提示信息 包括失败和成功
  "data": {
    // ...
    // 具体的数据
  }
}
```

如果你的系统有自己的规范，可以在 fetcher 统一进行适配，如：

```js
{
  renderAmis(
    {
      // 这里是 amis 的 Json 配置。
      type: 'page',
      title: '简单页面',
      body: '内容'
    },
    {
      // props
    },
    {
      // 忽略别的设置项
      fetcher: function (api) {
        // 适配这种格式 {"code": 0, "message": "", "result": {}}
        return axios(config).then(response => {
          let payload = {
            status: response.data.code,
            msg: response.data.message,
            data: response.data.result
          };

          return {
            ...response,
            data: payload
          };
        });
      }
    }
  );
}
```

### 具体要求

每个渲染的接口返回都有自己的格式要求，主要体现在 data 字段内部，具体请参考每个渲染的接口说明。

- [Page](./renderers/Page.md#接口说明)
- [CRUD](./renderers/CRUD.md#接口说明)
- [Form](./renderers/Form/Form.md#接口说明)
  - [Select](./renderers/Form/Select.md#接口说明)
  - [Checkboxes](./renderers/Form/Checkboxes.md#接口说明)
  - [Radios](./renderers/Form/Radios.md#接口说明)
  - [List](./renderers/Form/List.md#接口说明)
- [Wizard](./renderers/Wizard.md#接口说明)

`TBD`
