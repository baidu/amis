---
title: Service 功能容器
description:
type: 0
group: null
menuName: Service
icon:
order: 49
---

## 基本用法

```schema: scope="body"
{
    "type": "form",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
        {
            "type": "service",
            "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData",
            "controls": [
                {
                    "type": "text",
                    "label": "时间",
                    "name": "date"
                }
            ]
        }
    ]
}
```

上例中我们在`text`表单项外，嵌套一层 service，用于初始化该表单项

> 一般初始化表单项是使用 form 的`initApi`配置，当你需要多个接口来初始化一个表单中的表单项时，可以考虑使用 service

## 作为 FormItem 的不同点

除了支持非表单项时的[Service](../service)的功能以外。作为 FormItem 使用时最大的不同在于作为容器渲染器，他的孩子是优先用表单项还是非表单项。

比如放置一个 `{type: 'text'}`，是渲染一个文本输入框、还是一个文本展示？

两种应该都存在可能，所以作为表单项的 Service, 有两种用法，当把孩子节点放在 `controls` 里面时输出表单项，如果放在 `body` 底下时输出非表单项。

### 放在 body 属性下，输出纯展示类组件

```schema: scope="form-item"
{
    "type": "service",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData",
    "body": {
        "type": "text",
        "text": "现在是：${date}"
    }
}
```

### 放在 controls 属性下，输出表单项

```schema: scope="form-item"
{
    "type": "service",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/page/initData",
    "controls": [
      {
          "type": "text",
          "label": "文本输入",
          "name": "a"
      },

      {
        "type": "date",
        "label": "日期",
        "name": "date",
        "format": "YYYY-MM-DD"
      }
    ]
}
```

## 接口联动

Service 中的`api`和`schemaApi`都支持**接口联动**。

下面例子中，`数据模板`下拉框的值变化后，会触发 service 重新拉取 api 接口，从而更新数据源，变化表单项的值，更多用法查看 [接口联动](../../concepts/linkage#%E6%8E%A5%E5%8F%A3%E8%81%94%E5%8A%A8)。

```schema: scope="body"
{
  "title": "",
  "type": "form",
  "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock/saveForm?waitSeconds=1",
  "mode": "horizontal",
  "controls": [
    {
      "label": "数据模板",
      "type": "select",
      "name": "tpl",
      "value": "tpl1",
      "size": "sm",
      "options": [
        {
          "label": "模板1",
          "value": "tpl1"
        },
        {
          "label": "模板2",
          "value": "tpl2"
        },
        {
          "label": "模板3",
          "value": "tpl3"
        }
      ],
      "description": "<span class=\"text-danger\">修改下拉选择器查看效果</span>"
    },
    {
      "type": "service",
      "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/initData?tpl=${tpl}",
      "controls": [
        {
          "label": "名称",
          "type": "text",
          "name": "name"
        },
        {
          "label": "作者",
          "type": "text",
          "name": "author"
        },
        {
          "label": "请求时间",
          "type": "datetime",
          "name": "date"
        }
      ]
    }
  ],
  "actions": []
}
```

## 动态渲染表单项

默认 Service 可以通过配置`schemaApi` [动态渲染页面内容](../service#%E5%8A%A8%E6%80%81%E6%B8%B2%E6%9F%93%E9%A1%B5%E9%9D%A2)，但是如果想渲染表单项，请返回下面这种格式：

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "controls": [
      {
        "type": "text",
        "name": "text",
        "label": "文本输入"
      }
    ]
  }
}
```

例如下例：

```schema: scope="form-item"
{
  "type": "service",
  "schemaApi": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/service/schema?type=controls"
}
```

`schemaApi` 除了能返回表单项之外，还能同时返回表单数据，如果你这样返回接口

```json
{
  "status": 0,
  "msg": "",
  "data": {
    "data": {
      "a": "b" // 这样返回的选项会选中第二个选项B
    },
    "controls": [
      {
        "type": "select",
        "name": "a",
        "label": "选项",
        "options": [
          {"label": "A", "value": "a"},
          {"label": "B", "value": "b"}
        ]
      }
    ]
  }
}
```
