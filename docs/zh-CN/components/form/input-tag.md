---
title: InputTag 标签选择器
description:
type: 0
group: null
menuName: InputTag 标签选择器
icon:
order: 55
---

## 基本使用

```schema: scope="body"
{
    "type": "form",
    "body": [
        {
            "type": "input-tag",
            "name": "tag",
            "label": "标签",
            "options": [
                "Aaron Rodgers",
                "Tom Brady",
                "Charlse Woodson",
                "Aaron Jones"
            ]
        }
    ]
}
```

## 属性表

除了支持 [普通表单项属性表](./formitem#%E5%B1%9E%E6%80%A7%E8%A1%A8) 中的配置以外，还支持下面一些配置

| 属性名       | 类型                                      | 默认值               | 说明                                                                                        |
| ------------ | ----------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------- |
| options      | `Array<object>`或`Array<string>`          |                      | [选项组](./options#%E9%9D%99%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-options)                   |
| optionsTip   | `Array<object>`或`Array<string>`          | `"最近您使用的标签"` | 选项提示                                                                                    |
| source       | `string`或 [API](../../../docs/types/api) |                      | [动态选项组](./options#%E5%8A%A8%E6%80%81%E9%80%89%E9%A1%B9%E7%BB%84-source)                |
| delimiter    | `string`                                  | `false`              | [拼接符](./options#%E6%8B%BC%E6%8E%A5%E7%AC%A6-delimiter)                                   |
| labelField   | `string`                                  | `"label"`            | [选项标签字段](./options#%E9%80%89%E9%A1%B9%E6%A0%87%E7%AD%BE%E5%AD%97%E6%AE%B5-labelfield) |
| valueField   | `string`                                  | `"value"`            | [选项值字段](./options#%E9%80%89%E9%A1%B9%E5%80%BC%E5%AD%97%E6%AE%B5-valuefield)            |
| joinValues   | `boolean`                                 | `true`               | [拼接值](./options#%E6%8B%BC%E6%8E%A5%E5%80%BC-joinvalues)                                  |
| extractValue | `boolean`                                 | `false`              | [提取值](./options#%E6%8F%90%E5%8F%96%E5%A4%9A%E9%80%89%E5%80%BC-extractvalue)              |
| clearable    | `boolean`                                 | `false`              | 在有值的时候是否显示一个删除图标在右侧。                                                    |
| resetValue   | `string`                                  | `""`                 | 删除后设置此配置项给定的值。                                                                |
