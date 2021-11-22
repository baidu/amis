---
title: Image 图片
description:
type: 0
group: ⚙ 组件
menuName: Image 图片
icon:
order: 52
---

## 基本使用

```schema
{
    "type": "page",
    "body": {
        "type": "image",
        "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
    }
}
```

也可以配置`name`属性关联上下文数据

```schema
{
    "type": "page",
    "data": {
        "imageUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
    },
    "body": {
        "type": "image",
        "name": "imageUrl"
    }
}
```

## 配置标题和说明

```schema
{
    "type": "page",
    "body": {
        "type": "image",
        "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
        "title": "这是标题",
        "imageCaption": "这是一段说明"
    }
}
```

## 配置缩略图

### 显示模式

```schema: scope="body"
{
    "type": "form",
    "mode": "horizontal",
    "data": {
        "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
    },
    "body": [
        {
            "type": "static-image",
            "name": "image",
            "label": "宽度占满",
            "thumbMode": "w-full"
        },
        {
            "type": "static-image",
            "name": "image",
            "label": "高度占满",
            "thumbMode": "h-full"
        },
        {
            "type": "static-image",
            "name": "image",
            "label": "颜色",
            "label": "默认",
            "thumbMode": "contain"
        },
        {
            "type": "static-image",
            "name": "image",
            "label": "覆盖",
            "thumbMode": "cover"
        }
    ]
}
```

### 显示比例

```schema: scope="body"
{
    "type": "form",
    "mode": "horizontal",
    "data": {
        "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
    },
    "body": [
        {
            "type": "static-image",
            "name": "image",
            "label": "1比1",
            "thumbRatio": "1:1",
            "thumbMode": "cover"
        },
        {
            "type": "static-image",
            "name": "image",
            "label": "4比3",
            "thumbRatio": "4:3",
            "thumbMode": "cover"
        },
        {
            "type": "static-image",
            "name": "image",
            "label": "颜色",
            "label": "16比9",
            "thumbRatio": "16:9",
            "thumbMode": "cover"
        }
    ]
}
```

## 放大功能

配置`"enlargeAble": true`，鼠标移动到图片上会显示可点击图标，点击可放大展示

```schema
{
    "type": "page",
    "body": {
        "type": "image",
        "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
        "enlargeAble": true
    }
}
```

可以配置`originalSrc`，来指定原图资源地址，作为放大预览的图片地址

```schema
{
    "type": "page",
    "body": {
        "type": "image",
        "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
        "originalSrc": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
        "enlargeAble": true
    }
}
```

`enlargeTitle`和`enlargeCaption`可以配置放大预览中的标题和描述

```schema
{
    "type": "page",
    "body": {
        "type": "image",
        "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
        "originalSrc": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
        "enlargeAble": true,
        "enlargeTitle": "这是一个标题",
        "enlargeCaption": "这是一段描述"
    }
}
```

## 设置高宽

通过 `width` 和 `height` 可以设置缩率图显示的高宽

```schema
{
    "type": "page",
    "body": {
        "type": "image",
        "width": "200px",
        "height": "200px",
        "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_400,l_1,f_jpg,q_80"
    }
}
```

## 原图模式

> 1.2.3 及以上版本

默认图片为缩略图模式，可以通过配置 imageMode: "original" 修改为原图模式，原图模式为块状展示，宽度尽可能占满。

```schema
{
    "type": "page",
    "data": {
        "imageUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg"
    },
    "body": {
        "type": "image",
        "imageMode": "original",
        "name": "imageUrl",
        "title": "这是标题",
        "imageCaption": "这是一段说明"
    }
}
```

## 打开外部链接

> 1.3.3 及以上版本

可以设置 href 属性来支持图片点击打开链接，需要注意这和放大功能是冲突的，只能二选一。

```schema: scope="body"
{
    "type": "image",
    "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
    "href": "https://github.com/baidu/amis"
}
```

href 也可以是模板

```schema
{
    "type": "page",
    "data": {
        "imageUrl": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
        "imageHref": "https://github.com/baidu/amis"
    },
    "body": {
        "type": "image",
        "name": "imageUrl",
        "href": "${imageHref}"
    }
}
```

## 用作 Field 时

当用在 Table 的列配置 Column、List 的内容、Card 卡片的内容和表单的 Static-XXX 中时，可以设置`name`属性，映射同名变量

### Table 中的列类型

```schema: scope="body"
{
    "type": "table",
    "data": {
        "items": [
            {
                "id": "1",
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
            },
            {
                "id": "2",
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
            },
            {
                "id": "3",
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
            }
        ]
    },
    "columns": [
        {
            "name": "id",
            "label": "Id"
        },

        {
            "name": "image",
            "label": "图片",
            "type": "image"
        }
    ]
}
```

List 的内容、Card 卡片的内容配置同上

### Form 中静态展示

```schema: scope="body"
{
    "type": "form",
    "data": {
        "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
    },
    "body": [
        {
            "type": "static-image",
            "name": "image",
            "label": "颜色"
        }
    ]
}
```

## 自定义点击行为

> 1.5.0 及以上版本

可以通过 `clickAction` 设置点击触发行为。

```schema: scope="body"
{
    "type": "image",
    "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
    "class": "cursor-pointer",
    "clickAction": {
        "actionType": "dialog",
        "dialog": {
            "title": "弹框标题",
            "body": "这是一个弹框"
        }
    }
}
```

## 属性表

| 属性名         | 类型                                 | 默认值    | 说明                                                                                   |
| -------------- | ------------------------------------ | --------- | -------------------------------------------------------------------------------------- |
| type           | `string`                             |           | 如果在 Table、Card 和 List 中，为`"color"`；在 Form 中用作静态展示，为`"static-color"` |
| className      | `string`                             |           | 外层 CSS 类名                                                                          |
| imageClassName | `string`                             |           | 图片 CSS 类名                                                                          |
| thumbClassName | `string`                             |           | 图片缩率图 CSS 类名                                                                    |
| height         | `string`                             |           | 图片缩率高度                                                                           |
| width          | `string`                             |           | 图片缩率宽度                                                                           |
| title          | `string`                             |           | 标题                                                                                   |
| imageCaption   | `string`                             |           | 描述                                                                                   |
| placeholder    | `string`                             |           | 占位文本                                                                               |
| defaultImage   | `string`                             |           | 无数据时显示的图片                                                                     |
| src            | `string`                             |           | 缩略图地址                                                                             |
| href           | [模板](../../docs/concepts/template) |           | 外部链接地址                                                                           |
| originalSrc    | `string`                             |           | 原图地址                                                                               |
| enlargeAble    | `boolean`                            |           | 支持放大预览                                                                           |
| enlargeTitle   | `string`                             |           | 放大预览的标题                                                                         |
| enlargeCaption | `string`                             |           | 放大预览的描述                                                                         |
| thumbMode      | `string`                             | `contain` | 预览图模式，可选：`'w-full'`, `'h-full'`, `'contain'`, `'cover'`                       |
| thumbRatio     | `string`                             | `1:1`     | 预览图比例，可选：`'1:1'`, `'4:3'`, `'16:9'`                                           |
| imageMode      | `string`                             | `thumb`   | 图片展示模式，可选：`'thumb'`, `'original'` 即：缩略图模式 或者 原图模式               |
