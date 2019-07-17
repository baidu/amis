### Input-Group

输入框组合选择器，可用于输入框与其他多个组件组合。

-   `type` 请设置成 `input-group`
-   `controls` 表单项集合
-   更多配置请参考 [FormItem](./FormItem.md)

```schema:height="250" scope="form"
[
    {
        "type": "input-group",
        "name": "input-group",
        "inline": true,
        "label": "input 组合",
        "controls": [
            {
                "type": "text",
                "placeholder": "搜索作业ID/名称",
                "inputClassName": "b-r-none p-r-none",
                "name": "input-group"
            },
            {
                "type": "submit",
                "label": "搜索",
                "level": "primary"
            }
        ]
    },
    {
        "type": "input-group",
        "label": "各种组合",
        "inline": true,
        "controls": [
            {
                "type": "select",
                "name": "memoryUnits",
                "options": [
                    {
                        "label": "Gi",
                        "value": "Gi"
                    },
                    {
                        "label": "Mi",
                        "value": "Mi"
                    },
                    {
                        "label": "Ki",
                        "value": "Ki"
                    }
                ],
                "value": "Gi"
            },
            {
                "type": "text",
                "name": "memory"
            },
            {
                "type": "select",
                "name": "memoryUnits2",
                "options": [
                    {
                        "label": "Gi",
                        "value": "Gi"
                    },
                    {
                        "label": "Mi",
                        "value": "Mi"
                    },
                    {
                        "label": "Ki",
                        "value": "Ki"
                    }
                ],
                "value": "Gi"
            },
            {
                "type": "button",
                "label": "Go"
            }
        ]
    }
]
```