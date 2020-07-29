---
title: Rich-Text 富文本编辑器
description:
type: 0
group: null
menuName: Rich-Text
icon:
order: 47
---

## 基本用法

```schema:height="600" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "type": "rich-text",
            "name": "rich",
            "label": "Rich Text"
        }
    ]
}
```

## 配置 buttons

```js
[
  'paragraphFormat',
  'quote',
  'color',
  '|',
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  '|',
  'formatOL',
  'formatUL',
  'align',
  '|',
  'insertLink',
  'insertImage',
  'insertTable',
  '|',
  'undo',
  'redo',
  'html'
];
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名    | 类型                   | 默认值                                                                                                                                                                                                                     | 说明                                                                                       |
| --------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| saveAsUbb | `boolean`              |                                                                                                                                                                                                                            | 是否保存为 ubb 格式                                                                        |
| reciever  | [API](../../types/api) |                                                                                                                                                                                                                            | 默认的图片保存 API                                                                         |
| size      | `string`               |                                                                                                                                                                                                                            | 框的大小，可设置为 `md` 或者 `lg`                                                          |
| options   | `object`               |                                                                                                                                                                                                                            | Object 类型，给富文本的配置信息。请参考 https://www.froala.com/wysiwyg-editor/docs/options |
| buttons   | `Array<string>`        | `[ 'paragraphFormat', 'quote', 'color', ' | ', 'bold', 'italic', 'underline', 'strikeThrough', ' | ', 'formatOL', 'formatUL', 'align', ' | ', 'insertLink', 'insertImage', 'insertTable', ' | ', 'undo', 'redo', 'html' ]` | 精度，即小数点后几位                                                                       |
