---
title: API 说明
---

amis 渲染器的数据都来源于 api，有一定的格式要求。

### 整体要求

要求每个接口都返回 `status` 字段用来表示成功还是失败，如果失败了，通过 `msg` 字段来说明失败原因。当然如果成功 `msg` 也可以用来设置提示信息。


```json
{
    "status": 0,  // 0 表示成功，非0 表示失败
    "msg": "",    // 提示信息 包括失败和成功
    "data": {
        // ...
        // 具体的数据
    }
}
```

如果你的系统有自己的规范，也没关系，fetcher 整体入口那加个适配器就行了如：

```js
{
    fetcher: function(api) {

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
            }
        })
    }
}
```

### 具体要求 

每个渲染的接口返回都有自己的格式要求，主要体现在 data 字段内部，具体请参考每个渲染的接口说明。

* [Page](./renderers/Page.md#接口说明)
* [CRUD](./renderers/CRUD.md#接口说明)
* [Form](./renderers/Form/Form.md#接口说明)
    * [Select](./renderers/Form/Select.md#接口说明)
    * [Checkboxes](./renderers/Form/Checkboxes.md#接口说明)
    * [Radios](./renderers/Form/Radios.md#接口说明)
    * [List](./renderers/Form/List.md#接口说明)
* [Wizard](./renderers/Wizard.md#接口说明)

`TBD`

