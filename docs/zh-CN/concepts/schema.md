---
title: 配置与组件
description: 配置与组件
type: 0
group: 💡 概念
menuName: 配置与组件
icon:
order: 9
---

## 最简单的 amis 配置

一个最简单的 amis 配置看起来是这样的：

```json
{
  "type": "page",
  "body": "Hello World!"
}
```

请观察上面的代码，这是一段 JSON，它的含义是：

1. `type` 是 amis 节点中最重要的字段，它告诉 amis 当前节点需要渲染的是`Page`组件。
2. 而 `body` 字段会作为 `Page` 组件的属性，`Page` 组件根据这个值来渲染页面内容。

这段配置的效果如下所示：

```schema:height="100"
{
  "type": "page",
  "body": "Hello World!"
}
```

上面这个配置是可以**实时修改预览**的，尝试改一下 `Hello World!` 的值。

> 不过这个实时预览功能对于某些属性不生效，如果发现不符合预期，需要复制 JSON，打开另一个页面后粘贴。

## 组件

上面提到，`type`字段会告诉 amis 当前节点渲染的组件为`Page`，组件节点的配置永远都是由 **`type`字段** （用于标识当前是哪个组件）和 **属性** 构成的。

```
{
  "type": "xxx",
  ...其它属性
}
```

## 组件树

这次我们看一个稍微复杂一点的配置：

```json
{
  "type": "page",
  "body": {
    "type": "tpl",
    "tpl": "Hello World!"
  }
}
```

该配置渲染页面如下：

```schema:height="100"
{
  "type": "page",
  "body": {
    "type": "tpl",
    "tpl": "Hello World!"
  }
}
```

最终效果和前面的示例一样，但这次 `Page` 组件的 `body` 属性值配置了一个对象，**通过`type`指明`body`内容区内会渲染一个叫`Tpl`的组件**，它是一个模板渲染组件。

在 `body` 中除了配置对象，还可以是数组，比如下面的例子:

```schema:height="320" scope="body"
[
    {
      "type": "tpl",
      "tpl": "Hello World!"
    },
    {
        "type": "divider"
    },
    {
      "type": "form",
      "controls": [
        {
          "type": "text",
          "name": "name",
          "label": "姓名"
        }
      ]
    }
]
```

可以看到通过数组的形式，增加了 `divider` 和 `form` 组件。

除了 `Page` 之外，还有很多**容器型**的组件都有 `body` 属性，通过这种树形结构，amis 就能实现复杂页面制作。

> **注意：**
>
> `Page`是 amis 页面配置中 **必须也是唯一的顶级节点**

### 通过树形来实现复杂页面

下面这个页面就是通过树形组合出来的，大体结构是这样：

```
Page
  ├── Toolbar
  │  └─ Form 顶部表单项
  ├── Grid // 用于水平布局
  │  ├─ Panel
  │  │  └─ Tabs
  │  │    └─ Chart
  │  └─ Panel
  │     └─ Chart
  └── CRUD
```

```schema:height="500"
{
  "type": "page",
  "toolbar": [{
    "type": "form",
    "panelClassName": "mb-0",
    "title": "",
    "controls": [{
      "type": "select",
      "label": "区域",
      "name": "businessLineId",
      "selectFirst": true,
      "mode": "inline",
      "options": ["北京", "上海"],
      "checkAll": false
    }, {
      "label": "时间范围",
      "type": "date-range",
      "name": "dateRange",
      "inline": true,
      "value": "-1month,+0month",
      "inputFormat": "YYYY-MM-DD",
      "format": "YYYY-MM-DD",
      "closeOnSelect": true,
      "clearable": false
    }],
    "actions": [],
    "mode": "inline",
    "target": "mainPage",
    "submitOnChange": true,
    "submitOnInit": true
  }],
  "body": [{
    "type": "grid",
    "columns": [
      {
        "type": "panel",
        "className": "h-full",
        "body": {
          "type": "tabs",
          "tabs": [{
            "title": "消费趋势",
            "tab": [{
              "type": "chart",
              "config": {
                "title": {
                  "text": "消费趋势"
                },
                "tooltip": {},
                "xAxis": {
                  "type": "category",
                  "boundaryGap": false,
                  "data": ["一月", "二月", "三月", "四月", "五月", "六月"]
                },
                "yAxis": {},
                "series": [{
                  "name": "销量",
                  "type": "line",
                  "areaStyle": {
                    "color": {
                      "type": "linear",
                      "x": 0,
                      "y": 0,
                      "x2": 0,
                      "y2": 1,
                      "colorStops": [{
                        "offset": 0,
                        "color": "rgba(84, 112, 197, 1)"
                      }, {
                        "offset": 1,
                        "color": "rgba(84, 112, 197, 0)"
                      }],
                      "global": false
                    }
                  },
                  "data": [5, 20, 36, 10, 10, 20]
                }]
              }
            }]
          }, {
            "title": "账户余额",
            "tab": "0"
          }]
        }
      }, {
      "type": "panel",
      "className": "h-full",
      "body": [{
        "type": "chart",
        "config": {
          "title": {
            "text": "使用资源占比"
          },
          "series": [{
            "type": "pie",
            "data": [{
              "name": "BOS",
              "value": 70
            }, {
              "name": "CDN",
              "value": 68
            }, {
              "name": "BCC",
              "value": 48
            }, {
              "name": "DCC",
              "value": 40
            }, {
              "name": "RDS",
              "value": 32
            }]
          }]
        }
      }]
    }]
  }, {
    "type": "crud",
    "className": "m-t-sm",
    "api": "https://houtai.baidu.com/api/sample",
    "columns": [{
      "name": "id",
      "label": "ID"
    }, {
      "name": "engine",
      "label": "Rendering engine"
    }, {
      "name": "browser",
      "label": "Browser"
    }, {
      "name": "platform",
      "label": "Platform(s)"
    }, {
      "name": "version",
      "label": "Engine version"
    }, {
      "name": "grade",
      "label": "CSS grade"
    }]
  }]
}
```
