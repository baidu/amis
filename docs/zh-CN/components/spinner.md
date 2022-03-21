---
title: Spinner 加载中
description:
type: 0
group: ⚙ 组件
menuName: Spinner
icon:
order: 64
---

一般用来做 `loading` 使用。

## 基本使用

`show` 属性控制 `spinner` 是否渲染。

```schema
{
    "type": "page",
    "body": {
        "type": "spinner",
        "show": true,
    }
}
```

`size` 属性控制 `spinner` 的大小，有三种配置：`sm`, `lg` 和 空值。

```schema
{
    "type": "page",
    "body": [
        {
            "type": "spinner",
            "show": true,
            "size": "sm",
            "className": "mr-4"
        },
        {
            "type": "spinner",
            "show": true,
            "size": "",
            "className": "mr-4"
        },
        {
            "type": "spinner",
            "show": true,
            "size": "lg"
        }
    ]
}
```

`className` 属性、 `spinnerClassName`属性和 `spinnerWrapClassName`属性可以配置 spinner 自定义的 class，`className`会添加到 spinner 组件的最外层标签上，`spinnerClassName`会添加到 icon 对应的标签上，`spinnerWrapClassName` 在作为组件容器使用时，会作用于整个 Spinner 组件的最外层元素上。

```schema
{
    "type": "page",
    "body": [
        {
            "type": "spinner",
            "show": true,
            "className": "my-spinner",
            "spinnerClassName": "my-spinner-custom-icon",
            "spinnerWrapClassName": "my-spinner-wrap",
        }
    ]
}
```

`icon` 属性可以配置自定义的图标，可以是 `amis` 内置的图标名称（需要是在 icons.tsx 组件中注册过的）; 可以是字体图标库的名称(需要引入对应的图标库)，比如`fa fa-spinner`; 也可以是网络图片，比如 `/examples/static/logo.png`;

```schema
{
    "type": "page",
    "body": [
        {
            "type": "spinner",
            "show": true,
            "icon": "",
            "className": "mr-4"
        },
        {
            "type": "spinner",
            "show": true,
            "icon": "reload",
            "className": "mr-4"
        },
        {
            "type": "spinner",
            "show": true,
            "icon": "fa fa-spinner",
            "className": "mr-4"
        },
        {
            "type": "spinner",
            "show": true,
            "icon": "/examples/static/logo.png"
        }
    ]
}
```

`tip` 属性可以配置 spinner 的文案，同时 `tipPlacement`可以配置 tip 的相对于 icon 的位置，有四种配置：`top`,`right`,`bottom`(默认),`left`;

```schema
{
    "type": "page",
    "body": [
        {
            "type": "spinner",
            "show": true,
            "tip": "加载中...",
            "className": "mr-10"
        },
        {
            "type": "spinner",
            "show": true,
            "tip": "加载中...",
            "tipPlacement": "right",
            "className": "mr-10"
        },
        {
            "type": "spinner",
            "show": true,
            "tip": "加载中...",
            "tipPlacement": "top",
            "className": "mr-10"
        },
        {
            "type": "spinner",
            "show": true,
            "tip": "加载中...",
            "tipPlacement": "left"
        }
    ]
}
```

`delay` 属性可以配置 spinner 的延迟显示时间，例如 delay=1000，`show` 属性设为 `true` 后，1000ms 后才会显示出来。

```schema
{
    "type": "page",
    "body": {
        "type": "spinner",
        "show": true,
        "delay": 1000
    }
}
```

## 作为容器使用

`spinner` 组件可以作为容器使用，被包裹的内容可通过 `body` 配置, 且作为容器使用的时候可以使用 `overlay` 属性来配置显示 spinner 的时候是否显示遮罩层（遮罩层背景颜色默认是透明的，可通过外层 className 自定义遮罩层颜色）。

```schema
{
    "type": "page",
    "body": {
        "type": "spinner",
        "show": true,
        "overlay": true,
        "body": {
            "type": "form",
            "body": [
                {
                    "type": "input-text",
                    "name": "name",
                    "label": "姓名："
                },
                {
                    "name": "email",
                    "type": "input-email",
                    "label": "邮箱："
                }
            ]
        }
    }
}
```

## 属性表

| 属性名               | 类型                                      | 默认值    | 说明                                                                                                 |
| -------------------- | ----------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| type                 | `string`                                  | `spinner` | 指定为 Spinner 渲染器                                                                                |
| show                 | `boolean`                                 | `true`    | 是否显示 spinner 组件                                                                                |
| className            | `string`                                  |           | spinner 图标父级标签的自定义 class                                                                   |
| spinnerClassName     | `string`                                  |           | 组件中 icon 所在标签的自定义 class                                                                   |
| spinnerWrapClassName | `string`                                  |           | 作为容器使用时组件最外层标签的自定义 class                                                           |
| size                 | `string`                                  |           | 组件大小 `sm` `lg`                                                                                   |
| icon                 | `string`                                  |           | 组件图标，可以是`amis`内置图标，也可以是字体图标或者网络图片链接，作为 ui 库使用时也可以是自定义组件 |
| tip                  | `string`                                  |           | 配置组件文案，例如`加载中...`                                                                        |
| tipPlacement         | `top`, `right`, `bottom`, `left`          | `bottom`  | 配置组件 `tip` 相对于 `icon` 的位置                                                                  |
| delay                | `number`                                  | `0`       | 配置组件显示延迟的时间（毫秒）                                                                       |
| overlay              | `boolean`                                 | `true`    | 配置组件显示 spinner 时是否显示遮罩层                                                                |
| body                 | [SchemaNode](../../docs/types/schemanode) |           | 作为容器使用时，被包裹的内容                                                                         |
