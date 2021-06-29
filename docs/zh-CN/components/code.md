---
title: Code 代码高亮
description:
type: 0
group: ⚙ 组件
menuName: Code
icon:
order: 38
---

使用代码高亮的方式来显示一段代码。

## 基本用法

```schema
{
  "body": {
    "type": "code",
    "language": "html",
    "value": "<div>html</div>"
  }
}
```

## 语言设置

默认语言是 html，可以通过 language 指定以下语言：

`bat`、 `c`、 `coffeescript`、 `cpp`、 `csharp`、 `css`、 `dockerfile`、 `fsharp`、 `go`、 `handlebars`、 `html`、 `ini`、 `java`、 `javascript`、 `json`、 `less`、 `lua`、 `markdown`、 `msdax`、 `objective-c`、 `php`、 `plaintext`、 `postiats`、 `powershell`、 `pug`、 `python`、 `r`、 `razor`、 `ruby`、 `sb`、 `scss`、`shell`、 `sol`、 `sql`、 `swift`、 `typescript`、 `vb`、 `xml`、 `yaml`

```schema
{
  "body": {
    "type": "code",
    "language": "javascript",
    "value": "(function () {\n  let amis = amisRequire('amis/embed');\n  let amisJSON = {\n    type: 'page',\n    title: '表单页面',\n    body: {\n      type: 'form',\n      mode: 'horizontal',\n      api: '/saveForm',\n      body: [\n        {\n          label: 'Name',\n          type: 'input-text',\n          name: 'name'\n        },\n        {\n          label: 'Email',\n          type: 'input-email',\n          name: 'email'\n        }\n      ]\n    }\n  };\n  let amisScoped = amis.embed('#root', amisJSON);\n})();"
  }
}
```

language 支持从上下文获取数据

```schema
{
  "data": {
    "lang": "javascript"
  },
  "body": {
    "type": "code",
    "language": "${lang}",
    "value": "function amis() {\n  console.log('amis');\n}"
  }
}
```

## 动态数据

可以使用 name 来从上下文来获取数据，比如

```schema
{
  "data": {
    "sourcecode": "<div>html</div>"
  },
  "body": {
    "type": "code",
    "language": "html",
    "name": "sourcecode"
  }
}
```

因此它还能放在表单、crud 中实现代码的展现。

## 属性表

| 属性名    | 类型     | 默认值 | 说明                               |
| --------- | -------- | ------ | ---------------------------------- |
| className | `string` |        | 外层 CSS 类名                      |
| value     | `string` |        | 显示的颜色值                       |
| name      | `string` |        | 在其他组件中，时，用作变量映射     |
| language  | `string` |        | 所使用的高亮语言，默认是 plaintext |
