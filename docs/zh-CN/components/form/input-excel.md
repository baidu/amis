---
title: InputExcel 解析 Excel
description:
type: 0
group: null
menuName: InputExcel
icon:
order: 14
---

这个组件是通过前端对 Excel 进行解析，将结果作为表单项，使用它有两个好处：

1. 节省后端开发成本，无需再次解析 Excel
2. 可以前端实时预览效果，比如配合 input-table 组件进行二次修改

## 基本使用

默认情况下只解析第一个 sheet 的内容，下面的例子中，选择上传文件后，就能知道最终会解析成什么数据

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-excel",
            "name": "excel",
            "label": "上传 Excel"
        }
    ]
}
```

默认模式是解析成对象数组，将第一行作为对象里的键，可以上传一个类似这样的 Excel 内容试试

```
|名称|网址|
|amis|https://baidu.gitee.io/amis|
|百度|https://www.baidu.com|
```

解析后的的数据格式将会是

```json
[
  {
    "名称": "amis",
    "网址": "https://baidu.gitee.io/amis"
  },
  {
    "名称": "百度",
    "网址": "https://www.baidu.com"
  }
]
```

可以配合 `input-table` 来实现上传后二次编辑

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
          "type": "input-excel",
          "name": "excel",
          "label": "上传 Excel"
        },
        {
          "type": "input-table",
          "name": "excel",
          "visibleOn": "data.excel",
          "columns": [
            {
              "name": "名称",
              "label": "名称",
              "type": "input-text"
            },
            {
              "name": "网址",
              "label": "网址",
              "type": "input-text"
            }
          ]
        }
    ]
}
```

需要保证 `input-table` 的 `name` 和 `input-excel` 一致，同时 `columns` 中的 `name` 也需要和 Excel 的列名一致。

## 二维数组模式

除了默认配置的对象数组格式，还可以使用二维数组方式，方法是设置 `"parseMode": "array"`

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-excel",
            "name": "excel",
            "parseMode": "array",
            "label": "上传 Excel"
        }
    ]
}
```

如果是前面的例子，解析结果将会是

```json
[
  ["名称", "网址"],
  ["amis", "https://baidu.gitee.io/amis"],
  ["百度", "https://www.baidu.com"]
]
```

## 解析多个 sheet

默认配置只解析第一个 sheet，如果要解析多个 sheet，可以通过 `"allSheets": true` 开启多个 sheet 的读取，这时的数据会增加一个层级。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-excel",
            "name": "excel",
            "allSheets": true,
            "label": "上传 Excel"
        }
    ]
}
```

如果按之前的例子，结果将会是

```json
[
  {
    "sheetName": "Sheet1",
    "data": [
      {
        "名称": "amis",
        "网址": "https://baidu.gitee.io/amis"
      },
      {
        "名称": "百度",
        "网址": "https://www.baidu.com"
      }
    ]
  }
]
```

## 富文本模式

默认情况下 Excel 内容将会解析为纯文本，如果要使用富文本格式，可以通过 `plainText` 属性控制

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-excel",
            "name": "excel",
            "plainText": false,
            "label": "上传 Excel"
        }
    ]
}
```

开启这个模式后，对于富文本的内容会解析成对象的形式，有以下几种

- 富文本，内容放在 richText 属性下

  ```
  {
    "richText": [
      {text: 'This is '},
      {font: {italic: true}, text: 'italic'}
    ]
  }
  ```

- 出错

  ```
  { error: '#N/A' }
  ```

- 公式

  ```
  { formula: 'A1+A2', result: 7 };
  ```

- 超链接

  ```
  {
    text: 'www.mylink.com',
    hyperlink: 'http://www.mylink.com',
    tooltip: 'www.mylink.com'
  }
  ```

## 属性表

| 属性名       | 类型                    | 默认值   | 说明               |
| ------------ | ----------------------- | -------- | ------------------ |
| allSheets    | `boolean`               | false    | 是否解析所有 sheet |
| parseMode    | `'array'` 或 `'object'` | 'object' | 解析模式           |
| includeEmpty | `boolean`               | true     | 是否包含空值       |
| plainText    | `boolean`               | true     | 是否解析为纯文本   |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.3.0 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性。

| 事件名称 | 事件参数                                               | 说明                     |
| -------- | ------------------------------------------------------ | ------------------------ |
| change   | `[name]: Array<object>` 组件的值（excel 解析后的数据） | excel 上传解析完成后触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                                       | 说明                                                   |
| -------- | ---------------------------------------------- | ------------------------------------------------------ |
| clear    | -                                              | 清空                                                   |
| reset    | -                                              | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| setValue | `value: Array<object>` 更新的 excel 解析后数据 | 更新数据                                               |
