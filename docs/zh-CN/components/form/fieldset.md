---
title: FieldSet 表单项集合
description:
type: 0
group: null
menuName: FieldSet
icon:
order: 20
---

FieldSet 是用于分组展示表单项的一种容器型组件，可以折叠。

## 基本用法

可以通过配置标题`title`和表单项数组`body`，实现多个表单项分组展示

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "fieldSet",
      "title": "基本配置",
      "body": [
        {
          "name": "text1",
          "type": "input-text",
          "label": "文本1"
        },

        {
          "name": "text2",
          "type": "input-text",
          "label": "文本2"
        }
      ]
    }
  ]
}
```

## 展示模式

可以通过设置`mode`调整展示模式，用法同 [Form 展示模式](./index#%E8%A1%A8%E5%8D%95%E5%B1%95%E7%A4%BA)

下面`group`我们配置了`"mode": "horizontal"`，观察显示情况

```schema: scope="body"
{
  "type": "form",
  "body": [
    {
        "type": "input-text",
        "name": "text",
        "label": "文本"
    },
    {
        "type": "divider"
    },
    {
      "type": "fieldSet",
      "title": "基本配置",
      "mode": "horizontal",
      "body": [
        {
          "name": "text1",
          "type": "input-text",
          "label": "文本1"
        },

        {
          "name": "text2",
          "type": "input-text",
          "label": "文本2"
        }
      ]
    }
  ]
}
```

## 可折叠

配置`"collapsable": true`可以实现点击标题折叠显隐表单项。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "fieldSet",
      "title": "基本配置",
      "collapsable": true,
      "body": [
        {
          "name": "text1",
          "type": "input-text",
          "label": "文本1"
        },

        {
          "name": "text2",
          "type": "input-text",
          "label": "文本2"
        }
      ]
    }
  ]
}
```

### 默认是否折叠

默认是展开的，如果想默认折叠，那么配置`"collapsed": true`默认折叠。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "fieldSet",
      "title": "基本配置",
      "collapsable": true,
      "collapsed": true,
      "body": [
        {
          "name": "text1",
          "type": "input-text",
          "label": "文本1"
        },

        {
          "name": "text2",
          "type": "input-text",
          "label": "文本2"
        }
      ]
    }
  ]
}
```

## 标题放底部

fieldSet 的另一种标题展现样式，不同的是展开的时候收起文本是在下方的，如果组件比较多的时候更容易收起。

设置 `"titlePosition": "bottom"`。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "fieldSet",
      "title": "展开更多设置",
      "collapseTitle": "收起设置",
      "titlePosition": "bottom",
      "collapsable": true,
      "collapsed": true,
      "body": [
        {
          "name": "text1",
          "type": "input-text",
          "label": "文本1"
        },

        {
          "name": "text2",
          "type": "input-text",
          "label": "文本2"
        }
      ]
    }
  ]
}
```

## 属性表

| 属性名           | 类型                                         | 默认值  | 说明                                                                       |
| ---------------- | -------------------------------------------- | ------- | -------------------------------------------------------------------------- |
| className        | `string`                                     |         | CSS 类名                                                                   |
| headingClassName | `string`                                     |         | 标题 CSS 类名                                                              |
| bodyClassName    | `string`                                     |         | 内容区域 CSS 类名                                                          |
| title            | [SchemaNode](../../../docs/types/schemanode) |         | 标题                                                                       |
| body             | Array<[表单项](./formitem)>                  |         | 表单项集合                                                                 |
| mode             | `string`                                     |         | 展示默认，同 [Form](./index#%E8%A1%A8%E5%8D%95%E5%B1%95%E7%A4%BA) 中的模式 |
| collapsable      | `boolean`                                    | `false` | 是否可折叠                                                                 |
| collapsed        | `booelan`                                    | `false` | 默认是否折叠                                                               |
| collapseTitle    | [SchemaNode](../../../docs/types/schemanode) | `收起`  | 收起的标题                                                                 |
| visibleOn        | [SchemaNode](../../../docs/types/schemanode) |         | 显示隐藏题                                                                 |
