---
title: InputRichText 富文本编辑器
description:
type: 0
group: null
menuName: InputRichText
icon:
order: 47
---

目前富文本编辑器基于两个库：[froala](https://froala.com/) 和 [tinymce](https://github.com/tinymce/tinymce)，默认使用 tinymce。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-rich-text",
            "name": "rich",
            "label": "Rich Text"
        }
    ]
}
```

## 图片上传

通过设置 `receiver` 来支持文件上传，如果是 tinymce，它会将图片放在 `file` 字段中

> 1.6.1 及以上版本可以通过 fileField 字段修改

它的返回值类似如下：

```json
{
  "link": "https://xxx.png"
}
```

也可以是

```json
{
  "status": 0,
  "data": {
    "link": "https://xxx.png"
  }
}
```

下面是个示例，但不会真正上传，每次都返回同一张图片

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "input-rich-text",
            "receiver": "/api/mock2/sample/mirror?json={%22link%22:%22/amis/static/logo_c812f54.png%22}",
            "name": "rich",
            "label": "Rich Text"
        }
    ]
}
```

## tinymce 自定义配置

可以设置 options 属性来自定义编辑器的展现，详细配置项请参考[官方文档](https://www.tiny.cloud/docs/tinymce/6/basic-setup/)。

> amis 2.1.0 版本升级到了 tinymce 6，导致 plugins 的写法有变化

注意在下面的编辑器里修改 JSON 配置后不会实时生效。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-rich-text",
            "name": "rich",
            "options": {
                "menubar": false,
                "height": 200,
                "plugins": [
                    "advlist", "autolink", "link", "image", "lists", "charmap", "preview", "anchor", "pagebreak", "searchreplace", "wordcount", "visualblocks", "visualchars", "code", "fullscreen", "insertdatetime", "media", "nonbreaking", "table", "emoticons", "template", "help"
                ],
                "toolbar": "undo redo | formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help"
            }
        }
    ]
}
```

## 关于 tinymce 粘贴 word 的问题

因为 amis 中使用的是开源版本 tinymce，没有商业版本功能，导致比如从 Word 中粘贴表格会看不到边框，解决方法是自己

```json
{
  "type": "input-rich-text",
  "name": "rich",
  "options": {
    "content_css": "/xxx.css"
  }
}
```

比如下面的示例

```css
.mce-item-table th {
  font-weight: bold;
}
.mce-item-table th,
.mce-item-table td {
  padding: 6px 13px;
  border: 1px solid #ddd;
}
.mce-item-table tr {
  border-top: 1px solid #ccc;
}
```

但最终页面渲染的时候，这个 class 没有了，得改成 table

```css
table th {
  font-weight: bold;
}
table th,
table td {
  padding: 6px 13px;
  border: 1px solid #ddd;
}
table tr {
  border-top: 1px solid #ccc;
}
```

## 图片保存为 base64

当使用 tinymce 编辑器的时候，如果配置文件接收器为空，当选择图片的时候，会自动转成 base64 格式存储

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-rich-text",
            "name": "rich",
            "label": "Rich Text",
            "receiver": ""
        }
    ]
}
```

## 扩充 tinymce 插件

需要在调用 amis 的时候，通过 `env.loadTinymcePlugin` 来加载自定义插件，可以查考： [examples/components/SchemaRender.jsx](https://github.com/baidu/amis/blob/master/examples/components/SchemaRender.jsx) 文件中的示例。

```schema
{
  "type": "page",
  "body": {
    "type": "form",
    "debug": true,
    "body": [
      {
        "type": "input-rich-text",
        "name": "rich",
        "label": "Rich Text",
        "options": {
          "menubar": false,
          "height": 200,
          "plugins": [

            "example"
          ],
          "toolbar": "undo redo | example"
        }
      }
    ]
  }
}
```

## 使用 froala 编辑器

只需要加一行 `"vendor": "froala"` 配置就行，froala 是付费产品，需要设置 [richTextToken](../../start/getting-started#richtexttoken-string) 才能去掉水印。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-rich-text",
            "vendor": "froala",
            "name": "rich",
            "label": "Rich Text"
        }
    ]
}
```

### froala buttons 配置项

froala 可以通过设置 buttons 参数来控制显示哪些按钮，默认是这些：

```json
[
  "undo",
  "redo",
  "paragraphFormat",
  "textColor",
  "backgroundColor",
  "bold",
  "underline",
  "strikeThrough",
  "formatOL",
  "formatUL",
  "align",
  "quote",
  "insertLink",
  "insertImage",
  "insertEmotion",
  "insertTable",
  "html"
]
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名        | 类型                           | 默认值 | 说明                                                                                                                                                    |
| ------------- | ------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| saveAsUbb     | `boolean`                      |        | 是否保存为 ubb 格式                                                                                                                                     |
| receiver      | [API](../../../docs/types/api) |        | 默认的图片保存 API                                                                                                                                      |
| videoReceiver | [API](../../../docs/types/api) |        | 默认的视频保存 API `仅支持 froala 编辑器`                                                                                                                                     |
| fileField     | string                         |        | 上传文件时的字段名                                                                                                                                      |
| size          | `string`                       |        | 框的大小，可设置为 `md` 或者 `lg`                                                                                                                       |
| options       | `object`                       |        | 需要参考 [tinymce](https://www.tiny.cloud/docs/configure/integration-and-setup/) 或 [froala](https://www.froala.com/wysiwyg-editor/docs/options) 的文档 |
| buttons       | `Array<string>`                |        | froala 专用，配置显示的按钮，tinymce 可以通过前面的 options 设置 [toolbar](https://www.tiny.cloud/docs/demo/custom-toolbar-button/) 字符串              |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`或`${event.data.[事件参数名]}`来获取事件产生的数据，详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。
> | 事件名称 | 事件参数 | 说明 |
> | -------- | ------------------------------------- | ------------------------------------------- |
> | change | `[value]: object` 富文本组件的值<br/> | 富文本值改变时触发 |
