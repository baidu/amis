---
title: Timeline 时间轴
description:
type: 0
group: ⚙ 组件
menuName: Timeline
icon:
order: 73
---

时间轴组件

## 基本用法

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "items": [
        {
          "time": "2019-02-07",
          "title": "节点数据",
          "detail": "error",
        },
        {
          "time": "2019-02-08",
          "title": "节点数据",
          "detail": "success",
        },
        {
          "time": "2019-02-09",
          "title": "节点数据",
          "detail": "error",
        }
      ]
    }
  ]
}
```

## 时间轴节点颜色设置

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "items": [
        {
          "time": "2019-02-07",
          "title": "节点数据",
          "color": "#ffb200",
        },
        {
          "time": "2019-02-08",
          "title": "节点数据",
          "color": "#4F86F4",
        },
        {
          "time": "2019-02-09",
          "title": "节点数据",
          "color": "success",
        },
        {
          "time": "2019-02-09",
          "title": "节点数据",
          "color": "warning",
        }
      ]
    }
  ]
}
```

## 时间轴节点图标设置

```schema
{
  "type": "page",
  "data": {
    "image": "https://suda.cdn.bcebos.com/images%2F2021-01%2Fsearch.svg"
  },
  "body": [
    {
      "type": "timeline",
      "items": [
        {
          "time": "2019-02-07",
          "title": "节点数据error",
          "detail": "error",
          "icon": "status-fail"
        },
        {
          "time": "2019-02-08",
          "title": "节点数据success",
          "detail": "success",
          "icon": "status-success"
        },
        {
          "time": "2019-02-09",
          "title": "节点数据(自定义图片)",
          "detail": "warning",
          "icon": "${image}"
        }
      ]
    }
  ]
}
```

## 节点标题自定义

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "items": [
        {
          "time": "2019-02-07",
          "title": [
            {
              "type": "text",
              "value": "2019年02月7日"
            },
            {
              "type": "button",
              "label": "查看",
              "actionType": "dialog",
              "level": "link",
              "dialog": {
                "title": "查看详情",
                "body": "这是详细内容。"
              }
            },
            {
              "type": "button",
              "label": "删除",
              "level": "link",
              "actionType": "dialog",
              "dialog": {
                "title": "删除",
                "body": "确认删除吗？"
              }
            }
          ]
        },
        {
          "time": "2019-02-10",
          "title": [
            {
              "type": "text",
              "value": "2019年02月10日"
            },
            {
              "type": "button",
              "label": "查看",
              "actionType": "dialog",
              "level": "link",
              "dialog": {
                "title": "查看详情",
                "body": "这是详细内容。"
              }
            },
            {
              "type": "button",
              "label": "删除",
              "level": "link",
              "actionType": "dialog",
              "dialog": {
                "title": "删除",
                "body": "确认删除吗？"
              }
            }
          ]
        },
      ]
    }
  ]
}
```

## 设置节点数据倒序

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      direction: "vertical",
      reverse: true,
      "items": [
        {
          "time": "2019-02-07",
          "title": "节点数据",
        },
        {
          "time": "2019-02-08",
          "title": "节点数据",
        },
        {
          "time": "2019-02-09",
          "title": "节点数据",
        },
        {
          "time": "2019-02-10",
          "title": "节点数据",
        },
      ]
    }
  ]
}
```

## 设置时间轴方向

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      direction: "horizontal",
      "items": [
        {
          "time": "2019-02-07",
          "title": "节点数据",
        },
        {
          "time": "2019-02-08",
          "title": "节点数据",
        },
        {
          "time": "2019-02-09",
          "title": "节点数据",
        },
        {
          "time": "2019-02-10",
          "title": "节点数据",
        },
      ]
    }
  ]
}
```

## 设置文字相对时间轴方向（时间轴横向时不支持）

### 文字位于时间轴左侧

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "mode": "left",
      "items": [
        {
          "time": "2019-02-07",
          "title": "节点数据",
          "detail": "error",
        },
        {
          "time": "2019-02-08",
          "title": "节点数据",
          "detail": "success",
        }
      ]
    },
  ]
}
```

