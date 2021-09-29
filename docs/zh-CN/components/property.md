---
title: Property 属性表
description:
type: 0
group: ⚙ 组件
menuName: Property 属性表
icon:
order: 60
---

使用表格的方式显示只读信息，如产品详情页。

## 基本用法

```schema: scope="body"
{
  "type": "property",
  "title": "机器配置",
  "items": [
    {
      "label": "cpu",
      "content": "1 core"
    },
    {
      "label": "memory",
      "content": "4G"
    },
    {
      "label": "disk",
      "content": "80G"
    },
    {
      "label": "network",
      "content": "4M",
      "span": 2
    },
    {
      "label": "IDC",
      "content": "beijing"
    },
    {
      "label": "Note",
      "content": "其它说明",
      "span": 3
    }
  ]
}
```

## 简易模式

默认是表格模式，还可以通过 `"mode"="simple"` 改成简易模式，在这种模式下没有边框，属性名和值是通过 `separator` 来分隔

```schema: scope="body"
{
  "type": "property",
  "mode": "simple",
  "separator": "：",
  "items": [
    {
      "label": "cpu",
      "content": "1 core"
    },
    {
      "label": "memory",
      "content": "4G"
    },
    {
      "label": "disk",
      "content": "80G"
    },
    {
      "label": "network",
      "content": "4M",
      "span": 2
    },
    {
      "label": "IDC",
      "content": "beijing"
    },
    {
      "label": "Note",
      "content": "其它说明",
      "span": 3
    }
  ]
}
```

## 使用其它展现

`label` 和 `content` 均支持使用 `amis` 其它渲染组件，比如

```schema: scope="body"
{
  "type": "property",
  "items": [
    {
      "label": "tpl",
      "content": {
        "type": "tpl",
        "tpl": "1 <b>Core</b>"
      }
    },
    {
      "label": "icon",
      "content": {
        "type": "icon",
        "icon": "microchip"
      }
    },
    {
      "label": "图片",
      "content": {
        "type": "image",
        "src": "https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80"
      }
    }
  ]
}
```

## 动态内容

属性表本身没有数据获取功能，需要结合 [service](./service) 来获取数据，下面的例子为了方便就直接放 page 下的 data 中了，它的效果和用 service 是一样的。

动态内容有两种情况：

1. label 固定、content 不同
2. label 和 content 都不确定

第一种情况只需要在 content 里使用变量即可，因为可以用任意 amis 节点。

```schema
{
  "type": "page",
  "data": {
    "cpu": "1 core",
    "memory": "4G",
    "disk": "80G"
  },
  "body": {
    "type": "property",
    "items": [
      {
        "label": "cpu",
        "content": "${cpu}"
      },
      {
        "label": "memory",
        "content": "${memory}"
      },
      {
        "label": "disk",
        "content": "${disk}"
      }
    ]
  }
}
```

第二种情况需要使用 `source` 属性来获取上下文中的内容。

```schema
{
  "type": "page",
  "data": {
    "items": [
      {
        "label": "cpu",
        "content": "1 core"
      },
      {
        "label": "memory",
        "content": "4G"
      },
      {
        "label": "disk",
        "content": "80G"
      },
      {
        "label": "network",
        "content": "4M",
        "span": 2
      },
      {
        "label": "IDC",
        "content": "beijing"
      },
      {
        "label": "Note",
        "content": "其它说明",
        "span": 3
      }
    ]
  },
  "body": {
    "type": "property",
    "source": "${items}"
  }
}
```

## 样式控制

通过 `labelStyle` 和 `contentStyle` 来控制属性名和属性值的样式，比如水平及垂直方向的对齐方式：

```schema: scope="body"
{
  "type": "property",
  "labelStyle": {
    "textAlign": "left",
    "verticalAlign": "top"
  },
  "contentStyle": {
    "verticalAlign": "top"
  },
  "items": [
    {
      "label": "cpu",
      "content": "1 core"
    },
    {
      "label": "memory",
      "content": "4G"
    },
    {
      "label": "disk",
      "content": {
        "type": "tpl",
        "tpl": "C: 80G<br/>D: 1T<br/>E: 2T</pre>"
      }
    },
    {
      "label": "network",
      "content": "4M",
      "span": 2
    },
    {
      "label": "IDC",
      "content": "beijing"
    },
    {
      "label": "Note",
      "content": "其它说明",
      "span": 3
    }
  ]
}
```

如果是简易模式，因为合并到一个单元格中了，因此只能通过 `contentStyle` 设置单元格样式，`labelStyle` 只能设置属性名文本的样式。

```schema: scope="body"
{
  "type": "property",
  "mode": "simple",
  "labelStyle": {
    "fontWeight": "bold",
    "textTransform": "capitalize"
  },
  "contentStyle": {
    "verticalAlign": "top"
  },
  "items": [
    {
      "label": "cpu",
      "content": "1 core"
    },
    {
      "label": "memory",
      "content": "4G"
    },
    {
      "label": "disk",
      "content": {
        "type": "tpl",
        "tpl": "C: 80G<br/>D: 1T<br/>E: 2T</pre>"
      }
    },
    {
      "label": "network",
      "content": "4M",
      "span": 2
    },
    {
      "label": "IDC",
      "content": "beijing"
    },
    {
      "label": "Note",
      "content": "其它说明",
      "span": 3
    }
  ]
}
```

## 显示列数

通过 `column` 来控制一行显示几列，默认是 3 列，下面示例是改成 2 列的效果

```schema: scope="body"
{
  "type": "property",
  "column": 2,
  "items": [
    {
      "label": "cpu",
      "content": "1 core"
    },
    {
      "label": "memory",
      "content": "4G"
    },
    {
      "label": "disk",
      "content": "80G"
    },
    {
      "label": "IDC",
      "content": "beijing"
    },
    {
      "label": "network",
      "content": "4M",
      "span": 2
    },
    {
      "label": "Note",
      "content": "其它说明",
      "span": 2
    }
  ]
}
```

## 隐藏某个属性值

items 里的属性还支持 `visibleOn` 和 `hiddenOn` 表达式，能隐藏部分属性，如果有空间后续组件会自动补上来，如下示例的 memory 隐藏了：

```schema: scope="body"
{
  "type": "property",
  "items": [
    {
      "label": "cpu",
      "content": "1 core"
    },
    {
      "label": "memory",
      "content": "4G",
      "visibleOn": "data.cpu > 1"
    },
    {
      "label": "network",
      "content": "4M",
      "span": 2
    }
  ]
}
```

## 属性表

| 属性名            | 类型                                     | 默认值  | 说明                                   |
| ----------------- | ---------------------------------------- | ------- | -------------------------------------- |
| className         | `string`                                 |         | 外层 dom 的类名                        |
| style             | `object`                                 |         | 外层 dom 的样式                        |
| labelStyle        | `object`                                 |         | 属性名的样式                           |
| contentStyle      | `object`                                 |         | 属性值的样式                           |
| column            | `number`                                 | 3       | 每行几列                               |
| mode              | `string`                                 | 'table' | 显示模式，目前只有 'table' 和 'simple' |
| separator         | `string`                                 | ','     | 'simple' 模式下属性名和值之间的分隔符  |
| items[].label     | `SchemaTpl`                              |         | 属性名                                 |
| items[].content   | `SchemaTpl`                              |         | 属性值                                 |
| items[].span      | `SchemaTpl`                              |         | 属性值跨几列                           |
| items[].visibleOn | [表达式](../../docs/concepts/expression) |         | 显示表达式                             |
| items[].hiddenOn  | [表达式](../../docs/concepts/expression) |         | 隐藏表达式                             |
