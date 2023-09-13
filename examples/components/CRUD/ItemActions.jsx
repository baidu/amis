export default {
  title: '增删改查示例',
  remark: 'bla bla bla',
  body: {
    type: 'crud',
    api: '/api/sample',
    headerToolbar: [
      'bulkActions',
      {
        type: 'columns-toggler',
        className: 'pull-right',
        align: 'right'
      },
      {
        type: 'search-box',
        align: 'right',
        name: 'keywords',
        placeholder: '请输入关键字',
        mini: true
      },

      {
        type: 'drag-toggler',
        align: 'right'
      },
      {
        type: 'pagination',
        align: 'right'
      }
    ],
    itemActions: [
      {
        type: 'button',
        label: '查看',
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
                html: '<p>添加其他 <span>Html 片段</span> 需要支持变量替换（todo）.</p>'
              }
            ]
          }
        }
      },
      {
        type: 'button',
        label: '编辑',
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
        label: '删除',
        actionType: 'ajax',
        confirmText: '您确认要删除?',
        api: 'delete:/api/sample/$id'
      }
    ],
    bulkActions: [
      {
        label: '批量删除',
        actionType: 'ajax',
        api: 'delete:/api/sample/${ids|raw}',
        confirmText: '确定要批量删除?',
        type: 'button'
      },
      {
        label: '批量修改',
        actionType: 'dialog',
        dialog: {
          title: '批量编辑',
          name: 'sample-bulk-edit',
          body: {
            type: 'form',
            api: '/api/sample/bulkUpdate2',
            body: [
              {
                type: 'hidden',
                name: 'ids'
              },
              {
                type: 'input-text',
                name: 'engine',
                label: 'Engine'
              }
            ]
          }
        },
        type: 'button'
      }
    ],
    columns: [
      {
        name: 'id',
        label: 'ID',
        sortable: true,
        type: 'text',
        toggled: true,
        remark: 'Bla bla Bla'
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
        toggled: false
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
        type: 'text',
        toggled: true
      },
      {
        name: 'grade',
        label: 'CSS grade',
        type: 'text',
        toggled: true
      }
    ]
  }
};
