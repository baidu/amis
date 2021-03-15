---
title: Anchor 锚点
description:
type: 0
group: ⚙ 组件
menuName: Anchor
icon:
order: 68
---

锚点容器组件。

## 基本用法

```schema: scope="body"
{
    "type": "anchor",
    "links": [
        {
            "title": "基本信息",
            "body": [
                {
                    "type": "form",
                    "title": "基本信息",
                    "controls": [
                        {
                            "type": "text",
                            "name": "name",
                            "label": "姓名："
                        },
                        {
                            "name": "email",
                            "type": "email",
                            "label": "邮箱："
                        }
                    ]
                }
            ]
        },
        {
            "title": "工作信息",
            "body": [
                {
                    "type": "form",
                    "title": "工作信息",
                    "controls": [
                        {
                            "type": "text",
                            "name": "cname",
                            "label": "公司名称："
                        },
                        {
                            "name": "caddress",
                            "type": "text",
                            "label": "公司地址："
                        }
                    ]
                }
            ]
        },
        {
            "title": "兴趣爱好",
            "body": [
                {
                    "type": "form",
                    "title": "兴趣爱好",
                    "controls": [
                        {
                            "type": "text",
                            "name": "interest1",
                            "label": "兴趣爱好1："
                        },
                        {
                            "name": "interest2",
                            "type": "text",
                            "label": "兴趣爱好2："
                        },
                        {
                            "name": "interest3",
                            "type": "text",
                            "label": "兴趣爱好3："
                        },
                        {
                            "name": "interest4",
                            "type": "text",
                            "label": "兴趣爱好4："
                        },
                        {
                            "name": "interest5",
                            "type": "text",
                            "label": "兴趣爱好5："
                        },
                        {
                            "name": "interest6",
                            "type": "text",
                            "label": "兴趣爱好6："
                        }
                    ]
                }
            ]
        }
    ]
}
```

默认想要显示多少锚点配置多少个 `links` 成员即可。

## 默认定位到某个区域

主要配置`active`属性来实现该效果，共有下面两种方法：

#### 配置 href 值

```schema: scope="body"
{
    "type": "anchor",
    "active": "work",
    "links": [
        {
            "title": "基本信息",
            "href": "base",
            "body": [
                {
                    "type": "form",
                    "title": "基本信息",
                    "controls": [
                        {
                            "type": "text",
                            "name": "name",
                            "label": "姓名："
                        },
                        {
                            "name": "email",
                            "type": "email",
                            "label": "邮箱："
                        }
                    ]
                }
            ]
        },
        {
            "title": "工作信息",
            "href": "work",
            "body": [
                {
                    "type": "form",
                    "title": "工作信息",
                    "controls": [
                        {
                            "type": "text",
                            "name": "cname",
                            "label": "公司名称："
                        },
                        {
                            "name": "caddress",
                            "type": "text",
                            "label": "公司地址："
                        }
                    ]
                }
            ]
        },
        {
            "title": "兴趣爱好",
            "href": "interest",
            "body": [
                {
                    "type": "form",
                    "title": "兴趣爱好",
                    "controls": [
                        {
                            "type": "text",
                            "name": "interest1",
                            "label": "兴趣爱好1："
                        },
                        {
                            "name": "interest2",
                            "type": "text",
                            "label": "兴趣爱好2："
                        },
                        {
                            "name": "interest3",
                            "type": "text",
                            "label": "兴趣爱好3："
                        },
                        {
                            "name": "interest4",
                            "type": "text",
                            "label": "兴趣爱好4："
                        },
                        {
                            "name": "interest5",
                            "type": "text",
                            "label": "兴趣爱好5："
                        },
                        {
                            "name": "interest6",
                            "type": "text",
                            "label": "兴趣爱好6："
                        }
                    ]
                }
            ]
        }
    ]
}
```

#### 配置索引值

单个`link`上不要配置`href`属性，配置需要展示的`link`索引值，`0`代表第一个。

```schema: scope="body"
{
    "type": "anchor",
    "active": 1,
    "links": [
        {
            "title": "基本信息",
            "body": [
                {
                    "type": "form",
                    "title": "基本信息",
                    "controls": [
                        {
                            "type": "text",
                            "name": "name",
                            "label": "姓名："
                        },
                        {
                            "name": "email",
                            "type": "email",
                            "label": "邮箱："
                        }
                    ]
                }
            ]
        },
        {
            "title": "工作信息",
            "body": [
                {
                    "type": "form",
                    "title": "工作信息",
                    "controls": [
                        {
                            "type": "text",
                            "name": "cname",
                            "label": "公司名称："
                        },
                        {
                            "name": "caddress",
                            "type": "text",
                            "label": "公司地址："
                        }
                    ]
                }
            ]
        },
        {
            "title": "兴趣爱好",
            "body": [
                {
                    "type": "form",
                    "title": "兴趣爱好",
                    "controls": [
                        {
                            "type": "text",
                            "name": "interest1",
                            "label": "兴趣爱好1："
                        },
                        {
                            "name": "interest2",
                            "type": "text",
                            "label": "兴趣爱好2："
                        },
                        {
                            "name": "interest3",
                            "type": "text",
                            "label": "兴趣爱好3："
                        },
                        {
                            "name": "interest4",
                            "type": "text",
                            "label": "兴趣爱好4："
                        },
                        {
                            "name": "interest5",
                            "type": "text",
                            "label": "兴趣爱好5："
                        },
                        {
                            "name": "interest6",
                            "type": "text",
                            "label": "兴趣爱好6："
                        }
                    ]
                }
            ]
        }
    ]
}
```

## 属性表

| 属性名             | 类型                              | 默认值                              | 说明                 |
| ------------------ | --------------------------------- | ----------------------------------- | -------------------- |
| type               | `string`                          | `"anchor"`                          | 指定为 Anchor 渲染器 |
| className          | `string`                          |                                     | 外层 Dom 的类名      |
| linkClassName      | `string`                          |                                     | 导航 Dom 的类名      |
| sectionClassName   | `string`                          |                                     | 锚点区域 Dom 的类名  |
| links              | `Array`                           |                                     | links 内容           |
| active             | `string`                          |                                     | 需要定位的区域       |
| links[x].title     | `string`                          |                                     | 区域 标题            |
| links[x].href      | `string`                          |                                     | 区域 标识            |
| links[x].body      | [SchemaNode](../types/schemanode) |                                     | 区域 内容区          |
| links[x].className | `string`                          | `"bg-white b-l b-r b-b wrapper-md"` | 区域成员 样式        |
