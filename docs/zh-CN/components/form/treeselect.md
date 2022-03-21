---
title: TreeSelect 树形选择器
description:
type: 0
group: null
menuName: TreeSelect 树形选择器
icon:
order: 60
---

## 基本使用

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "tree-select",
      "name": "tree",
      "label": "Tree",
      "searchable": true,
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        },
        {
          "label": "Folder E",
          "children": [
            {
              "label": "Folder G",
              "children": [
                {
                  "label": "file H",
                  "value": 6
                },
                {
                  "label": "file I",
                  "value": 7
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## 仅展示选中节点文本信息

设置`hideNodePathLabel: true`，可以隐藏选择框中已选择节点的祖先节点（ancestor）的`labelField`字段值，仅展示当前选中节点的`labelField`字段值。

```schema: scope="body"
{
  "type": "form",
  "api": "/api/mock2/form/saveForm",
  "body": [
    {
      "type": "tree-select",
      "name": "tree1",
      "label": "展示已选择节点的祖先节点的文本信息",
      "value": "1,6,7",
      "multiple": true,
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        },
        {
          "label": "Folder E",
          "children": [
            {
              "label": "Folder G",
              "children": [
                {
                  "label": "file H",
                  "value": 6
                },
                {
                  "label": "file I",
                  "value": 7
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "divider"
    },
    {
      "type": "tree-select",
      "name": "tree2",
      "label": "仅展示已选择节点的文本信息",
      "value": "1,6,7",
      "multiple": true,
      "hideNodePathLabel": true,
      "options": [
        {
          "label": "Folder A",
          "value": 1,
          "children": [
            {
              "label": "file A",
              "value": 2
            },
            {
              "label": "file B",
              "value": 3
            }
          ]
        },
        {
          "label": "file C",
          "value": 4
        },
        {
          "label": "file D",
          "value": 5
        },
        {
          "label": "Folder E",
          "children": [
            {
              "label": "Folder G",
              "children": [
                {
                  "label": "file H",
                  "value": 6
                },
                {
                  "label": "file I",
                  "value": 7
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## 属性表

更多用法，见 [InputTree](./input-tree)

| 属性名            | 类型      | 默认值  | 说明                                        |
| ----------------- | --------- | ------- | ------------------------------------------- |
| hideNodePathLabel | `boolean` | `false` | 是否隐藏选择框中已选择节点的路径 label 信息 |


## 事件表

| 事件名称        | 事件参数                        | 说明                 |
|--------------- |------------------------        |----------------------|
| change         | value: `string` 更新后的数据     | 选中值更改 |
| add            | value: `string` 新增节点信息     | 新增选项 |
| edit           | value: `string` 编辑节点信息     | 编辑选项 |
| delete         | value: `string` 删除节点信息     | 删除选项 |
| loadFinished   | value: `json` 懒加载返回的数据    | 懒加载完成触发 |
| blur           | -                              | 输入框失去焦点|
| focus          | -                              | 输入框获取焦点  |


## 动作表

| 动作名称        | 动作配置                 | 说明                 |
|----------------|------------------------ |---------------------|
| clear          | -                       | 清除数据 |
| reset          | -                       | 重置数据 |