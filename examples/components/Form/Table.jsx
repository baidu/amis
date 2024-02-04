export default {
  title: '表格编辑',
  body: {
    type: 'form',
    debug: true,
    mode: 'horizontal',
    api: '/api/mock2/form/saveForm?waitSeconds=2',
    actions: [
      {
        type: 'submit',
        label: '提交',
        primary: true
      }
    ],
    body: [
      {
        type: 'input-table',
        name: 'tableAffixHeader',
        label: '头部固定',
        multiple: true,
        addable: true,
        affixHeader: true,
        columns: [
          {
            name: 'labels',
            label: 'AA',
            type: 'input-text'
          },
          {
            name: 'values',
            label: 'CC',
            type: 'select',
            autoFill: {
              id: '${id}'
            },
            options: [
              {
                label: 'AA',
                value: 'aa',
                id: 111
              },
              {
                label: 'CC',
                value: 'cc',
                id: 1222
              }
            ]
          }
        ]
      },
      {
        type: 'crud',
        name: 'table',
        source: '${crud}',
        label: '头部固定',
        affixHeader: true,
        columns: [
          {
            name: 'a[0].aa',
            label: 'AA',
            quickEdit: {
              mode: 'inline',
              type: 'switch',
              onText: '开启',
              reload: 'none',
              offText: '关闭',
              id: 'u:56a3878ww05c4c',
              falseValue: 0,
              trueValue: 1
            }
          },
          {
            name: 'a[0].bb',
            label: 'AA',
            quickEdit: {
              mode: 'inline',
              type: 'switch',
              onText: '开启',
              reload: 'none',
              offText: '关闭',
              id: 'u:56a38780115c4c',
              falseValue: 0,
              trueValue: 1
            }
          }
        ]
      },
      {
        type: 'input-table',
        name: 'tabletree',
        label: '树',
        expand: 'all',
        isExpanded: true,
        affixHeader: true,
        expandable: {
          expandAll: true
        },

        columns: [
          {
            name: 'label',
            label: 'AA'
          },
          {
            name: 'value',
            label: 'BB',
            type: 'input-text',
            reload: 'none'
          }
        ]
      },
      {
        type: 'input-formula',
        name: 'formula',
        labelField: 'label',
        valueField: 'label',
        syncSuperData: true,
        // onPickerOpen: '${tableAffixHeader}',
        label: '公式',
        evalMode: true,
        value: 'SUM(1 , 2)',
        variables: '${tabletree}',
        variablesDefault: [
          {
            label: 'hello'
          },
          {
            label: 'goods'
          }
        ]
      },

      {
        type: 'combo',
        name: 'colors',
        label: 'Combo',
        multiple: true,
        draggable: true,
        multiLine: true,
        value: [
          {
            color: 'green',
            name: '颜色'
          }
        ],
        items: [
          {
            type: 'input-color',
            name: 'color',
            clearable: false
          },
          {
            type: 'input-text',
            name: 'name',
            placeholder: '说明文字'
          }
        ]
      },
      {
        type: 'static',
        label: '当前值',
        tpl: '<pre>${colors|json}</pre>'
      },
      {
        type: 'input-table',
        name: 'colors',
        label: 'Table',
        draggable: true,
        addable: true,
        removable: true,
        needConfirm: false,
        columns: [
          {
            label: 'Color',
            name: 'color',
            type: 'input-color',
            quickEdit: false
          },
          {
            label: '说明文字',
            name: 'name'
          }
        ]
      },
      {
        type: 'control',
        body: {
          type: 'button',
          label: 'Table2新增一行',
          target: 'table2',
          actionType: 'add'
        }
      },
      {
        type: 'input-table',
        name: 'table2',
        label: 'Table2',
        editable: true,
        addable: true,
        removable: true,
        draggable: true,
        columns: [
          {
            name: 'a',
            label: 'A'
          },
          {
            name: 'b',
            label: 'B',
            quickEdit: {
              type: 'select',
              options: [
                {
                  label: 'A',
                  value: 'a'
                },
                {
                  label: 'B',
                  value: 'b'
                }
              ]
            }
          }
        ]
      },

      {
        type: 'input-table',
        name: 'table3',
        label: 'Table3(指定第2列只有update时能编辑)',
        editable: true,
        addable: true,
        removable: true,
        draggable: true,
        columns: [
          {
            name: 'a',
            label: 'A',
            quickEdit: true
          },
          {
            name: 'b',
            label: 'B',
            quickEdit: false,
            quickEditOnUpdate: {
              type: 'select',
              options: [
                {
                  label: 'A',
                  value: 'a'
                },
                {
                  label: 'B',
                  value: 'b'
                }
              ]
            }
          }
        ]
      },

      {
        type: 'input-table',
        name: 'table5',
        label: '内容自适应',
        autoFillHeight: true,
        tableContentClassName: 'max-h-60',
        columns: [
          {
            name: 'aa',
            label: 'AA',
            type: 'input-text'
          },
          {
            name: 'cc',
            label: 'CC',
            type: 'select',
            options: [
              {
                label: 'AA',
                value: 'aa'
              },
              {
                label: 'CC',
                value: 'cc'
              }
            ]
          }
        ]
      }
    ],
    data: {
      crud: [
        {
          a: [
            {
              aa: 1,
              bb: 0
            }
          ]
        },
        {
          a: [
            {
              aa: 1,
              bb: 0
            }
          ]
        }
      ],
      tabletree: [
        {
          label: 'a',
          value: 'aa',
          children: [
            {
              label: 'a1',
              value: 'bb',
              children: [
                {
                  label: 'a11',
                  value: 'aa',
                  children: [
                    {
                      label: 'a111',
                      value: 'bb'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: 'b',
          value: 'b'
        }
      ],
      table5: Array.from({length: 20}, (_, index) => ({
        aa: index % 2 == 0 ? 'hello' : 'hi',
        cc: index % 2 == 0 ? 'aa' : 'cc'
      })),
      tableAffixHeader: Array.from({length: 5}, (_, index) => ({
        labels: index % 2 == 0 ? 'hello' : 'hi',
        values: index % 2 == 0 ? 'aa' : 'cc'
      }))
    }
  }
};
