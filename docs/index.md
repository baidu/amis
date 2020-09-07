---
title: 介绍
description: 介绍
type: 0
group: 💡 概念
menuName: 介绍
icon:
order: 8
---

## 什么是 amis

amis 是一个低代码前端框架，它使用 JSON 配置来生成页面，可以节省页面开发工作量，极大提升开发前端页面的效率。

## 为什么要做 amis？🤔

在经历了十几年的发展后，前端开发变得越来越复杂，门槛也越来越高，要使用当下流行的 UI 组件库，你必须懂 `npm`、`webpack`、`react/vue`，必须熟悉 `ES6` 语法，最好还了解状态管理（比如 `Redux`），如果没接触过函数式编程，一开始入门就很困难，而它还有巨大的 [生态](https://github.com/markerikson/redux-ecosystem-links)，相关的库有 **2347** 个。

然而前端技术的发展不会停滞，等学完这些后可能会发现大家都用 `Hooks` 了、某个打包工具取代 `Webpack` 了。。。

而有时候你只是为了做个普通的增删改查界面，用于系统管理，类似下面这种：

```schema:height="900"
{
  "title": "浏览器内核对 CSS 的支持情况",
  "remark": "嘿，不保证数据准确性",
  "type": "page",
  "body": {
    "type": "crud",
    "draggable": true,
    "syncLocation": false,
    "api": "https://houtai.baidu.com/api/sample",
    "keepItemSelectionOnPageChange": true,
    "filter": {
      "title": "筛选",
      "submitText": "",
      "controls": [
        {
          "type": "text",
          "name": "keywords",
          "placeholder": "关键字",
          "addOn": {
            "label": "搜索",
            "type": "submit"
          }
        }
      ]
    },
    "bulkActions": [
      {
        "label": "批量删除",
        "actionType": "ajax",
        "api": "delete:https://houtai.baidu.com/api/sample/${ids|raw}",
        "confirmText": "确定要批量删除?"
      },
      {
        "label": "批量修改",
        "actionType": "dialog",
        "dialog": {
          "title": "批量编辑",
          "name": "sample-bulk-edit",
          "body": {
            "type": "form",
            "api": "https://houtai.baidu.com/api/sample/bulkUpdate2",
            "controls": [
              {
                "type": "hidden",
                "name": "ids"
              },
              {
                "type": "text",
                "name": "engine",
                "label": "Engine"
              }
            ]
          }
        }
      }
    ],
    "quickSaveApi": "https://houtai.baidu.com/api/sample/bulkUpdate",
    "quickSaveItemApi": "https://houtai.baidu.com/api/sample/$id",
    "filterTogglable": true,
    "headerToolbar": [
      "filter-toggler",
      "bulkActions",
      {
        "type": "action",
        "label": "重置测试数据",
        "actionType": "ajax",
        "size": "sm",
        "api": "https://houtai.baidu.com/api/sample/reset"
      },
      {
        "type": "tpl",
        "tpl": "一共有 ${count} 行数据。",
        "className": "v-middle"
      },
      {
        "type": "columns-toggler",
        "align": "right"
      },
      {
        "type": "drag-toggler",
        "align": "right"
      },
      {
        "type": "pagination",
        "align": "right"
      }
    ],
    "footerToolbar": ["statistics", "switch-per-page", "pagination"],
    "columns": [
      {
        "name": "id",
        "label": "ID",
        "width": 20,
        "sortable": true,
        "type": "text"
      },
      {
        "name": "engine",
        "label": "Rendering engine",
        "sortable": true,
        "searchable": true,
        "type": "text",
        "remark": "Trident 就是 IE，Gecko 就是 Firefox"
      },
      {
        "name": "platform",
        "label": "Platform(s)",
        "popOver": {
          "body": {
            "type": "tpl",
            "tpl": "就是为了演示有个叫 popOver 的功能"
          }
        },
        "sortable": true,
        "type": "text"
      },
      {
        "name": "grade",
        "label": "CSS grade",
        "quickEdit": {
          "mode": "inline",
          "type": "select",
          "options": ["A", "B", "C", "D", "X"]
        },
        "type": "text"
      },
      {
        "type": "operation",
        "label": "操作",
        "width": 100,
        "buttons": [
          {
            "type": "button",
            "icon": "fa fa-times text-danger",
            "actionType": "ajax",
            "tooltip": "删除",
            "confirmText": "您确认要删除?",
            "api": "delete:https://houtai.baidu.com/api/sample/$id"
          }
        ]
      }
    ]
  }
}
```

这个界面虽然用 `Bootstrap` 也能快速搭起来，但要想体验好就需要加很多细节功能，比如：

- 数据动态加载
- 编辑单行数据
- 批量修改和删除
- 查询某列
- 按某列排序
- 隐藏某列
- 开启整页内容拖拽排序
- 表格有分页（页数还会同步到地址栏）
- 如果往下拖动还有首行冻结来方便查看表头等

全部实现这些需要大量的代码。

然而上面也看到了，在 amis 里只需要 **150** 行 JSON 配置（嘿，其中 40 多行只有一个括号），你不需要了解 `React/Vue`、`Webpack`，甚至不需要很了解 `JavaScript`，即便没学过 amis 也能猜到大部分配置的作用，只需要简单配置就能完成所有页面开发

这正是建立 amis 的初衷，我们认为：**对于大部分常用页面，应该使用最简单的方法来实现**，而不是越来越复杂。

## 用 JSON 写页面有什么好处 ❓

为了实现用最简单方式来生成大部分页面，amis 的解决方案是基于 JSON 来配置，它的独特好处是：

- **不需要懂前端**：在百度内部，大部分 amis 用户之前从来没写过前端页面，也不会 `JavaScript`，就能做出专业且复杂的后台界面，这是所有其他前端 UI 库都无法做到的；
- **不受前端技术更新的影响**：百度内部最老的 amis 页面是 4 年多前创建的，至今还在使用，而当年的 `Angular/Vue/React` 版本现在都废弃了，当年流行的 `Gulp` 也被 `Webpack` 取代了，如果这些页面不是用 amis，现在的维护成本会很高，同时还能享受 amis 升级带来的界面改进；
- 可以 **完全** 使用 [可视化页面编辑器](https://fex-team.github.io/amis-editor/#/edit/0) 来制作页面：一般前端可视化编辑器只能用来做静态原型，而 amis 可视化编辑器做出的页面是可以直接上线的。

> JSON 是一种轻量级的数据交换格式，简洁和清晰的层次结构使得它成为理想的数据交换语言。它易于人阅读和编写，同时也易于机器解析和生成，能够有效地提升网络传输效率。
>
> 更多关于 JSON 的知识，可以阅读 [百度百科](https://baike.baidu.com/item/JSON)

## amis 的其它亮点 ✨

- **提供完整的界面解决方案**：其它 UI 框架必须使用 JavaScript 来组装业务逻辑，而 amis 只需 JSON 配置就能完成完整功能开发，包括数据获取、表单提交及验证等功能；
- **内置 100+ 种 UI 组件**：包括其它 UI 框架都不会提供的富文本编辑器、代码编辑器等，能满足各种页面组件展现的需求，而且对于特殊的展现形式还可以通过 [自定义组件](./start/custom.md) 来扩充；
- **容器支持无限级嵌套**：可以通过组合来满足各种布局需求；
- **经历了长时间的实战考验**：amis 在百度内部得到了广泛使用，**在 4 年多的时间里创建了 3 万+ 页面**，从内容审核到机器管理，从数据分析到模型训练，amis 满足了各种各样的页面需求。

## amis 不适合做什么？😶

使用 JSON 有优点但也有明显缺点，在以下场合并不适合 amis：

- **大量定制 UI**：JSON 配置使得 amis 更适合做有大量常见 UI 组件的页面，但对于面向普通客户（toC）的页面，往往追求个性化的视觉效果，这种情况下用 amis 就不合适，实际上绝大部分前端 UI 组件库也都不适合，只能定制开发。
- **极为复杂或特殊的交互**：
  - 有些复杂的前端功能，比如 可视化编辑器，其中有大量定制的拖拽操作，这种需要依赖原生 DOM 实现的功能无法使用 amis。
  - 但对于某些交互固定的领域，比如图连线，amis 后续会有专门的组件来实现。

## 阅读建议 👆

- 如果你是第一次接触 amis 的新同学，那么请 **务必认真阅读完概念部分**，它会让你对 amis 有个整体的认识
- 如果你已经掌握 amis 基本概念，且有一定的开发经验，需要参考 amis 组件相关文档的同学，那么请移步 [组件文档](./components/component)

## 让我们马上开始吧！

点击页面底部的下一篇，继续阅读文档。
