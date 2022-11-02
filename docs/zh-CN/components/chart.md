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

```schema: scope="body"
{
    "type": "chart",
    "api": "/api/mock2/chart/chart",
    "interval": 5000
}
```

api 返回支持两种格式，一种是直接返回完整 echarts 配置，数据包含在配置里，具体格式请参考后面的静态数据写法，另一种是返回纯数据，具体请参考动态数据写法。

## 静态数据

在 `config` 里填写完整的 echarts 配置，这里的数据是静态的。

```schema: scope="body"
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
                    "api": "/api/mock2/chart/chart1"
                }
            ]
        }
    }
}
```

## 动态数据

如果要实现动态数据，需要在 config 中做调整，比如将前面的例子改成如下写法

```schema: scope="body"
{
    "type": "chart",
    "api": "/api/mock2/chart/chartData",
    "config": {
        "xAxis": {
            "type": "category",
            "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        },
        "yAxis": {
            "type": "value"
        },
        "series": [{
            "data": "${line}",
            "type": "line"
        }]
    }
}
```

其中 api 返回内容是如下写法，可以看到通过[数据映射](../../docs/concepts/data-mapping)语法，我们可以将 api 放回结果中的 line 字段作为折线的数据。

```json
{
  "status": 0,
  "msg": "ok",
  "data": {
    "line": [65, 63, 10, 73, 42, 21]
  }
}
```

除了 `config` 中的 `data`，`config` 里的其它属性也都支持数据映射，还能支持数据映射中的各种过滤器。

### 使用上层数据接口

有时候数据是在上层获取的，比如通过 service 中返回了数据，这时需要通过 `trackExpression` 来指定跟踪什么数据，比如下面的例子，数据是从 service 获取的就需要配置 `trackExpression`。

```schema: scope="body"
{
    "type": "service",
    "api": "/api/mock2/chart/chartData",
    "interval": 3000,
    "body": [
        {
            "type": "chart",
            "trackExpression": "${line}",
            "config": {
                "xAxis": {
                    "type": "category",
                    "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                },
                "yAxis": {
                    "type": "value"
                },
                "series": [{
                    "data": "${line}",
                    "type": "line"
                }]
            }
        }
    ]
}

```

## 配置图表点击行为

可以通过配置`"clickAction": {}`，来指定图表节点的点击行为，支持 amis 的 [行为](./action)。

