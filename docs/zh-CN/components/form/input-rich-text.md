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

通过设置 `receiver` 来支持文件上传，它的返回值类似如下：

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
            "receiver": "/api/mock2/sample/mirror?json={%22value%22:%22/amis/static/logo_c812f54.png%22}",
            "name": "rich",
            "label": "Rich Text"
        }
    ]
}
```

## tinymce 自定义配置

可以设置 options 属性来自定义编辑器的展现，详细配置项请参考[官方文档](https://www.tiny.cloud/docs/general-configuration-guide/basic-setup/)。

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
                    "advlist autolink lists link image charmap print preview anchor",
                    "searchreplace visualblocks code fullscreen",
                    "insertdatetime media table paste code help wordcount"
                ],
                "toolbar": "undo redo | formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help"
            }
        }
    ]
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
| videoReceiver | [API](../../../docs/types/api) |        | 默认的视频保存 API                                                                                                                                      |
| size          | `string`                       |        | 框的大小，可设置为 `md` 或者 `lg`                                                                                                                       |
| options       | `object`                       |        | 需要参考 [tinymce](https://www.tiny.cloud/docs/configure/integration-and-setup/) 或 [froala](https://www.froala.com/wysiwyg-editor/docs/options) 的文档 |
| buttons       | `Array<string>`                |        | froala 专用，配置显示的按钮，tinymce 可以通过前面的 options 设置 [toolbar](https://www.tiny.cloud/docs/demo/custom-toolbar-button/) 字符串              |
