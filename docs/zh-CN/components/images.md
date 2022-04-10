---
title: Images 图片集
description:
type: 0
group: ⚙ 组件
menuName: Images 图片集合
icon:
order: 53
---

图片集展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像`Service`、`Form`或`CRUD`这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过`source`属性，获取数据链中的数据，完成数据展示。

## 基本用法

通过 source 关联上下文数据，或者通过 name 关联。

```schema
{
    "type": "page",
    "data": {
        "imageList": [
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80"
        ]
    },
    "body": [
        {
            "type": "images",
            "source": "${imageList}"
        },
        {
            "type": "divider"
        },
        {
            "type": "images",
            "name": "imageList"
        }
    ]
}
```

也可以静态展示，即不关联数据固定显示。

```schema
{
    "type": "page",
    "body": {
        "type": "images",
        "options": [
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80"
        ]
    }
}
```

## 值格式

除了支持纯文本数组以外，也支持对象数组，如：

```ts
Array<{
    image: string; // 小图，预览图
    src?: string; // 原图
    title?: string; // 标题
    description?: string; // 描述
    [propName:string]: any; // 还可以有其他数据
}>
```

### 配置预览图地址

需要设置对象中预览图地址的`key`值为`image`

```schema
{
    "type": "page",
    "data": {
        "images": [
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "a": "aaa1",
                "b": "bbb1"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "a": "aaa2",
                "b": "bbb2"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "a": "aaa3",
                "b": "bbb3"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "a": "aaa4",
                "b": "bbb4"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "a": "aaa5",
                "b": "bbb5"
            }
        ]
    },
    "body": {
        "type": "images",
        "source": "${images}"
    }
}
```

如果`key`值不是`image`，也可以在 **images 组件** 上，通过配置`src`，使用数据映射，来获取图片地址

```schema
{
    "type": "page",
    "data": {
        "images": [
            {
                "img": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "a": "aaa1",
                "b": "bbb1"
            },
            {
                "img": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "a": "aaa2",
                "b": "bbb2"
            },
            {
                "img": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "a": "aaa3",
                "b": "bbb3"
            },
            {
                "img": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "a": "aaa4",
                "b": "bbb4"
            },
            {
                "img": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "a": "aaa5",
                "b": "bbb5"
            }
        ]
    },
    "body": {
        "type": "images",
        "source": "${images}",
        "src": "${img}"
    }
}
```

### 配置原图地址

需要设置对象中原图地址的`key`值为`src`

```schema
{
    "type": "page",
    "data": {
        "images": [
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
                "a": "aaa1",
                "b": "bbb1"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg",
                "a": "aaa2",
                "b": "bbb2"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg",
                "a": "aaa3",
                "b": "bbb3"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg",
                "a": "aaa4",
                "b": "bbb4"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg",
                "a": "aaa5",
                "b": "bbb5"
            }
        ]
    },
    "body": {
        "type": "images",
        "source": "${images}",
        "enlargeAble": true
    }
}
```

如果原图数据的`key`值不是`src`，也可以在 **images 组件** 上，通过配置`originalSrc`，使用数据映射，来获取原图片地址

```schema
{
    "type": "page",
    "data": {
        "images": [
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "source": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
                "a": "aaa1",
                "b": "bbb1"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "source": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
                "a": "aaa2",
                "b": "bbb2"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "source": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
                "a": "aaa3",
                "b": "bbb3"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "source": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
                "a": "aaa4",
                "b": "bbb4"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "source": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
                "a": "aaa5",
                "b": "bbb5"
            }
        ]
    },
    "body": {
        "type": "images",
        "source": "${images}",
        "originalSrc": "${source}",
        "enlargeAble": true
    }
}
```

### 配置标题和说明

设置对象中标题的`key`值为`title`，说明的`key`为`description`或`caption`。

```schema
{
    "type": "page",
    "data": {
        "images": [
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "title": "图片1",
                "description": "图片1的描述"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "title": "图片2",
                "description": "图片2的描述"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "title": "图片3",
                "description": "图片3的描述"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "title": "图片4",
                "description": "图片4的描述"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "title": "图片5",
                "description": "图片5的描述"
            }
        ]
    },
    "body": {
        "type": "images",
        "source": "${images}"
    }
}
```

## 显示比例和缩略图模式

比如这个例子配置成 16:9 的比率展示缩略图，并裁剪部分去掉空白。

```schema
{
    "type": "page",
    "body": {
        "type": "images",
        "thumbRatio": "16:9",
        "thumbMode": "cover",
        "options": [
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80"
        ]
    }
}
```

## 配置放大预览

在 **images 组件** 上，配置`enlargeAble`，支持放大预览

```schema
{
    "type": "page",
    "data": {
        "images": [
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
                "title": "图片1",
                "description": "图片1的描述"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
                "title": "图片2",
                "description": "图片2的描述"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
                "title": "图片3",
                "description": "图片3的描述"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
                "title": "图片4",
                "description": "图片4的描述"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg",
                "title": "图片5",
                "description": "图片5的描述"
            }
        ]
    },
    "body": {
        "type": "images",
        "source": "${images}",
        "enlargeAble": true
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
                "images": [
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80"
                ]
            },
            {
                "id": "2",
                "images": [
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80"
                ]
            },
            {
                "id": "3",
                "images": [
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                    "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80"
                ]
            }
        ]
    },
    "columns": [
        {
            "name": "id",
            "label": "Id"
        },

        {
            "name": "images",
            "label": "颜色",
            "type": "images"
        }
    ]
}
```

List 的内容、Card 卡片的内容配置同上

### Form 中关联数据静态展示

```schema: scope="body"
{
    "type": "form",
    "data": {
        "images": [
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
            "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80"
        ]
    },
    "body": [
        {
            "type": "static-images",
            "name": "images",
            "label": "图片集"
        }
    ]
}
```

## 属性表

| 属性名       | 类型                                       | 默认值    | 说明                                                                                     |
| ------------ | ------------------------------------------ | --------- | ---------------------------------------------------------------------------------------- |
| type         | `string`                                   | `images`  | 如果在 Table、Card 和 List 中，为`"images"`；在 Form 中用作静态展示，为`"static-images"` |
| className    | `string`                                   |           | 外层 CSS 类名                                                                            |
| defaultImage | `string`                                   |           | 默认展示图片                                                                             |
| value        | `string`或`Array<string>`或`Array<object>` |           | 图片数组                                                                                 |
| source       | `string`                                   |           | 数据源                                                                                   |
| delimiter    | `string`                                   | `,`       | 分隔符，当 value 为字符串时，用该值进行分隔拆分                                          |
| src          | `string`                                   |           | 预览图地址，支持数据映射获取对象中图片变量                                               |
| originalSrc  | `string`                                   |           | 原图地址，支持数据映射获取对象中图片变量                                                 |
| enlargeAble  | `boolean`                                  |           | 支持放大预览                                                                             |
| thumbMode    | `string`                                   | `contain` | 预览图模式，可选：`'w-full'`, `'h-full'`, `'contain'`, `'cover'`                         |
| thumbRatio   | `string`                                   | `1:1`     | 预览图比例，可选：`'1:1'`, `'4:3'`, `'16:9'`                                             |
