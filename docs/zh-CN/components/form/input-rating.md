---
title: InputRating 评分
description:
type: 0
group: null
menuName: InputRating 评分
icon:
order: 37
---

## 基本用法

默认颜色

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-rating",
            "name": "rating",
            "label": "评分",
            "count": 5,
            "value": 3
        }
    ]
}
```

自定义颜色。支持各种颜色形式，如 CSS 预定义颜色，十六进制颜色，RGB 颜色，HSL 颜色。

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-rating",
            "name": "rating",
            "label": "评分",
            "count": 5,
            "value": 3,
            "colors": {
                "1": "gray",
                "2": "#678f8d",
                "3": "rgb(119, 168, 141)",
                "4": "hsl(147, 22%, 56%)",
                "5": "#ff6670"
            }
        }
    ]
}
```

## 半星

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-rating",
            "name": "rating",
            "label": "评分",
            "count": 5,
            "value": 3.5,
            "half": true
        }
    ]
}
```

## 带有文字

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-rating",
            "name": "rating",
            "label": "评分",
            "count": 5,
            "value": 3,
            "texts": {
                "1": "很差",
                "2": "较差",
                "3": "一般",
                "4": "较好",
                "5": "很好"
            },
            "textClassName": "okde"
        }
    ]
}
```

## 自定义字符

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-rating",
            "name": "rating",
            "label": "评分",
            "count": 5,
            "value": 3,
            "char": "好"
        }
    ]
}
```

## 只读

```schema: scope="body"
{
    "type": "form",
    "api": "/api/mock2/form/saveForm",
    "body": [
        {
            "type": "input-rating",
            "name": "rating",
            "label": "评分",
            "count": 5,
            "value": 3.6,
            "half": true,
            "readOnly": true,
            "texts": {
                "5": "3.6"
            }
        }
    ]
}
```

## 属性表

当做选择器表单项使用时，除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名        | 类型                | 默认值                                              | 说明                                                                                                            |
| ------------- | ------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| value         | `number`            | -                                                   | 当前值                                                                                                          |
| half          | `boolean`           | `false`                                             | 是否使用半星选择                                                                                                |
| count         | `number`            | `5`                                                 | 总星数                                                                                                          |
| readOnly      | `boolean`           | `false`                                             | 只读                                                                                                            |
| allowClear    | `boolean`           | `true`                                              | 是否允许再次点击后清除                                                                                          |
| colors        | `string` / `object` | `{'2': '#abadb1', '3': '#787b81', '5': '#ffa900' }` | 星星被选中的颜色。 若传入字符串，则只有一种颜色。若传入对象，可自定义分段，键名为分段的界限值，键值为对应的类名 |
| inactiveColor | `string`            | `#e7e7e8`                                           | 未被选中的星星的颜色                                                                                            |
| texts         | `object`            | -                                                   | 星星被选中时的提示文字。可自定义分段，键名为分段的界限值，键值为对应的类名                                      |
| textPosition  | `right` / `left`    | `right`                                             | 文字的位置                                                                                                      |
| char          | `string`            | `★`                                                 | 自定义字符                                                                                                      |
| className     | `string`            | -                                                   | 自定义样式类名                                                                                                  |
| charClassName | `string`            | -                                                   | 自定义字符类名                                                                                                  |
| textClassName | `string`            | -                                                   | 自定义文字类名                                                                                                  |