### 文字交替位于时间轴两侧

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "mode": "alternate",
      "items": [
        {
          "time": "2019-02-07",
          "title": "节点数据",
          "detail": "error",
        },
        {
          "time": "2019-02-08",
          "title": "节点数据",
          "detail": "success",
        }
      ]
    }
  ]
}
```

### 文字位于时间轴右侧

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "mode": "right",
      "items": [
        {
          "time": "2019-02-07",
          "title": "节点数据",
          "detail": "error",
        },
        {
          "time": "2019-02-08",
          "title": "节点数据",
          "detail": "success",
        }
      ]
    },
  ]
}
```

## 远程数据

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "source": {
        "method": "get",
        "url": "/api/mock2/timeline/timelineItems"
      }


    }
  ]
}
```

"source": "/api/mock2/timeline/timelineItems",

远程拉取接口时，返回的数据结构除了需要满足 amis 接口要求的基本数据结构 以外，必须用"items"作为时间轴数据的 key 值，如下：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "items": [
      {
        "time": "2019-02-07",
        "title": "数据开发",
        "detail": "2019-02-07detail",
        "color": "#ffb200",
        "icon": "close"
      },
      {"time": "2019-02-08", "title": "管理中心", "detail": "2019-02-08detail"},
      {
        "time": "2019-02-09",
        "title": "SQL语句",
        "detail": "2019-02-09detail",
        "color": "warning"
      },
      {
        "time": "2019-02-10",
        "title": "一键部署",
        "detail": "2019-02-10detail",
        "icon": "compress-alt"
      },
      {"time": "2019-02-10", "title": "一键部署", "detail": "2019-02-11detail"},
      {
        "time": "2019-02-10",
        "title": "一键部署",
        "detail": "2019-02-12detail",
        "icon": "close"
      },
      {"time": "2019-02-10", "title": "一键部署", "detail": "2019-02-13detail"}
    ]
  }
}
```

## 属性表

| 属性名    | 类型                                  | 默认值     | 说明                                                        |
| --------- | ------------------------------------- | ---------- | ----------------------------------------------------------- | --- |
| type      | `string`                              |            | `"timeline"` 指定为 时间轴 渲染器                           |
| items     | Array<[timelineItem](#timeline.item)> | []         | 配置节点数据                                                |
| source    | [API](../../../docs/types/api)        |            | 数据源，可通过数据映射获取当前数据域变量、或者配置 API 对象 |
| mode      | `left` \| `right` \| `alternate`      | `right`    | 指定文字相对于时间轴的位置，仅 direction=vertical 时支持    |
| direction | `vertical` \| `horizontal`            | `vertical` | 时间轴方向                                                  |     |
| reverse   | `boolean`                             | `false`    | 根据时间倒序显示                                            |

### timeline.item

| 属性名              | 类型                                                    | 默认值    | 说明                                                        |
| ------------------- | ------------------------------------------------------- | --------- | ----------------------------------------------------------- |
| time                | `string `                                               |           | 节点时间                                                    |
| title               | `string \| [SchemaNode](../../docs/types/schemanode)`   |           | 节点标题                                                    |
| detail              | `string`                                                |           | 节点详细描述（折叠）                                        |
| detailCollapsedText | `string`                                                | `展开`    | 详细内容折叠时按钮文案                                      |
| detailExpandedText  | `string`                                                | `折叠`    | 详细内容展开时按钮文案                                      |
| color               | `string \| level样式（info、success、warning、danger）` | `#DADBDD` | 时间轴节点颜色                                              |
| icon                | `string`                                                |           | icon 名，支持 fontawesome v4 或使用 url（优先级高于 color） |
