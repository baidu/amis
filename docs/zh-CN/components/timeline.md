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
      type: 'timeline',
      direction: 'vertical',
      items: [
        {
          time: '2019-02-07',
          title: '图片集说明',
          detail:
            '图片集展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像Service、Form或CRUD这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过source属性，获取数据链中的数据，完成数据展示。'
        },
        {
          time: '2019-02-08',
          title: '卡片组说明',
          detail:
            '卡片展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像Service这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过source属性，获取数据链中的数据，完成数据展示。'
        },
        {
          time: '2019-02-09',
          title: '宫格导航说明',
          detail:
            '宫格菜单导航，不支持配置初始化接口初始化数据域，所以需要搭配类似像Service、Form或CRUD这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过source属性，获取数据链中的数据，完成菜单展示。'
        },
        {
          time: '2019-02-10',
          title: '表格展现说明',
          detail:
            '通过表格的方式来展现数据，和 table 的不同之处：数据源要求不同：table 的数据源需要是多行的数据，最典型的就是来自某个数据库的表，table view 的数据源可以来自各种固定的数据，比如单元格的某一列是来自某个变量。功能不同：table 只能用来做数据表的展现，table view 除了展现复杂的报表，还能用来进行布局。合并单元格方式不同：table 的合并单元格需要依赖数据，table view 的合并单元格是手动指定的，因此可以支持不规则的数据格式。'
        }
      ]
    }
  ]
}
```

## 时间轴节点颜色设置

支持设置自定义节点颜色，或者使用内置的颜色值。内置颜色值有：`success`, `warning`, `danger`, `info`。

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
          "backgroundColor": "#eeb739"
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

## 时间轴节点的位置、隐藏、大小配置

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "items": [
        {
          "time": "2019-02-07",
          title: '图片集说明',
          detail:
            '图片集展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像Service、Form或CRUD这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过source属性，获取数据链中的数据，完成数据展示。',
          align: 'bottom',
          dotSize: 'xl',
        },
        {
          "time": "2019-02-08",
          title: '卡片组说明',
          detail:
            '卡片展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像Service这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过source属性，获取数据链中的数据，完成数据展示。',
          align: 'center',
          dotSize: 'lg',
        },
        {
          "time": "2019-02-09",
          title: '宫格导航说明',
          detail:
            '宫格菜单导航，不支持配置初始化接口初始化数据域，所以需要搭配类似像Service、Form或CRUD这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过source属性，获取数据链中的数据，完成菜单展示。',
          "color": "success",
          "hideDot": true,
        },
        {
          "time": "2019-02-09",
          title: '表格展现说明',
          detail:
            '通过表格的方式来展现数据，和 table 的不同之处：数据源要求不同：table 的数据源需要是多行的数据，最典型的就是来自某个数据库的表，table view 的数据源可以来自各种固定的数据，比如单元格的某一列是来自某个变量。功能不同：table 只能用来做数据表的展现，table view 除了展现复杂的报表，还能用来进行布局。合并单元格方式不同：table 的合并单元格需要依赖数据，table view 的合并单元格是手动指定的，因此可以支持不规则的数据格式。',
          "color": "warning",
          dotSize: 'sm',
        }
      ]
    },
    {
      "type": "timeline",
      direction: 'horizontal',
      "items": [
        {
          "time": "2019-02-07",
          title: '图片集说明',
          detail:
            '图片集展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像Service、Form或CRUD这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过source属性，获取数据链中的数据，完成数据展示。',
          align: 'left',
          dotSize: 'xl',
        },
        {
          "time": "2019-02-08",
          title: '卡片组说明',
          detail:
            '卡片展示，不支持配置初始化接口初始化数据域，所以需要搭配类似像Service这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过source属性，获取数据链中的数据，完成数据展示。',
          align: 'right',
          dotSize: 'lg',
        },
        {
          "time": "2019-02-09",
          title: '宫格导航说明',
          detail:
            '宫格菜单导航，不支持配置初始化接口初始化数据域，所以需要搭配类似像Service、Form或CRUD这样的，具有配置接口初始化数据域功能的组件，或者手动进行数据域初始化，然后通过source属性，获取数据链中的数据，完成菜单展示。',
          "color": "success",
          "hideDot": true,
        },
        {
          "time": "2019-02-09",
          title: '表格展现说明',
          detail:
            '通过表格的方式来展现数据，和 table 的不同之处：数据源要求不同：table 的数据源需要是多行的数据，最典型的就是来自某个数据库的表，table view 的数据源可以来自各种固定的数据，比如单元格的某一列是来自某个变量。功能不同：table 只能用来做数据表的展现，table view 除了展现复杂的报表，还能用来进行布局。合并单元格方式不同：table 的合并单元格需要依赖数据，table view 的合并单元格是手动指定的，因此可以支持不规则的数据格式。',
          "color": "warning",
          dotSize: 'sm',
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
          "icon": "fail"
        },
        {
          "time": "2019-02-08",
          "title": "节点数据success",
          "detail": "success",
          "icon": "success"
        },
        {
          "time": "2019-02-09",
          "title": "节点数据(自定义图片)",
          "detail": "warning",
          "icon": "${image}",
        }
      ]
    },{
      "type": "timeline",
      "direction": "horizontal",
      "items": [
        {
          "time": "2019-02-07",
          "title": "节点数据error",
          "detail": "error",
          "icon": "fail"
        },
        {
          "time": "2019-02-08",
          "title": "节点数据success",
          "detail": "success",
          "icon": "success"
        },
        {
          "time": "2019-02-09",
          "title": "节点数据(自定义图片)",
          "detail": "warning",
          "icon": "${image}",
        }
      ]
    }
  ]
}
```

