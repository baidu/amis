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
