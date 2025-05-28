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

> 2.10.0 以上版本支持 xls 文件格式，2.9.0 及以下版本只支持 xlsx

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
          "label": "上传 Excel",
          "placeholder": "请拖拽Excel文件到当前区域"
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
## 解析多个文件
可以配置"multiple": true，来开启多文件解析功能，通过"maxLength": 5，来限制最多上传5个文件。

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
            "label": "上传 Excel",
            "multiple": true,
            "maxLength": 5
        }
    ]
}
```

## 解析图片

> 2.6.0 及以上版本

通过配置 `parseImage` 来支持解析 excel 里的图片

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-excel",
            "name": "excel",
            "parseImage": true,
            "label": "上传 Excel"
        }
    ]
}
```

默认情况下解析结果是 data URI 格式，如果不想要这个前缀可以通过 `"imageDataURI": false` 关闭

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

## 解析文件名称

> `3.5.0`及以上版本

文件解析成功后，可以使用`autoFill`属性，在当前组件所在的数据域中填充值，`input-excel`组件特有的保留字段请查看下方定义，`InputExcelData`中的字段可以用变量获取。通常可以利用这个属性为`input-excel`所在的表单追加文件名称。

```typescript
interface InputExcelData {
  /* 文件名称 */
  filename: string;
}
```

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "debug": true,
    "body": [
        {
            "type": "input-excel",
            "name": "excel",
            "label": "上传 Excel",
            "autoFill": {
              "operator": "amis",
              "time": "${DATETOSTR(NOW(), 'YYYY-MM-DD HH:mm:ss')}",
              "fileName": "${filename}"
            }
        }
    ]
}
```

## 属性表

| 属性名          | 类型                       | 默认值                   | 说明           | 版本       |
|--------------|--------------------------|-----------------------|--------------|----------|
| allSheets    | `boolean`                | false                 | 是否解析所有 sheet |
| parseMode    | `'array'` 或 `'object'`   | 'object'              | 解析模式         |
| includeEmpty | `boolean`                | true                  | 是否包含空值       |
| plainText    | `boolean`                | true                  | 是否解析为纯文本     |
| placeholder  | `string`                 | `"拖拽 Excel 到这，或点击上传"` | 占位文本提示       | `2.8.1`  |
| autoFill     | `Record<string, string>` |                       | 自动填充         | `3.5.0`  |
| multiple     | `boolean`                |                       | 解析多个文件       | `6.13.0` |
| maxLength    | `number`                 |                       | 解析文件最大数      | `6.13.0` |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                                               | 说明                     |
| -------- | ------------------------------------------------------ | ------------------------ |
| change   | `[name]: Array<object>` 组件的值（excel 解析后的数据） | excel 上传解析完成后触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                                       | 说明                                             |
| -------- | ---------------------------------------------- | ------------------------------------------------ |
| clear    | -                                              | 清空                                             |
| reset    | -                                              | 将值重置为初始值。6.3.0 及以下版本为`resetValue` |
| setValue | `value: Array<object>` 更新的 excel 解析后数据 | 更新数据                                         |

### clear

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "type": "input-excel",
            "name": "excel",
            "label": "上传 Excel",
            "id": "clear_text"
        },
        {
            "type": "button",
            "label": "清空",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "clear",
                            "componentId": "clear_text"
                        }
                    ]
                }
            }
        }
    ]
}
```

### reset

如果配置了`resetValue`，则重置时使用`resetValue`的值，否则使用初始值。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "type": "input-excel",
            "name": "excel",
            "label": "上传 Excel",
            "id": "reset_text",
            "value": [
              {
                "ID": "1",
                "NAME": "amis"
              }
            ]
        },
        {
            "type": "button",
            "label": "重置",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "reset",
                            "componentId": "reset_text"
                        }
                    ]
                }
            }
        }
    ]
}
```

### setValue

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "body": [
        {
            "type": "input-excel",
            "name": "excel",
            "label": "上传 Excel",
            "id": "setvalue_text"
        },
        {
            "type": "button",
            "label": "赋值",
            "onEvent": {
                "click": {
                    "actions": [
                        {
                            "actionType": "setValue",
                            "componentId": "setvalue_text",
                            "args": {
                                "value": [
                                  {
                                    "ID": "1",
                                    "NAME": "amis"
                                  }
                                ]
                            }
                        }
                    ]
                }
            }
        }
    ]
}
```
