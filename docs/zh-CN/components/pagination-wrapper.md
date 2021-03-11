---
title: PaginationWrapper 分页容器
description:
type: 0
group: ⚙ 组件
menuName: PaginationWrapper
icon:
order: 59
---

分页容器组件，可以用来对已有列表数据做分页处理。

- 输入：默认读取作用域中的 items 变量，如果是其他变量名请配置 `inputName`。
- 输出：经过分页处理后会把分页后的数据下发给 `outputName` （默认也是 items）对应的数据。

```schema: scope="body"
{
    "type": "service",
    "api": "https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/mock2/crud/table",
    "body": [
        {
            "type": "pagination-wrapper",
            "inputName": "rows",
            "outputName": "rows",
            "perPage": 2,
            "body": [
                {
                    "type": "table",
                    "title": "分页表格",
                    "source": "${rows}",
                    "columns": [
                        {
                            "name": "engine",
                            "label": "Engine"
                        },
                        {
                            "name": "version",
                            "label": "Version"
                        }
                    ]
                }
            ]
        }
    ]
}
```
