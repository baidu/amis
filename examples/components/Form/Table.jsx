export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
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
    controls: [
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
        controls: [
          {
            type: 'color',
            name: 'color'
          },
          {
            type: 'text',
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
        type: 'table',
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
            quickEdit: {
              type: 'color'
            }
          },
          {
            label: '说明文字',
            name: 'name'
          }
        ]
      },
      {
        type: 'button',
        label: 'Table2新增一行',
        target: 'table2',
        actionType: 'add'
      },
      {
        type: 'table',
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
        type: 'table',
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
      }
    ]
  }
};
