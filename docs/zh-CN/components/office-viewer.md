---
title: Office Viewer
description:
type: 0
group: ⚙ 组件
menuName: OfficeViewer 文档渲染
icon:
order: 23
---

用于渲染 office 文档，目前只支持 docx 格式

## 基本用法

```schema: scope="body"
{
  "type": "office-viewer",
  "src": "../../../examples/static/exmple.docx",
  "display": false,
  "wordOptions": {
    "padding": "8px"
  }
}
```

## 渲染配置项

目前只支持 Word 文档，所以只有 word 的配置项，放在 `wordOptions` 下

### word 渲染配置属性表

```json
{
  "type": "office-viewer",
  "wordOptions": {
    "padding": "8px",
    "classPrefix": "docx"
  }
}
```

| 属性名            | 类型      | 默认值        | 说明                                       |
| ----------------- | --------- | ------------- | ------------------------------------------ |
| classPrefix       | `string`  | 'docx-viewer' | 渲染的 class 类前缀                        |
| bulletUseFont     | `boolean` | true          | 列表使用字体渲染，请参考下面的乱码说明     |
| fontMapping       | `object`  |               | 字体映射，是个键值对，用于替换文档中的字体 |
| forceLineHeight   | `string`  |               | 设置段落行高，忽略文档中的设置             |
| padding           | `string`  |               | 设置页面间距，忽略文档中的设置             |
| enableReplaceText | `boolean` | true          | 是否开启变量替换功能                       |

## 列表符号出现乱码问题

默认情况下列表左侧的符号使用字体渲染，这样能做到最接近 Word 渲染效果，但如果用户的系统中没有这些字体就会显示乱码，为了解决这个问题需要手动在 amis 渲染的页面里导入对应的字体，比如

```
<style>
  @font-face {
    font-family: Wingdings;
    src: url(./static/font/wingding.ttf);
  }

  @font-face {
    font-family: Symbol;
    src: url(./static/font/symbol.ttf);
  }
</style>
```

目前已知会有 `Wingdings` 和 `Symbol` 两个字体，可能还有别的

如果不想嵌入这两个字体，就只能在前面的 `wordOptions` 里设置 `bulletUseFont: false`。

## 变量替换

文档可以预先定义变量，通过配置 `enableVar` 来开启这个功能，在实际渲染时根据上下文数据来渲染变量，比如

```schema: scope="body"
{
  "type": "form",
  "title": "",
  "mode": "inline",
  "wrapWithPanel": false,
  "body": [
    {
      "type": "input-text",
      "name": "name",
      "value": "amis",
      "label": "姓名"
    },
    {
      "type": "input-email",
      "name": "email",
      "label": "邮箱"
    },
    {
      "type": "input-text",
      "name": "phone",
      "label": "手机号"
    },
    {
      "type": "office-viewer",
      "id": "office-viewer",
      "src": "../../../examples/static/info.docx",
      "wordOptions": {
        "enableVar": true,
        "padding": "8px"
      }
    }
  ]
}
```

如果关闭将显示原始文档

```schema: scope="body"
{
  "type": "office-viewer",
  "id": "office-viewer",
  "src": "../../../examples/static/info.docx",
  "wordOptions": {
    "padding": "8px"
  }
}
```

### 变量详细说明

目前变量使用的写法是 `{{name}}`，其中 `name` 代表变量名，另外这里可以是 amis 表达式，比如前面示例的 `{{DATETOSTR(TODAY(), 'YYYY-MM-DD')}}`

> 为了避免 Word 自作主张添加额外标签，对于复杂的变量建议先在记事本之类的纯文本编辑器里编辑，再粘贴进 Word 里。

## 不渲染模式

通过配置 `display: false` 可以让文档不渲染，虽然不渲染，但还是可以使用后面的下载及打印功能

## 下载文档

下载功能需要配合事件动作来使用

```schema: scope="body"
[
  {
    "type": "action",
    "label": "下载文档",
    "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "saveAs",
              "componentId": "office-viewer"
            }
          ]
        }
      }
  },
  {
    "type": "office-viewer",
    "id": "office-viewer",
    "display": false,
    "src": "../../../examples/static/exmple.docx"
  }
]
```

## 打印文档

```schema: scope="body"
[
  {
    "type": "action",
    "label": "打印",
    "onEvent": {
        "click": {
          "actions": [
            {
              "actionType": "print",
              "componentId": "office-viewer"
            }
          ]
        }
      }
  },
  {
    "type": "office-viewer",
    "id": "office-viewer",
    "display": false,
    "src": "../../../examples/static/exmple.docx"
  }
]
```

## 属性表

| 属性名            | 类型    | 默认值 | 说明     |
| ----------------- | ------- | ------ | -------- |
| src               | Api     |        | 文档地址 |
| enableReplaceText | boolean |        | 文档地址 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置               | 说明     |
| -------- | ---------------------- | -------- |
| saveAs   | `name?: string` 文件名 | 下载文档 |
| print    | -                      | 打印文档 |