然后在配置的行为中可以通过 [数据链](../../docs/concepts/datascope-and-datachain) 获取到 [echarts 鼠标事件](https://echarts.apache.org/zh/api.html#events.%E9%BC%A0%E6%A0%87%E4%BA%8B%E4%BB%B6.click) 的值，例如下面例子中可以通过`${value|json}`获取到点击节点的`传入的数据值`

> 点击下面坐标中的节点查看效果！

```schema: scope="body"
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
                    "api": "/api/mock2/chart/chart1"
                }
            ]
        }
    }
}
```

## 远程拉取动态配置项

配置`api`，来远程拉取图标配置

```schema: scope="body"
{
    "type": "chart",
    "api": "/api/mock2/chart/chart1"
}
```

## 通过组件间联动，更新图表

```schema: scope="body"
[
    {
        "type": "form",
        "title": "过滤条件",
        "target": "chart1,chart2",
        "submitOnInit": true,
        "className": "m-b",
        "wrapWithPanel": false,
        "mode": "inline",
        "body": [
            {
                "type": "input-date",
                "label": "开始日期",
                "name": "starttime",
                "value": "-8days",
                "maxDate": "${endtime}"
            },
            {
                "type": "input-date",
                "label": "结束日期",
                "name": "endtime",
                "value": "-1days",
                "minDate": "${starttime}"
            },
            {
                "type": "input-text",
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
                "api": "/api/mock2/chart/chart?name=$name&starttime=${starttime}&endtime=${endtime}"
            },
            {
                "type": "chart",
                "name": "chart2",
                "initFetch": false,
                "api": "/api/mock2/chart/chart2?name=$name"
            }
        ]
    }
]
```

## 对函数配置的特殊支持

ECharts 中有些配置项可以写函数，比如 formatter 和 sort，但在 JSON 里无法写函数，因此我们做了特殊支持，将看起来像函数的字符串转成了函数：

```schema: scope="body"
{
    "type": "chart",
    "config": {
        "legend": {
            "formatter": "function (name) { return 'Legend ' + name;}"
        },
        "dataset": {
            "source": [["type","2012","2013","2014","2015","2016"],["Forest",320,332,301,334,390],["Steppe",220,182,191,234,290],["Desert",150,232,201,154,190],["Wetland",98,77,101,99,40]]
        },
        "xAxis": {
            "type": "category",
            "axisTick": {
                "show": false
            }
        },
        "yAxis": {},
        "series": [{"type":"bar","seriesLayoutBy":"row"},{"type":"bar","seriesLayoutBy":"row"},{"type":"bar","seriesLayoutBy":"row"},{"type":"bar","seriesLayoutBy":"row"}]
    }
}
```

## 使用地图

从 amis 1.1.0 版本开始，ECharts 版本升级到 5.0.0，为了规避政策风险，在这个版本删除了之前的地图 geojson，如果需要这个功能需要手动引入。

方法是去 `https://github.com/apache/echarts/tree/master/test/data/map/js` 下载 `china.js` 和 `world.js`。

对于 npm 版本，直接 `import` 这两个文件就行。

对于 JS SDK 版本，需要先加入如下代码如下方式：

```javascript
window.echarts = amisRequire('echarts');
```

然后通过 script 标签引入这两个文件，或者用下面的新版方法

## 地图配置

> 2.4.1 及以上版本

新增了 `mapURL` 及 `mapName` 两个配置项

```schema: scope="body"
{
      "type": "chart",
      "mapURL": "/api/map/HK",
      "mapName": "HK",
      "height": 600,
      "config": {
        "title": {
          "text": "Population Density of Hong Kong （2011）",
          "subtext": "Data from Wikipedia"
        },
        "tooltip": {
          "trigger": "item",
          "formatter": "{b}<br/>{c} (p / km2)"
        },
        "toolbox": {
          "show": true,
          "orient": "vertical",
          "left": "right",
          "top": "center",
          "feature": {
            "dataView": {
              "readOnly": false
            },
            "restore": {},
            "saveAsImage": {}
          }
        },
        "visualMap": {
          "min": 800,
          "max": 50000,
          "text": [
            "High",
            "Low"
          ],
          "realtime": false,
          "calculable": true,
          "inRange": {
            "color": [
              "lightskyblue",
              "yellow",
              "orangered"
            ]
          }
        },
        "series": [
          {
            "name": "香港18区人口密度",
            "type": "map",
            "map": "HK",
            "label": {
              "show": true
            },
            "data": [
              {
                "name": "中西区",
                "value": 20057.34
              },
              {
                "name": "湾仔",
                "value": 15477.48
              },
              {
                "name": "东区",
                "value": 31686.1
              },
              {
                "name": "南区",
                "value": 6992.6
              },
              {
                "name": "油尖旺",
                "value": 44045.49
              },
              {
                "name": "深水埗",
                "value": 40689.64
              },
              {
                "name": "九龙城",
                "value": 37659.78
              },
              {
                "name": "黄大仙",
                "value": 45180.97
              },
              {
                "name": "观塘",
                "value": 55204.26
              },
              {
                "name": "葵青",
                "value": 21900.9
              },
              {
                "name": "荃湾",
                "value": 4918.26
              },
              {
                "name": "屯门",
                "value": 5881.84
              },
              {
                "name": "元朗",
                "value": 4178.01
              },
              {
                "name": "北区",
                "value": 2227.92
              },
              {
                "name": "大埔",
                "value": 2180.98
              },
              {
                "name": "沙田",
                "value": 9172.94
              },
              {
                "name": "西贡",
                "value": 3368
              },
              {
                "name": "离岛",
                "value": 806.98
              }
            ],
            "nameMap": {
              "Central and Western": "中西区",
              "Eastern": "东区",
              "Islands": "离岛",
              "Kowloon City": "九龙城",
              "Kwai Tsing": "葵青",
              "Kwun Tong": "观塘",
              "North": "北区",
              "Sai Kung": "西贡",
              "Sha Tin": "沙田",
              "Sham Shui Po": "深水埗",
              "Southern": "南区",
              "Tai Po": "大埔",
              "Tsuen Wan": "荃湾",
              "Tuen Mun": "屯门",
              "Wan Chai": "湾仔",
              "Wong Tai Sin": "黄大仙",
              "Yau Tsim Mong": "油尖旺",
              "Yuen Long": "元朗"
            }
          }
        ]
      }
    }
```

## 动态处理 echart 配置

echarts 的 config 一般是静态配置的，支持简单的数据映射。如果你觉得还不够灵活可以通过自己手写逻辑代码来完成配置。

通过配置 dataFiler 来处理。

```schema: scope="body"
{
    "type": "chart",
    "data": {
        "line": [65, 63, 10, 73, 42, 21],
        "line2": [22, 33, 90, 20, 11, 33]
    },
    "config": {
        "xAxis": {
            "type": "category",
            "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        },
        "yAxis": {
            "type": "value"
        }
    },
    "dataFilter": "config.series = [];Object.keys(data).forEach(function(key) {config.series.push({data: data[key], type: 'line'})})"
}
```

## 属性表

| 属性名             | 类型                                         | 默认值    | 说明                                                                                                                                                                                     |
| ------------------ | -------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type               | `string`                                     | `"chart"` | 指定为 chart 渲染器                                                                                                                                                                      |
| className          | `string`                                     |           | 外层 Dom 的类名                                                                                                                                                                          |
| body               | [SchemaNode](../../docs/types/schemanode)    |           | 内容容器                                                                                                                                                                                 |
| api                | [api](../../docs/types/api)                  |           | 配置项接口地址                                                                                                                                                                           |
| source             | [数据映射](../../docs/concepts/data-mapping) |           | 通过数据映射获取数据链中变量值作为配置                                                                                                                                                   |
| initFetch          | `boolean`                                    |           | 组件初始化时，是否请求接口                                                                                                                                                               |
| interval           | `number`                                     |           | 刷新时间(最小 1000)                                                                                                                                                                      |
| config             | `object` 或 `string`                         |           | 设置 eschars 的配置项,当为`string`的时候可以设置 function 等配置项                                                                                                                       |
| style              | `object`                                     |           | 设置根元素的 style                                                                                                                                                                       |
| width              | `string`                                     |           | 设置根元素的宽度                                                                                                                                                                         |
| height             | `string`                                     |           | 设置根元素的高度                                                                                                                                                                         |
| replaceChartOption | `boolean`                                    | `false`   | 每次更新是完全覆盖配置项还是追加？                                                                                                                                                       |
| trackExpression    | `string`                                     |           | 当这个表达式的值有变化时更新图表                                                                                                                                                         |
| dataFilter         | `string`                                     |           | 自定义 echart config 转换，函数签名：function(config, echarts, data) {return config;} 配置时直接写函数体。其中 config 是当前 echart 配置，echarts 就是 echarts 对象，data 为上下文数据。 |
| mapURL             | [api](../../docs/types/api)                  |           | 地图 geo json 地址                                                                                                                                                                       |
| mapName            | string                                       |           | 地图名称                                                                                                                                                                                 |

## 动作表

| 动作名称 | 动作配置                   | 说明                                       |
| -------- | -------------------------- | ------------------------------------------ |
| reload   | -                          | 刷新（重新加载）                           |
| setValue | `value: object` 更新的数据 | 更新数据，等于更新图表所依赖数据域中的变量 |
