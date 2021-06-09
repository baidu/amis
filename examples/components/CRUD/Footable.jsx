export default {
  title: '开启单条底部展示功能',
  body: {
    type: 'crud',
    draggable: true,
    api: '/api/sample',
    footable: {
      expand: 'first',
      accordion: true
    },
    columns: [
      {
        name: 'id',
        label: 'ID',
        width: 20,
        sortable: true,
        type: 'text',
        toggled: true
      },
      {
        name: 'engine',
        label: 'Rendering engine',
        sortable: true,
        searchable: true,
        type: 'text',
        toggled: true
      },
      {
        name: 'browser',
        label: 'Browser',
        sortable: true,
        type: 'text',
        toggled: true
      },
      {
        name: 'platform',
        label: 'Platform(s)',
        sortable: true,
        type: 'text',
        toggled: true
      },
      {
        name: 'version',
        label: 'Engine version',
        quickEdit: true,
        type: 'text',
        toggled: true
      },
      {
        name: 'grade',
        label: 'CSS grade',
        breakpoint: '*',
        quickEdit: {
          mode: 'inline',
          type: 'select',
          options: ['A', 'B', 'C', 'D', 'X'],
          inputClassName: 'w-xs',
          saveImmediately: true
        },
        type: 'text',
        toggled: true
      },
      {
        type: 'operation',
        label: '操作',
        width: 100,
        breakpoint: '*',
        buttons: [
          {
            type: 'button',
            icon: 'fa fa-eye',
            actionType: 'dialog',
            dialog: {
              title: '查看',
              body: {
                type: 'form',
                body: [
                  {
                    type: 'static',
                    name: 'engine',
                    label: 'Engine'
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'static',
                    name: 'browser',
                    label: 'Browser'
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'static',
                    name: 'platform',
                    label: 'Platform(s)'
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'static',
                    name: 'version',
                    label: 'Engine version'
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'static',
                    name: 'grade',
                    label: 'CSS grade'
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'html',
                    html:
                      '<p>添加其他 <span>Html 片段</span> 需要支持变量替换（todo）.</p>'
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            icon: 'fa fa-pencil',
            actionType: 'drawer',
            drawer: {
              position: 'left',
              size: 'lg',
              title: '编辑',
              body: {
                type: 'form',
                name: 'sample-edit-form',
                api: '/api/sample/$id',
                body: [
                  {
                    type: 'input-text',
                    name: 'engine',
                    label: 'Engine',
                    required: true
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'input-text',
                    name: 'browser',
                    label: 'Browser',
                    required: true
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'input-text',
                    name: 'platform',
                    label: 'Platform(s)',
                    required: true
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'input-text',
                    name: 'version',
                    label: 'Engine version'
                  },
                  {
                    type: 'divider'
                  },
                  {
                    type: 'select',
                    name: 'grade',
                    label: 'CSS grade',
                    options: ['A', 'B', 'C', 'D', 'X']
                  }
                ]
              }
            }
          },
          {
            type: 'button',
            icon: 'fa fa-times text-danger',
            actionType: 'ajax',
            confirmText: '您确认要删除?',
            api: 'delete:/api/sample/$id'
          }
        ],
        toggled: true
      }
    ]
  }
};
