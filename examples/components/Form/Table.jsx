export default {
  title: '表格编辑',
  body: {
    type: 'form',
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
        affixHeader: true,
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
      table5: Array.from({length: 20}, (_, index) => ({
        aa: index % 2 == 0 ? 'hello' : 'hi',
        cc: index % 2 == 0 ? 'aa' : 'cc'
      })),
      tableAffixHeader: Array.from({length: 5}, (_, index) => ({
        aa: index % 2 == 0 ? 'hello' : 'hi',
        cc: index % 2 == 0 ? 'aa' : 'cc'
      }))
    }
  }
};
