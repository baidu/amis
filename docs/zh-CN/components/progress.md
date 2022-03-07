---
title: Progress 进度条
description:
type: 0
group: ⚙ 组件
menuName: Progress 进度条
icon:
order: 60
---

## 基本用法

```schema
{
    "type": "page",
    "body": {
        "type": "progress",
        "value": 60
    }
}
```

## 颜色映射

可以配置`map`，指定颜色映射，例如，默认的 map 配置为：`['bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success']`

它意味着将进度条分成了 5 份，`前20%`将会添加`bg-danger` css 类名到进度条上，`20%~40%`，将会添加`bg-warning`，以此类推，你可以自定义`map`来配置想要的进度效果

```schema
{
    "type": "page",
    "body": [
        {
            "type": "progress",
            "value": 40,
            "map": ["bg-danger", "bg-success"]
        },
        {
            "type": "divider"
        },
        {
            "type": "progress",
            "value": 60,
            "map": ["bg-danger", "bg-success"]
        },
        {
            "type": "divider"
        },
        {
            "type": "progress",
            "value": 60,
            "map": ["bg-danger", "bg-success"],
            "mode": "circle"
        },
        {
            "type": "divider"
        },
        {
            "type": "progress",
            "value": 10,
            "map": ["bg-danger", "bg-success"],
            "mode": "circle"
        }
    ]
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
                "progress": 20
            },
            {
                "id": "2",
                "progress": 40
            },
            {
                "id": "3",
                "progress": 60
            }
        ]
    },
    "columns": [
        {
            "name": "id",
            "label": "Id"
        },

        {
            "name": "progress",
            "label": "进度",
            "type": "progress"
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
        "progress": 60
    },
    "body": [
        {
            "type": "static-progress",
            "name": "progress",
            "label": "进度"
        }
    ]
}
```

## 显示背景间隔

```schema
{
    "type": "page",
    "body": {
        "type": "progress",
        "stripe": true,
        "value": 60
    }
}
```

## 显示动画

需要条形进度条才生效

```schema
{
    "type": "page",
    "body": [
      {
          "type": "progress",
          "animate": true,
          "value": 60
      },
      {
          "type": "divider"
      },
      {
          "type": "progress",
          "animate": true,
          "value": 60,
          "stripe": true
      }
    ]
}
```

## 圆形进度条

```schema
{
    "type": "page",
    "body": {
        "type": "progress",
        "value": 60,
        "mode": "circle"
    }
}
```

## 仪表盘进度条

可设置缺口位置和缺口角度

```schema
{
    "type": "page",
    "body": {
        "type": "progress",
        "value": 60,
        "mode": "dashboard",
        "gapDegree": 22,
        "gapPosition": "bottom"
    }
}
```

## 圆形进度条设置线条宽度

可设置 strokeWidth 调整线条宽度

```schema
{
    "type": "page",
    "body": {
        "type": "progress",
        "value": 60,
        "mode": "dashboard",
        "strokeWidth": 3
    }
}
```

## 自定义格式输出内容

```schema
{
    "type": "page",
    "body": {
        "type": "progress",
        "mode": "circle",
        "value": 60,
        "valueTpl": "${value}个"
    }
}
```

## 属性表

| 属性名               | 类型            | 默认值                                                               | 说明                                              |
| -------------------- | --------------- | -------------------------------------------------------------------- | ------------------------------------------------- |
| type                 | `string`        |                                                                      | 如果在 Form 中用作静态展示，为`"static-progress"` |
| mode                 | `string`        | `line`                                                               | 进度「条」的类型，可选`line circle dashboard`     |
| className            | `string`        |                                                                      | 外层 CSS 类名                                     |
| progressClassName    | `string`        | `progress-xs progress-striped active m-b-none`                       | 进度条 CSS 类名                                   |
| progressBarClassName | `string`        |                                                                      | 完成进度条 CSS 类名                               |
| value                | `string`        |                                                                      | 进度值                                            |
| placeholder          | `string`        | `-`                                                                  | 占位文本                                          |
| showLabel            | `boolean`       | `true`                                                               | 是否展示进度文本                                  |
| stripe               | `boolean`       | `false`                                                              | 背景是否显示条纹                                  |
| animate              | `boolean`       | `false`                                                              | type 为 line，可支持动画                          |
| map                  | `Array<string>` | `['bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success']` | 进度颜色映射                                      |
| valueTpl             | `string`        | `${value}%`                                                          | 自定义格式化内容                                  |
| strokeWidth          | `number`        | line 类型为`10`，circle、dashboard 类型为`6`                         | 进度条线宽度                                      |
| gapDegree            | `number`        | `75`                                                                 | 仪表盘缺角角度，可取值 0 ~ 295                    |
| gapPosition          | `string`        | `bottom`                                                             | 仪表盘进度条缺口位置，可选`top bottom left right` |
