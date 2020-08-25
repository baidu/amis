---
title: Chart 图表
description:
type: 0
group: ⚙ 组件
menuName: Chart 图标
icon:
order: 34
---

图表渲染器，采用 echarts 渲染，配置格式跟 echarts 相同，[echarts 配置文档](https://echarts.apache.org/zh/option.html#title)

## 基本用法

```schema:height="350" scope="body"
{
    "type": "chart",
    "api": "https://houtai.baidu.com/api/mock2/chart/chart",
    "interval": 5000
}
```

## 配置静态配置项

通过配置`"config": {}`，可以配置`echarts`配置

```schema:height="350" scope="body"
{
    "type": "chart",
    "config": {
        "title": {
            "text": "极坐标双数值轴"
        },
        "legend": {
            "data": [
                "line"
            ]
        },
        "polar": {
            "center": [
                "50%",
                "54%"
            ]
        },
        "tooltip": {
            "trigger": "axis",
            "axisPointer": {
                "type": "cross"
            }
        },
        "angleAxis": {
            "type": "value",
            "startAngle": 0
        },
        "radiusAxis": {
            "min": 0
        },
        "series": [
            {
                "coordinateSystem": "polar",
                "name": "line",
                "type": "line",
                "showSymbol": false,
                "data": [
                    [
                        0,
                        0
                    ],
                    [
                        0.03487823687206265,
                        1
                    ],
                    [
                        0.06958655048003272,
                        2
                    ],
                    [
                        0.10395584540887964,
                        3
                    ],
                    [
                        0.13781867790849958,
                        4
                    ],
                    [
                        0.17101007166283433,
                        5
                    ],
                    [
                        0.2033683215379001,
                        6
                    ],
                    [
                        0.2347357813929454,
                        7
                    ],
                    [
                        0.26495963211660245,
                        8
                    ],
                    [
                        0.2938926261462365,
                        9
                    ],
                    [
                        0.3213938048432697,
                        10
                    ]
                ]
            }
        ],
        "animationDuration": 2000
    },
    "clickAction": {
        "actionType": "dialog",
        "dialog": {
            "title": "详情",
            "body": [
                {
                    "type": "tpl",
                    "tpl": "<span>当前选中值 ${value|json}<span>"
                },
                {
                    "type": "chart",
                    "api": "https://houtai.baidu.com/api/mock2/chart/chart1"
                }
            ]
        }
    }
}
```

## 配置图表点击行为

可以通过配置`"clickAction": {}`，来指定图表节点的点击行为，支持 amis 的[行为](./action)。

> 点击下面坐标中的节点查看效果！

```schema:height="350" scope="body"
{
    "type": "chart",
    "config": {
        "title": {
            "text": "极坐标双数值轴"
        },
        "legend": {
            "data": [
                "line"
            ]
        },
        "polar": {
            "center": [
                "50%",
                "54%"
            ]
        },
        "tooltip": {
            "trigger": "axis",
            "axisPointer": {
                "type": "cross"
            }
        },
        "angleAxis": {
            "type": "value",
            "startAngle": 0
        },
        "radiusAxis": {
            "min": 0
        },
        "series": [
            {
                "coordinateSystem": "polar",
                "name": "line",
                "type": "line",
                "showSymbol": false,
                "data": [
                    [
                        0,
                        0
                    ],
                    [
                        0.03487823687206265,
                        1
                    ],
                    [
                        0.06958655048003272,
                        2
                    ],
                    [
                        0.10395584540887964,
                        3
                    ],
                    [
                        0.13781867790849958,
                        4
                    ],
                    [
                        0.17101007166283433,
                        5
                    ],
                    [
                        0.2033683215379001,
                        6
                    ],
                    [
                        0.2347357813929454,
                        7
                    ],
                    [
                        0.26495963211660245,
                        8
                    ],
                    [
                        0.2938926261462365,
                        9
                    ],
                    [
                        0.3213938048432697,
                        10
                    ]
                ]
            }
        ],
        "animationDuration": 2000
    },
    "clickAction": {
        "actionType": "dialog",
        "dialog": {
            "title": "详情",
            "body": [
                {
                    "type": "tpl",
                    "tpl": "<span>当前选中值 ${value|json}<span>"
                },
                {
                    "type": "chart",
                    "api": "https://houtai.baidu.com/api/mock2/chart/chart1"
                }
            ]
        }
    }
}
```

## 远程拉取动态配置项

配置`api`，来远程拉取图标配置

```schema:height="350" scope="body"
{
    "type": "chart",
    "api": "https://houtai.baidu.com/api/mock2/chart/chart1"
}
```

## 通过组件间联动，更新图表

```schema:height="350" scope="body"
[
    {
        "type": "form",
        "title": "过滤条件",
        "target": "chart1,chart2",
        "submitOnInit": true,
        "className": "m-b",
        "wrapWithPanel": false,
        "mode": "inline",
        "controls": [
            {
                "type": "date",
                "label": "开始日期",
                "name": "starttime",
                "value": "-8days",
                "maxDate": "${endtime}"
            },
            {
                "type": "date",
                "label": "结束日期",
                "name": "endtime",
                "value": "-1days",
                "minDate": "${starttime}"
            },
            {
                "type": "text",
                "label": "条件",
                "name": "name",
                "addOn": {
                    "type": "submit",
                    "label": "搜索",
                    "level": "primary"
                }
            }
        ],
        "actions": []
    },
    {
        "type": "divider"
    },
    {
        "type": "grid",
        "className": "m-t-lg",
        "columns": [
            {
                "type": "chart",
                "name": "chart1",
                "initFetch": false,
                "api": "https://houtai.baidu.com/api/mock2/chart/chart?name=$name&starttime=${starttime}&endtime=${endtime}"
            },
            {
                "type": "chart",
                "name": "chart2",
                "initFetch": false,
                "api": "https://houtai.baidu.com/api/mock2/chart/chart2?name=$name"
            }
        ]
    }
]
```

## 属性表

| 属性名             | 类型                                 | 默认值    | 说明                                                               |
| ------------------ | ------------------------------------ | --------- | ------------------------------------------------------------------ |
| type               | `string`                             | `"chart"` | 指定为 chart 渲染器                                                |
| className          | `string`                             |           | 外层 Dom 的类名                                                    |
| body               | [SchemaNode](../types/schemanode)    |           | 内容容器                                                           |
| api                | [api](../types/api)                  |           | 配置项接口地址                                                     |
| source             | [数据映射](../concepts/data-mapping) |           | 通过数据映射获取数据链中变量值作为配置                             |
| initFetch          | `boolean`                            |           | 组件初始化时，是否请求接口                                         |
| interval           | `number`                             |           | 刷新时间(最低 3000)                                                |
| config             | `object` 或 `string`                 |           | 设置 eschars 的配置项,当为`string`的时候可以设置 function 等配置项 |
| style              | `object`                             |           | 设置根元素的 style                                                 |
| width              | `string`                             |           | 设置根元素的宽度                                                   |
| height             | `string`                             |           | 设置根元素的高度                                                   |
| replaceChartOption | `boolean`                            | `false`   | 每次更新是完全覆盖配置项还是追加？                                 |
