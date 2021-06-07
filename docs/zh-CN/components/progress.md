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

需要同时开启显示背景间隔才能看出来

```schema
{
    "type": "page",
    "body": {
        "type": "progress",
        "stripe": true,
        "animate": true,
        "value": 60
    }
}
```

## 属性表

| 属性名               | 类型            | 默认值                                                               | 说明                                                                                   |
| -------------------- | --------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| type                 | `string`        |                                                                      | 如果在 Table、Card 和 List 中，为`"color"`；在 Form 中用作静态展示，为`"static-color"` |
| className            | `string`        |                                                                      | 外层 CSS 类名                                                                          |
| progressClassName    | `string`        | `progress-xs progress-striped active m-b-none`                       | 进度调 CSS 类名                                                                        |
| progressBarClassName | `string`        |                                                                      | 完成进度条 CSS 类名                                                                    |
| value                | `string`        |                                                                      | 进度值                                                                                 |
| placeholder          | `string`        | `-`                                                                  | 占位文本                                                                               |
| showLabel            | `boolean`       | `true`                                                               | 是否展示进度文本                                                                       |
| strip                | `boolean`       | ` false`                                                             | 背景是否显示条纹                                                                       |
| animate              | `boolean`       | `false`                                                              | 背景条纹是否有动画                                                                     |
| map                  | `Array<string>` | `['bg-danger', 'bg-warning', 'bg-info', 'bg-success', 'bg-success']` | 进度颜色映射                                                                           |
