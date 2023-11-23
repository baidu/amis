export default {
  type: 'page',
  title: '匹配函数',
  remark: '使用前端分页处理列字段类型较为复杂或者字段值格式和后端返回不一致的场景',
  body: [
    {
      type: 'container',
      style: {
        padding: '8px',
        marginBottom: '8px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      },
      body: [
        {
          "type": "tpl",
          tpl: '<h4>匹配函数签名：</h4>',
          "inline": false
        },
        {
          "type": "code",
          "language": "typescript",
          "value": `interface CRUDMatchFunc {
  (
    /* 当前列表的全量数据 */
    items: any,
    /* 最近一次接口返回的全量数据 */
    itemsRaw: any,
    /** 相关配置 */
    options?: {
      /* 查询参数 */
      query: Record<string, any>,
      /* 列配置 */
      columns: any;
      /** match-sorter 匹配函数 */
      matchSorter: (items: any[], value: string, options?: MatchSorterOptions<any>) => any[]
    }
  ): boolean;
}`
        }
      ]
    },
    {
      "type": "crud",
      "syncLocation": false,
      "api": "/api/mock2/crud/loadDataOnce",
      "loadDataOnce": true,
      "loadDataOnceFetchOnFilter": false,
      "perPage": 5,
      "matchFunc": `
        const {query = {}, columns} = options;
        let result = items.concat();

        Object.keys(query).forEach(key => {
          const value = query[key];

          if (value == null) {
            return;
          }

          if (key === 'status') {
            result = result.filter(item => item.status === Boolean(value));
          } else if (key === 'time') {
            if (typeof value === 'string') {
              const [start, end] = value.split(",");
              result = result.filter(item => {
                const time = Number(item.time);

                return time >= Number(start) && time <= Number(end);
              });
            }
          }
        });

        return result;`,
      "filter": {
        "debug": true,
        "body": [
            {
              "type": "switch",
              "name": "status",
              "label": "已核验",
              "size": "sm"
            },
            {
              "type": "input-datetime-range",
              "name": "time",
              "label": "时间",
              "size": "full"
            }
        ],
        "actions": [
          {
            "type": "reset",
            "label": "重置"
          },
          {
              "type": "submit",
              "level": "primary",
              "label": "查询"
          }
        ]
      },
      "columns": [
        {
          "name": "id",
          "label": "ID"
        },
        {
          "name": "browser",
          "label": "Browser"
        },
        {
          "name": "version",
          "label": "Engine version",
          "searchable": {
            "type": "select",
            "name": "version",
            "label": "Engine version",
            "clearable": true,
            "multiple": true,
            "searchable": true,
            "checkAll": true,
            "options": [
              "1.7",
              "3.3",
              "5.6"
            ],
            "maxTagCount": 10,
            "extractValue": true,
            "joinValues": false,
            "delimiter": ",",
            "defaultCheckAll": false,
            "checkAllLabel": "全选"
          }
        },
        {
          "name": "grade",
          "label": "CSS grade"
        },
        {
          "name": "status",
          "label": "已核验",
          "type": "tpl",
          "tpl": "${status === true ? '是' : '否'}",
          "filterable": {
            "options": [
              {"label": "是", "value": true},
              {"label": "否", "value": false}
            ]
          }
        },
        {
          "name": "time",
          "type": "date",
          "label": "时间",
          "format": "YYYY-MM-DD HH:mm:ss"
        }
      ]
    },
    {
      "type": "divider",
    },
    {
      "type": "tpl",
      tpl: '<h2>使用数据域变量作为数据源：</h2>',
      "inline": false
    },
    {
      "type": "service",
      "api": {
        "url": "/api/mock2/crud/loadDataOnce",
        "method": "get",
        "responseData": {
          "table": "${rows}"
        }
      },
      "body": [
        {
          "type": "crud",
          "syncLocation": false,
          "source": "${table}",
          "loadDataOnce": true,
          "loadDataOnceFetchOnFilter": false,
          "perPage": 5,
          "matchFunc": `
            const {query = {}, columns} = options;
            let result = itemsRaw.concat();

            Object.keys(query).forEach(key => {
              const value = query[key];

              if (value == null) {
                return;
              }

              if (key === 'status') {
                result = result.filter(item => item.status === Boolean(value));
              } else if (key === 'time') {
                if (typeof value === 'string') {
                  const [start, end] = value.split(",");
                  result = result.filter(item => {
                    const time = Number(item.time);

                    return time >= Number(start) && time <= Number(end);
                  });
                }
              }
            });

            return result;`,
          "filter": {
            "debug": true,
            "body": [
                {
                  "type": "switch",
                  "name": "status",
                  "label": "已核验",
                  "size": "sm"
                },
                {
                  "type": "input-datetime-range",
                  "name": "time",
                  "label": "时间",
                  "size": "full"
                }
            ],
            "actions": [
              {
                "type": "reset",
                "label": "重置"
              },
              {
                  "type": "submit",
                  "level": "primary",
                  "label": "查询"
              }
            ]
          },
          "columns": [
            {
              "name": "id",
              "label": "ID"
            },
            {
              "name": "browser",
              "label": "Browser"
            },
            {
              "name": "version",
              "label": "Engine version",
              "searchable": {
                "type": "select",
                "name": "version",
                "label": "Engine version",
                "clearable": true,
                "multiple": true,
                "searchable": true,
                "checkAll": true,
                "options": [
                  "1.7",
                  "3.3",
                  "5.6"
                ],
                "maxTagCount": 10,
                "extractValue": true,
                "joinValues": false,
                "delimiter": ",",
                "defaultCheckAll": false,
                "checkAllLabel": "全选"
              }
            },
            {
              "name": "grade",
              "label": "CSS grade"
            },
            {
              "name": "status",
              "label": "已核验",
              "type": "tpl",
              "tpl": "${status === true ? '是' : '否'}",
              "filterable": {
                "options": [
                  {"label": "是", "value": true},
                  {"label": "否", "value": false}
                ]
              }
            },
            {
              "name": "time",
              "type": "date",
              "label": "时间",
              "format": "YYYY-MM-DD HH:mm:ss"
            }
          ]
        }
      ]
    }
  ]
};
