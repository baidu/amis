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
      "label": "<b>当前页面</b>"
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
        "label": "<b>当前页面</b>"
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
      "label": "首页",
      "href": "https://baidu.gitee.com/",
      "icon": "fa fa-home"
    },

    {
      "label": "上级页面"
    },

    {
      "label": "<b>当前页面</b>"
    }
  ]
}
```

## 属性表

| 属性名             | 类型     | 默认值 | 说明             |
| ------------------ | -------- | ------ | ---------------- |
| className          | `string` |        | 外层类名         |
| itemClassName      | `string` |        | 每个面包屑的类名 |
| separatorClassName | `string` |        | 分割符的类名     |
| separator          | `string` |        | 分隔符           |
| source             | `string` |        | 动态数据         |
| items[].label      | `string` |        | 显示文本         |
| items[].href       | `string` |        | 链接地址         |
| items[].icon       | `string` |        | [图标](icon)     |
