---
title: Editor 编辑器
description:
type: 0
group: null
menuName: Editor
icon:
order: 19
---

## 基本用法

```schema:height="400" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "type": "editor",
            "name": "editor",
            "label": "编辑器"
        }
    ]
}
```

## 支持的语言

可以设置`language`配置高亮的语言，支持的语言有：

`bat`、 `c`、 `coffeescript`、 `cpp`、 `csharp`、 `css`、 `dockerfile`、 `fsharp`、 `go`、 `handlebars`、 `html`、 `ini`、 `java`、 `javascript`、 `json`、 `less`、 `lua`、 `markdown`、 `msdax`、 `objective-c`、 `php`、 `plaintext`、 `postiats`、 `powershell`、 `pug`、 `python`、 `r`、 `razor`、 `ruby`、 `sb`、 `scss`、 `sol`、 `sql`、 `swift`、 `typescript`、 `vb`、 `xml`、 `yaml`

```schema:height="400" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "type": "editor",
            "name": "editor",
            "label": "JSON编辑器",
            "language": "json"
        }
    ]
}
```

当然你也可以使用`xxx-editor`这种形式，例如`"type": "json-editor"`

```schema:height="400" scope="body"
{
    "type": "form",
    "api": "https://houtai.baidu.com/api/mock2/form/saveForm",
    "controls": [
        {
            "type": "json-editor",
            "name": "editor",
            "label": "JSON编辑器"
        }
    ]
}
```

## 只读模式

使用 `disabled: true`。

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名   | 类型     | 默认值       | 说明                                                                                                                                                                                                     |
| -------- | -------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| language | `string` | `javascript` | 编辑器高亮的语言                                                                                                                                                                                         |
| size     | `string` | `md`         | 编辑器高度，取值可以是 `md`、`lg`、`xl`、`xxl`                                                                                                                                                           |
| options  | `object` |              | monaco 编辑器的其它配置，比如是否显示行号等，请参考[这里](https://microsoft.github.io/monaco-editor/api/enums/monaco.editor.editoroption.html)，不过无法设置 readOnly，只读模式需要使用 `disabled: true` |
