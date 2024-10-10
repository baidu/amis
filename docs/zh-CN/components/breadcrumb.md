---
title: Breadcrumb 面包屑
description:
type: 0
group: ⚙ 组件
menuName: Breadcrumb
icon:
order: 30
---

## 基本用法

```schema: scope="body"
{
  "type": "breadcrumb",
  "items": [
    {
      "label": "首页",
      "href": "https://baidu.gitee.com/",
      "icon": "fa fa-home"
    },

    {
      "label": "上级页面"
    },

    {
      "label": "当前页面"
    }
  ]
}
```

## 动态数据

可以配置 source 来获取上下文中的动态数据，结合 [service](service) 来实现动态生成。

```schema
{
  "type": "page",
  "data": {
    "breadcrumb": [
      {
        "label": "首页",
        "href": "https://baidu.gitee.com/"
      },

      {
        "label": "上级页面"
      },

      {
        "label": "当前页面"
      }
    ]
  },
  "body": {
    "type": "breadcrumb",
    "source": "${breadcrumb}"
  }
}
```

## 分隔符

```schema: scope="body"
{
  "type": "breadcrumb",
  "separator": ">",
  "separatorClassName": "text-black",
  "items": [
    {
      "href": "https://baidu.gitee.com/",
      "icon": "fa fa-home"
    },

    {
      "label": "上级页面"
    },

    {
      "label": "当前页面"
    }
  ]
}
```

## 下拉菜单

```schema: scope="body"
{
  "type": "breadcrumb",
  "separator": ">",
  "separatorClassName": "text-black",
  "items": [
    {
      "label": "首页",
      "href": "https://baidu.gitee.com/",
      "icon": "fa fa-home"
    },

    {
      "label": "上级页面",
      "dropdown": [
        {
          "label": "选项一",
          "href": "https://baidu.gitee.com/",
        },
        {
          "label": "选项二"
        }
      ]
    },
    {
      "label": "当前页面"
    }
  ]
}
```

## 最大展示长度

```schema: scope="body"
{
  "type": "breadcrumb",
  "separator": ">",
  "separatorClassName": "text-black",
  "labelMaxLength": 16,
  "tooltipPosition": "top",
  "items": [
    {
      "href": "https://baidu.gitee.com/",
      "icon": "fa fa-home"
    },

    {
      "label": "上级页面上级页面上级页面上级页面上级页面"
    },

    {
      "label": "当前页面"
    }
  ]
}
```

## 属性表

| 属性名              | 类型                             | 默认值         | 说明                                                  |
| ------------------ | -------------------------------- | ------------- | ---------------------------------------------------- |
| className          | `string`                         |               | 外层类名                                              |
| itemClassName      | `string`                         |               | 导航项类名                                             |
| separatorClassName | `string`                         |               | 分割符类名                                             |
| dropdownClassName  | `string`                         |               | 下拉菜单类名                                           |
| dropdownItemClassName | `string`                      |               | 下拉菜单项类名                                         |
| separator          | `string`                         |               | 分隔符                                                |
| labelMaxLength     | `number`                         | 16            | 最大展示长度                                           |
| tooltipPosition    | `top \| bottom \| left \| right` | `top`         | 浮窗提示位置                                           |
| source             | `string`                         |               | 动态数据                                              |
| items[].label      | `string`                         |               | 文本                                                  |
| items[].href       | `string`                         |               | 链接                                                  |
| items[].icon       | `string`                         |               | [图标](icon)                                          |
| items[].dropdown   | `dropdown[]`                     |               | 下拉菜单，dropdown[]的每个对象都包含label、href、icon属性  |
