---
title: Icon 图标
description:
type: 0
group: ⚙ 组件
menuName: Icon
icon:
order: 50
---

> 在 React 项目中使用 Icon 需要引入 `@fortawesome/fontawesome-free`，然后在代码中 `import '@fortawesome/fontawesome-free/css/all.css'`，还有相关的 webpack 配置，具体请参考 [amis-react-starter](https://github.com/aisuda/amis-react-starter) 里的配置

## 基本使用

```schema
{
    "type": "page",
    "body": {
        "type": "icon",
        "icon": "cloud"
    }
}
```

## 颜色及大小调整

icon 基于字体实现，所以可以通过[文字颜色](../../../style/typography/text-color)或[大小](../../../style/typography/font-size)来控制它。

```schema
{
    "type": "page",
    "body": {
        "type": "icon",
        "icon": "cloud",
        "className": "text-info text-xl"
    }
}
```

## 使用图标链接

icon 还可以使用 URL 地址，可以从 [iconfont](https://www.iconfont.cn/) 等网站下载图表的 svg 文件上传到服务器，然后使用对应的地址，比如

```schema
{
    "type": "page",
    "body": {
        "type": "icon",
        "icon": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fdiamond.svg"
    }
}
```

## 使用 v5/v6 版本的 fontawesome

`icon`默认支持[fontawesome v4](https://fontawesome.com/v4/icons/)，如果想要支持 v5 以及 v6 版本的 fontawesome 请设置`vendor`为空字符串。

### fontawesome v5 版本

v5 用 far/fas 等表示前缀，可参考官网[示例](https://fontawesome.com/v5/search?m=free)

```schema
{
    "type":"page",
    "body":[
        {
            "type":"icon",
            "icon":"far fa-address-book",
            "vendor":""
        },
        {
            "type":"icon",
            "icon":"fas fa-address-book",
            "vendor":""
        },
        {
            "type":"icon",
            "icon":"far fa-address-book",
            "vendor":"",
            "className": "text-info text-xl"
        },
        {
            "type":"icon",
            "icon":"fas fa-address-book",
            "vendor":"",
            "className": "text-info text-xl"
        },
        {
          type: "divider",
        },
        {
            "type":"icon",
            "icon":"far fa-bell",
            "vendor":""
        },
        {
            "type":"icon",
            "icon":"fas fa-bell",
            "vendor":""
        },
        {
            "type":"icon",
            "icon":"far fa-bell",
            "vendor":"",
            "className": "text-info text-xl"
        },
        {
            "type":"icon",
            "icon":"fas fa-bell",
            "vendor":"",
            "className": "text-info text-xl"
        },
        {
          type: "divider",
        },
        {
            "type":"icon",
            "icon":"far fa-plus",
            "vendor":""
        },
        {
            "type":"icon",
            "icon":"fas fa-plus",
            "vendor":""
        },
        {
            "type":"icon",
            "icon":"far fa-plus",
            "vendor":"",
            "className": "text-info text-xl"
        },
        {
            "type":"icon",
            "icon":"fas fa-plus",
            "vendor":"",
            "className": "text-info text-xl"
        },
        {
          type: "divider",
        },
        {
            "type":"icon",
            "icon":"far fa-question-circle",
            "vendor":""
        },
        {
            "type":"icon",
            "icon":"fas fa-question-circle",
            "vendor":""
        },
        {
            "type":"icon",
            "icon":"far fa-question-circle",
            "vendor":"",
            "className": "text-info text-xl"
        },
        {
            "type":"icon",
            "icon":"fas fa-question-circle",
            "vendor":"",
            "className": "text-info text-xl"
        }
    ]
}
```

### fontawesome v6 版本

v6 用 fa-regular / fa-solid 等表示前缀，可参考官网[示例](https://fontawesome.com/search?m=free)

```schema
{
    "type":"page",
    "body":[
        {
            "type":"icon",
            "icon":"fa-regular fa-address-book",
            "vendor":""
        },
        {
            "type":"icon",
            "icon":"fa-solid fa-address-book",
            "vendor":""
        },
        {
            "type":"icon",
            "icon":"fa-regular fa-address-book",
            "vendor":"",
            "className": "text-info text-xl"
        },
        {
            "type":"icon",
            "icon":"fa-solid fa-address-book",
            "vendor":"",
            "className": "text-info text-xl"
        }
    ]
}
```

## 属性表

| 属性名    | 类型     | 默认值 | 说明                                                                                                                      |
| --------- | -------- | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| type      | `string` | `icon` | 指定组件类型                                                                                                              |
| className | `string` |        | 外层 CSS 类名                                                                                                             |
| icon      | `string` |        | icon 名称，支持 [fontawesome v4](https://fontawesome.com/v4/icons/) 或 通过 registerIcon 注册的 icon、或使用 url          |
| vendor    | `string` |        | icon 类型，默认为`fa`, 表示 fontawesome v4。也支持 iconfont, 如果是 fontawesome v5 以上版本或者其他框架可以设置为空字符串 |
