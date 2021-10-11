---
title: Static 静态展示
description:
type: 0
group: null
menuName: Static 静态展示
icon:
order: 52
---

用来在表单中，展示静态数据

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "static",
            "type": "static",
            "label": "静态展示",
            "value": "aaa"
        }
    ]
}
```

## 数据域变量映射

除了显式配置`value`属性，来展示数据以外，支持通过配置`name`属性，来自动映射数据域中的相关变量

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "select",
            "name": "select",
            "label": "select",
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        },
        {
            "type": "static",
            "name": "select",
            "label": "选中的值是"
        }
    ]
}
```

## 展示其他组件

支持通过配置`type`为`static-xxx`的形式，展示其他 **非[表单项](./formitem)** 组件，例如：

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "static-json",
            "name": "json",
            "label": "静态展示JSON",
            "value": {
                "a": "aaa",
                "b": "bbb"
            }
        }
    ]
}
```

理论上可以支持所有非表达项的所有组件，并且支持对应的配置项，下面是一些示例：

```schema: scope="body"
{
    "type": "form",
    "data": {
        "id": 1,
        "image": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg",
        "images": [
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg"
            },
            {
                "image": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80",
                "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg"
            }
        ]
    },
    "api": "/api/mock2/saveForm?waitSeconds=2",
    "title": "表单项静态展示",
    "mode": "horizontal",
    "body": [
        {
            "type": "static",
            "label": "文本",
            "value": "文本"
        },
        {
            "type": "divider"
        },
        {
            "type": "static-tpl",
            "label": "模板",
            "tpl": "自己拼接 HTML 取变量 \\${id}: ${id}"
        },
        {
            "type": "divider"
        },
        {
            "type": "static-date",
            "label": "日期",
            "value": 1593327764
        },
        {
            "type": "divider"
        },
        {
            "type": "static-datetime",
            "label": "日期时间",
            "value": 1593327764
        },
        {
            "type": "divider"
        },
        {
            "type": "static-mapping",
            "label": "映射",
            "value": 2,
            "map": {
                "0": "<span class='label label-info'>一</span>",
                "1": "<span class='label label-success'>二</span>",
                "2": "<span class='label label-danger'>三</span>",
                "3": "<span class='label label-warning'>四</span>",
                "4": "<span class='label label-primary'>五</span>",
                "*": "<span class='label label-default'>-</span>"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "static-progress",
            "label": "进度",
            "value": 66.66
        },
        {
            "type": "divider"
        },
        {
            "type": "static-image",
            "label": "图片",
            "name": "image",
            "thumbMode": "cover",
            "thumbRatio": "4:3",
            "title": "233",
            "imageCaption": "jfe fjkda fejfkda fejk fdajf dajfe jfkda",
            "popOver": {
                "title": "查看大图",
                "body": "<div class=\"w-xxl\"><img class=\"w-full\" src=\"${image}\"/></div>"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "static-image",
            "label": "图片自带放大",
            "name": "image",
            "thumbMode": "cover",
            "thumbRatio": "4:3",
            "title": "233",
            "imageCaption": "jfe fjkda fejfkda fejk fdajf dajfe jfkda",
            "enlargeAble": true,
            "originalSrc": "${image}"
        },
        {
            "type": "static-images",
            "label": "图片集",
            "name": "images",
            "thumbMode": "cover",
            "thumbRatio": "4:3",
            "enlargeAble": true,
            "originalSrc": "${src}"
        },
        {
            "type": "divider"
        },
        {
            "type": "static-json",
            "label": "JSON",
            "value": {
                "a": 1,
                "b": 2,
                "c": {
                    "d": 3
                }
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "static",
            "label": "可复制",
            "value": "文本",
            "copyable": {
                "content": "内容，支持变量 ${id}"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "static",
            "name": "text",
            "label": "可快速编辑",
            "value": "文本",
            "quickEdit": true
        }
    ]
}
```

想要调整展示组件的配置，请查阅相应组件的文档。

## 快速编辑

通过 `quickEdit` 开启快速编辑功能，比如

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "static",
            "type": "static",
            "label": "静态展示",
            "value": "aaa",
            "quickEdit": {
                "type": "number"
            }
        }
    ]
}
```

其他配置项参考 [快速编辑](../crud#快速编辑)

## 弹出框（popOver）

可以通过 `popOver` 属性配置弹出框

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "name": "static",
            "type": "static",
            "label": "静态展示",
            "value": "aaa",
             "popOver": {
                "body": {
                    "type": "tpl",
                    "tpl": "弹出内容"
                }
            }
        }
    ]
}
```
