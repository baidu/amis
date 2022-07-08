export default {
  type: 'page',
  body: {
    type: 'form',
    title: 'input-kvs 实现复杂嵌套数据结构',
    mode: 'horizontal',
    debug: true,
    submitText: '',
    submitOnChange: false,
    body: [
      {
        type: 'input-kvs',
        name: 'dataModel',
        addButtonText: '新增数据源权限',
        keyItem: {
          label: '数据源名',
          type: 'select',
          options: ['local-mysql', 'remote-postgres', 'cloud-oracle']
        },
        valueItems: [
          {
            label: '数据源级别权限',
            type: 'checkboxes',
            name: 'permissions',
            joinValues: false,
            extractValue: true,
            options: [
              {
                label: '查询',
                value: 'select'
              },
              {
                label: '写入',
                value: 'insert'
              },
              {
                label: '更新',
                value: 'update'
              },
              {
                label: '删除',
                value: 'delete'
              }
            ]
          },
          {
            type: 'input-kvs',
            label: '表权限',
            addButtonText: '新增表权限',
            name: 'dataModel',
            keyItem: {
              label: '表名',
              mode: 'horizontal',
              type: 'select',
              options: ['table1', 'table2', 'table3']
            },
            valueItems: [
              {
                type: 'switch',
                name: 'canInsert',
                mode: 'horizontal',
                label: '是否可写入'
              },
              {
                type: 'switch',
                name: 'canDelete',
                mode: 'horizontal',
                label: '是否可删除'
              },
              {
                type: 'input-kvs',
                label: '字段级别权限',
                addButtonText: '新增字段权限',
                name: 'field',
                keyItem: {
                  label: '字段名',
                  mode: 'horizontal',
                  type: 'select',
                  options: ['id', 'title', 'content']
                },
                valueIsArray: true,
                valueItems: [
                  {
                    type: 'checkboxes',
                    name: '_value',
                    joinValues: false,
                    extractValue: true,
                    options: [
                      {
                        label: '查询',
                        value: 'select'
                      },
                      {
                        label: '写入',
                        value: 'insert'
                      },
                      {
                        label: '更新',
                        value: 'update'
                      },
                      {
                        label: '删除',
                        value: 'delete'
                      }
                    ]
                  }
                ]
              },
              {
                name: 'fieldSelectExp',
                label: '字段表达式权限',
                type: 'input-array',
                value: ['SUM(fieldKey)'],
                addButtonText: '新增表达式权限',
                inline: true,
                items: {
                  size: 'md',
                  type: 'input-text'
                }
              }
            ]
          }
        ]
      }
    ]
  }
};
