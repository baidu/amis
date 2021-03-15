---
title: Elevator 电梯导航
description:
type: 0
group: ⚙ 组件
menuName: Elevator
icon:
order: 68
---

电梯导航容器组件。

## 基本用法

```schema: scope="body"
{
    "type": "elevator",
    "floors": [
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

默认想要显示多少楼层配置多少个 `floors` 成员即可。

## 默认定位到某个楼层

主要配置`active`属性来实现该效果，共有下面两种方法：

#### 配置 anchor 值

```schema: scope="body"
{
    "type": "elevator",
    "active": "work",
    "floors": [
        {
            "title": "基本信息",
            "anchor": "base",
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
            "anchor": "work",
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
            "anchor": "interest",
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

单个`floor`上不要配置`anchor`属性，配置需要展示的`floor`索引值，`0`代表第一个。

```schema: scope="body"
{
    "type": "elevator",
    "active": 1,
    "floors": [
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

| 属性名              | 类型                              | 默认值                              | 说明                   |
| ------------------- | --------------------------------- | ----------------------------------- | ---------------------- |
| type                | `string`                          | `"elevator"`                        | 指定为 Elevator 渲染器 |
| className           | `string`                          |                                     | 外层 Dom 的类名        |
| navClassName        | `string`                          |                                     | 导航 Dom 的类名        |
| floorClassName      | `string`                          |                                     | 楼层 Dom 的类名        |
| floors              | `Array`                           |                                     | floors 内容            |
| active              | `string`                          |                                     | 需要定位的楼层         |
| floors[x].title     | `string`                          |                                     | 楼层 标题              |
| floors[x].anchor    | `string`                          |                                     | 楼层 标识              |
| floors[x].body      | [SchemaNode](../types/schemanode) |                                     | 楼层 内容区            |
| floors[x].className | `string`                          | `"bg-white b-l b-r b-b wrapper-md"` | 楼层成员 区域样式      |
