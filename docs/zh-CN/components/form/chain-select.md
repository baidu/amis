---
title: Chain-Select 链式下拉框
description:
type: 0
group: null
menuName: Chain-Select
icon:
order: 7
---

## 基本用法

用于实现无限级别下拉，只支持单选，且必须和 `source` 搭配，通过 API 拉取数据，只要 API 有返回结果，就能一直无限级别下拉。

```schema: scope="body"
{
    "type": "form",
    "debug": true,
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/form/saveForm",
    "controls": [
        {
            "name": "select3",
            "type": "chained-select",
            "label": "级联下拉",
            "source": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/options/chainedOptions?waitSeconds=1&parentId=$parentId&level=$level&maxLevel=4",
            "value": "a,b"
        }
    ]
}
```

> `source`接口中配置的参数`waitSeconds=1`和`maxLevel=4`是测试接口所需参数，实际使用自己接口时不需要添加这两个参数

## 暴露参数

为了帮助后端接口获取当前选择器状态，chained-select 会默认给 source 接口的数据域中，添加若干个参数：

- `value`: 选中的表单项值；
- `level`: 当前拉取数据时的层级,
- `parentId`: 上一级选项的值，数据格式基于配置的`joinValues`和`extractValue`属性
- `parent`: 上一级选项的完整的数据格式

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名       | 类型                                      | 默认值    | 说明                                                                                        |
| ------------ | ----------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| options      | `Array<object>`或`Array<string>`          |           | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| source       | `string`或 [API](../../../docs/types/api) |           | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| autoComplete | `string`或 [API](../../../docs/types/api) |           | [自动选中](./options#%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8-autocomplete)                     |
| delimiter    | `string`                                  | `,`       | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                   |
| labelField   | `boolean`                                 | `"label"` | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField   | `boolean`                                 | `"value"` | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues   | `boolean`                                 | `true`    | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue | `boolean`                                 | `false`   | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
