### Table(CRUD)

在 CRUD 中的 Table 主要增加了 Column 里面的以下配置功能，更多参数，请参考[Table](./Table.md)

-   `sortable` 开启后可以根据当前列排序(后端排序)。

```schema:height="800" scope="body"
{
    "type": "crud",
    "api": "/api/sample",
    "syncLocation": false,
    "title": null,
    "perPageField":"rn",
    "defaultParams":{
        "rn": 10
    },
    "columns": [
        {
            "name": "id",
            "label": "ID",
            "width": 20,
            "sortable": true
        },
        {
            "name": "engine",
            "label": "Rendering engine",
            "sortable": true,
            "toggled": false
        },
        {
            "name": "browser",
            "label": "Browser",
            "sortable": true
        },
        {
            "name": "platform",
            "label": "Platform(s)",
            "sortable": true
        },
        {
            "name": "version",
            "label": "Engine version"
        }
    ]
}
```
