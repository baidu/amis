---
title: Editor 编辑器
description:
type: 0
group: null
menuName: Editor
icon:
order: 19
---

用于实现代码编辑，如果要实现富文本编辑请使用 [Rich-Text](./input-rich-text)。

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "editor",
            "name": "editor",
            "label": "编辑器",
            placeholder: "function() {\n  console.log('hello world')\n}"
        }
    ]
}
```

## 支持的语言

可以设置`language`配置高亮的语言，支持的语言有：

`bat`、 `c`、 `coffeescript`、 `cpp`、 `csharp`、 `css`、 `dockerfile`、 `fsharp`、 `go`、 `handlebars`、 `html`、 `ini`、 `java`、 `javascript`、 `json`、 `less`、 `lua`、 `markdown`、 `msdax`、 `objective-c`、 `php`、 `plaintext`、 `postiats`、 `powershell`、 `pug`、 `python`、 `r`、 `razor`、 `ruby`、 `sb`、 `scss`、`shell`、 `sol`、 `sql`、 `swift`、 `typescript`、 `vb`、 `xml`、 `yaml`

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "editor",
            "name": "editor",
            "label": "JSON编辑器",
            "language": "json"
        }
    ]
}
```

> 因为性能原因，上面的例子不支持实时修改 language 生效

当然你也可以使用`xxx-editor`这种形式，例如`"type": "json-editor"`

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
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

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "json-editor",
            "name": "editor",
            "disabled": true,
            "label": "JSON编辑器"
        }
    ]
}
```

## 全屏模式

设置`allowFullscreen`属性为`true`，显示编辑器的全屏模式开关，开关开启后编辑器进入全屏模式。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "editor",
            "name": "editor",
            "label": "支持全屏模式的编辑器",
            "allowFullscreen": true
        }
    ]
}
```

## 编辑器展现控制

通过 `options` 来控制编辑器展现，比如下面的配置可以关闭行号

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "editor",
            "name": "editor",
            "label": "编辑器",
            "options": {
                "lineNumbers": "off"
            }
        }
    ]
}
```

## 编辑器自定义开发

amis 的编辑器是基于 monaco 开发的，如果想进行深度定制，比如自动完成功能，可以通过自定义 `editorDidMount` 属性来获取到 monaco 实例，它有两种写法，一种是在 JS 中直接用函数，示例如下：

```javascript
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "editor",
            "name": "editor",
            "label": "编辑器",
            "language": "myLan",
            "editorDidMount": (editor, monaco) => {
                // editor 是 monaco 实例，monaco 是全局的名称空间
                const dispose = monaco.languages.registerCompletionItemProvider('myLan', {
                    /// 其他细节参考 monaco 手册
                });

                // 如果返回一个函数，这个函数会在编辑器组件卸载的时候调用，主要用于清理资源
                return dispose;
            }
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名          | 类型      | 默认值       | 说明                                                                                                                                                                                                     |
| --------------- | --------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| language        | `string`  | `javascript` | 编辑器高亮的语言，支持通过 `${xxx}` 变量获取                                                                                                                                                             |
| size            | `string`  | `md`         | 编辑器高度，取值可以是 `md`、`lg`、`xl`、`xxl`                                                                                                                                                           |
| allowFullscreen | `boolean` | `false`      | 是否显示全屏模式开关                                                                                                                                                                                     |
| options         | `object`  |              | monaco 编辑器的其它配置，比如是否显示行号等，请参考[这里](https://microsoft.github.io/monaco-editor/api/enums/monaco.editor.EditorOption.html)，不过无法设置 readOnly，只读模式需要使用 `disabled: true` |
| placeholder     | `string`  |              | 占位描述，没有值的时候展示                                                                                                                                                                               |

## 事件表

当前组件会对外派发以下事件，可以通过`onEvent`来监听这些事件，并通过`actions`来配置执行的动作，在`actions`中可以通过`${事件参数名}`来获取事件产生的数据（`< 2.2.1 及以下版本 为 ${event.data.[事件参数名]}`），详细请查看[事件动作](../../docs/concepts/event-action)。

> `[name]`表示当前组件绑定的名称，即`name`属性，如果没有配置`name`属性，则通过`value`取值。

| 事件名称 | 事件参数                  | 说明                 |
| -------- | ------------------------- | -------------------- |
| change   | `[name]: string` 组件的值 | 代码变化时触发       |
| focus    | `[name]: string` 组件的值 | 输入框获取焦点时触发 |
| blur     | `[name]: string` 组件的值 | 输入框失去焦点时触发 |

## 动作表

当前组件对外暴露以下特性动作，其他组件可以通过指定`actionType: 动作名称`、`componentId: 该组件id`来触发这些动作，动作配置可以通过`args: {动作配置项名称: xxx}`来配置具体的参数，详细请查看[事件动作](../../docs/concepts/event-action#触发其他组件的动作)。

| 动作名称 | 动作配置                 | 说明                                                   |
| -------- | ------------------------ | ------------------------------------------------------ |
| clear    | -                        | 清空                                                   |
| reset    | -                        | 将值重置为`resetValue`，若没有配置`resetValue`，则清空 |
| focus    | -                        | 获取焦点                                               |
| setValue | `value: string` 更新的值 | 更新数据                                               |
