---
title: Select 选择器
description:
type: 0
group: null
menuName: Select 选择器
icon:
order: 48
---

## 基本用法

参考 [Options](options)

## 自定义菜单

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "label": "选项",
            "type": "select",
            "name": "select",
            "menuTpl": "<div>${label} 值：${value}, 当前是否选中: ${checked}</div>",
            "options": [
                {
                    "label":"A",
                    "value":"a"
                },
                {
                    "label":"B",
                    "value":"b"
                },
                {
                    "label":"C",
                    "value":"c"
                }
            ]
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名          | 类型                                                                              | 默认值       | 说明                                                                                                                |
| --------------- | --------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| options         | `Array<object>`或`Array<string>`                                                  |              | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                                           |
| source          | [API](../../../docs/types/api) 或 [数据映射](../../../docs/concepts/data-mapping) |              | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                                        |
| autoComplete    | [API](../../../docs/types/api)                                                    |              | [自动提示补全](./options#%E8%87%AA%E5%8A%A8%E8%A1%A5%E5%85%A8-autocomplete)                                         |
| delimeter       | `string`                                                                          | `false`      | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                                           |
| labelField      | `string`                                                                          | `"label"`    | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield)                         |
| valueField      | `string`                                                                          | `"value"`    | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)                                    |
| joinValues      | `boolean`                                                                         | `true`       | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                                          |
| extractValue    | `boolean`                                                                         | `false`      | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)                                      |
| checkAll        | `boolean`                                                                         | `false`      | 是否支持全选                                                                                                        |
| checkAllLabel   | `string`                                                                          | `全选`       | 全选的文字                                                                                                          |
| checkAllBySearch | `boolean`                                                                         | `false`      | 有检索时只全选检索命中的项                                                                                          |
| defaultCheckAll | `boolean`                                                                         | `false`      | 默认是否全选                                                                                                        |
| creatable       | `boolean`                                                                         | `false`      | [新增选项](./options#%E5%89%8D%E7%AB%AF%E6%96%B0%E5%A2%9E-creatable)                                                |
| multiple        | `boolean`                                                                         | `false`      | [多选](./options#多选-multiple)                                                                                     |
| searchable      | `boolean`                                                                         | `false`      | [检索](./options#检索-searchable)                                                                                   |
| createBtnLabel  | `string`                                                                          | `"新增选项"` | [新增选项](./options#%E6%96%B0%E5%A2%9E%E9%80%89%E9%A1%B9)                                                          |
| addControls     | Array<[表单项](./formitem)>                                                       |              | [自定义新增表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%96%B0%E5%A2%9E%E8%A1%A8%E5%8D%95%E9%A1%B9-addcontrols)  |
| addApi          | [API](../../docs/types/api)                                                       |              | [配置新增选项接口](./options#%E9%85%8D%E7%BD%AE%E6%96%B0%E5%A2%9E%E6%8E%A5%E5%8F%A3-addapi)                         |
| editable        | `boolean`                                                                         | `false`      | [编辑选项](./options#%E5%89%8D%E7%AB%AF%E7%BC%96%E8%BE%91-editable)                                                 |
| editControls    | Array<[表单项](./formitem)>                                                       |              | [自定义编辑表单项](./options#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BC%96%E8%BE%91%E8%A1%A8%E5%8D%95%E9%A1%B9-editcontrols) |
| editApi         | [API](../../docs/types/api)                                                       |              | [配置编辑选项接口](./options#%E9%85%8D%E7%BD%AE%E7%BC%96%E8%BE%91%E6%8E%A5%E5%8F%A3-editapi)                        |
| removable       | `boolean`                                                                         | `false`      | [删除选项](./options#%E5%88%A0%E9%99%A4%E9%80%89%E9%A1%B9)                                                          |
| deleteApi       | [API](../../docs/types/api)                                                       |              | [配置删除选项接口](./options#%E9%85%8D%E7%BD%AE%E5%88%A0%E9%99%A4%E6%8E%A5%E5%8F%A3-deleteapi)                      |
| autoFill        | `object`                                                                          |              | [自动填充](./options#%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85-autofill)                                                 |
| menuTpl         | `string`                                                                          |              | 支持配置自定义菜单                                                                                                  |
| clearable       | `boolean`                                                                         |              | 单选模式下是否支持清空                                                                                              |
| hideSelected    | `boolean`                                                                   | `false`      | 隐藏已选选项