## 时间轴分段颜色设置

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "items": [
        {
          "time": "2019-02-07",
          "title": "节点数据error",
          "detail": "error",
          "icon": "fail",
          "lineColor": "#2e86d3",
        },
        {
          "time": "2019-02-08",
          "title": "节点数据success",
          "detail": "success",
          "icon": "success",
          "lineColor": "#2ee414",
        },
        {
          "time": "2019-02-09",
          "title": "节点数据(自定义图片)",
          "detail": "warning",
          "lineColor": "#e45c14",
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
          "dotSize": "xl"
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

## 设置文字相对时间轴方向

### 纵向

#### 文字位于时间轴左侧

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

#### 文字交替位于时间轴两侧

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

#### 文字位于时间轴右侧

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

### 横向

#### 时间标题位于时间轴上侧

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "mode": "top",
      "direction": "horizontal",
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

#### 时间标题位于时间轴下侧

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "mode": "bottom",
      "direction": "horizontal",
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

#### 时间标题和内容交替位于时间轴两侧

```schema
{
  "type": "page",
  "body": [
    {
      "type": "timeline",
      "mode": "alternate",
      "direction": "horizontal",
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

## 时间轴内容支持卡片展示

```schema
{
  "type": "page",
  "body": [
    {
      type: 'timeline',
      mode: 'alternate',
      direction: 'horizontal',
      items: [
        {
          cardSchema: {
            type: 'card',
            href: 'https://github.com/baidu/amis',
            header: {
              title: '标题',
              subTitle: '副标题',
              description: '这是一段描述',
              avatarText: 'AMIS'
            },
            body: '这里是内容'
          }
        },
        {
          time: '2019-02-08',
          cardSchema: {
            type: 'card',
            href: 'https://github.com/baidu/amis',
            header: {
              title: '标题',
              subTitle: '副标题',
              description: '这是一段描述',
              avatarText: 'AMIS'
            },
            body: '这里是内容'
          }
        },
        {
          time: '2019-02-09',
          title: '表格展现说明',
          detail:
            '通过表格的方式来展现数据，和 table 的不同之处：数据源要求不同：table 的数据源需要是多行的数据，最典型的就是来自某个数据库的表，table view 的数据源可以来自各种固定的数据，比如单元格的某一列是来自某个变量。功能不同：table 只能用来做数据表的展现，table view 除了展现复杂的报表，还能用来进行布局。合并单元格方式不同：table 的合并单元格需要依赖数据，table view 的合并单元格是手动指定的，因此可以支持不规则的数据格式。'
        }
      ]
    }
  ]
}
```

如果当前所有节点均需要以卡片形式展示，可以通过 timeline 节点增加 `cardSchema`以统一卡片渲染模板。在这种情况下，每个 `timelineItem`内的数据都可以作为数据引用，在 `cardSchema` 中引用展示。

```schema
{
  type: 'page',
  data: {
    content: '这里是卡片主体内容，在所有的卡片都会展示'
  },
  body: {
    type: 'timeline',
    mode: 'alternate',
    direction: 'horizontal',
    cardSchema: {
      type: 'card',
      href: 'https://github.com/baidu/amis',
      header: {
        title: '${title}',
        subTitle: '${time}',
        description: '${detail}'
      },
      body: '${content}'
    },
    items: [
      {
        cardSchema: {
          type: 'card',
          href: 'https://github.com/baidu/amis',
          header: {
            title: '标题',
            subTitle: '副标题',
            description: '这是一段描述',
            avatarText: 'AMIS'
          },
          body: '这里是内容'
        }
      },
      {
        time: '2019-02-08',
        title: '卡片组说明',
        detail:
          'Content'
      },
      {
        time: '2019-02-09',
        title: '表格展现说明',
        detail:
          'Content'
      }
    ]
  }
}
```

## 动态数据

### 远程数据

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

### 数据域变量配置

> 3.4.0 及以上版本

```schema
{
  "type": "page",
  "data": {
    "items": [
      {
        "title": "First",
        "time": "this is subTitle",
        "detail": "this is description"
      },
      {
        "title": "Second"
      },
      {
        "title": "Last"
      }
    ]
  },
  "body": [
    {
      "type": "timeline",
      "source": "${items}"
    }
  ]
}
```

```schema
{
  "type": "page",
  "data": {
    "items":
      {
        "First": "this is subTitle",
        "detail": "this is description",
        "title": "Second"
      }
  }
  ,
  "body": [
    {
      "type": "timeline",
      "source": "${items}"
    }
  ]
}
```

## 属性表

| 属性名          | 类型                                                                              | 默认值         | 说明                                                                                                                                                                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type            | `string`                                                                          |                | `"timeline"` 指定为 时间轴 渲染器                                                                                                                                                                                                                                                |
| items           | Array<[timelineItem](#timeline.item)>                                             | []             | 配置节点数据                                                                                                                                                                                                                                                                     |
| source          | [API](../../../docs/types/api) 或 [数据映射](../../../docs/concepts/data-mapping) |                | 数据源，可通过数据映射获取当前数据域变量、或者配置 API 对象                                                                                                                                                                                                                      |
| mode            | `left` \| `right` \| `alternate` \| `top` \| `bottom`                             | ` right``top ` | 可选。支持时间在左/上展示，标题和内容在右/下展示，以及时间和内容交错方向展示。left / right 在 direction 为 vertical 时生效，top / bottom 在 direction 为 vertical 时生效。(v6.11.0 以前版本只有 vertical 支持，horizontal 不支持设置模式)                                        |
| direction       | `vertical` \| `horizontal`                                                        | `vertical`     | 时间轴方向                                                                                                                                                                                                                                                                       |
| reverse         | `boolean`                                                                         | `false`        | 根据时间倒序显示                                                                                                                                                                                                                                                                 |
| iconClassName   | `string`                                                                          |                | 统一配置的节点图标 CSS 类（3.4.0 版本支持）名                                                                                                                                                                                                                                    |
| timeClassName   | `string`                                                                          |                | 统一配置的节点时间 CSS 类（3.4.0 版本支持）名                                                                                                                                                                                                                                    |
| titleClassName  | `string`                                                                          |                | 统一配置的节点标题 CSS 类（3.4.0 版本支持）名                                                                                                                                                                                                                                    |
| detailClassName | `string`                                                                          |                | 统一配置的节点详情 CSS 类（3.4.0 版本支持）名                                                                                                                                                                                                                                    |
| cardSchema      | `string`                                                                          |                | 统一配置子节点渲染卡片模板。配置后  itemTitleSchema、titleClassName、detailClassName 将不生效。配置后 timeline item 中的数据都将可以在 cardSchema 中通过数据方式引用。如果子节点也配置了 cardSchema，子节点的 cardSchema 优先级高于 timeline 的 cardSchema。（v6.12.1 之后支持） |

### timeline.item

| 属性名              | 类型                                                    | 默认值         | 说明                                                                                                                                                              |
| ------------------- | ------------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| time                | `string `                                               |                | 节点时间                                                                                                                                                          |
| title               | `string` \| [SchemaNode](../../docs/types/schemanode)   |                | 节点标题                                                                                                                                                          |
| detail              | `string`                                                |                | 节点详细描述（折叠）                                                                                                                                              |
| detailCollapsedText | `string`                                                | `展开`         | 详细内容折叠时按钮文案                                                                                                                                            |
| detailExpandedText  | `string`                                                | `折叠`         | 详细内容展开时按钮文案                                                                                                                                            |
| color               | `string \| level样式（info、success、warning、danger）` | `#DADBDD`      | 时间轴节点颜色                                                                                                                                                    |
| backgroundColor     | `string`                                                | `#070c14`      | 时间点圆圈后部阴影颜色。（v6.11.1 版本支持）                                                                                                                      |
| icon                | `string`                                                |                | icon 名，支持 fontawesome v4 或使用 url（优先级高于 color）                                                                                                       |
| iconClassName       | `string`                                                |                | 节点图标的 CSS 类名（优先级高于统一配置的 iconClassName ，（3.4.0 版本支持））                                                                                    |
| timeClassName       | `string`                                                |                | 节点时间的 CSS 类名（优先级高于统一配置的 timeClassName，（3.4.0 版本支持））                                                                                     |
| titleClassName      | `string`                                                |                | 节点标题的 CSS 类名（优先级高于统一配置的 titleClassName，（3.4.0 版本支持））                                                                                    |
| detailClassName     | `string`                                                |                | 节点详情的 CSS 类名（优先级高于统一配置的 detailClassName，（3.4.0 版本支持））                                                                                   |
| dotSize             | `sm` \| `md` \| `lg` \| `xl`                            | `md`           | 当前节点大小。（v6.11.1 版本支持                                                                                                                                  |
| lineColor           | `string`                                                | `#e6e6e8`      | 连线颜色。（v6.11.1 版本支持）                                                                                                                                    |
| hideDot             | `boolean`                                               | `false`        | 是否隐藏当前节点的圆圈。（v6.11.1 版本支持）                                                                                                                      |
| align               | `left` \| `center` \| `right` \| `top` \| `bottom`      | `center` `top` | 圆点的对齐方式。水平排列时，可选值为 left center right，默认为 center;垂直排列时，可选值为 top bottom center，默认为 top。（v6.11.1 版本支持）                    |
| cardSchema          | `CardSchema`                                            |                | 卡片展示配置，如果传入则以卡片形式展示，传入对象转为卡片展示，传入的 time、title、detail 及相关属性将被忽略，只有连线配置和节点圆圈配置生效。（v6.11.1 版本支持） |
