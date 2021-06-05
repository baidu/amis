export default {
  title: 'Test 信息：${page}',
  body: {
    type: 'crud',
    api: '/api/sample',
    syncLocation: false,
    title: null,
    columns: [
      {
        name: 'id',
        label: 'ID',
        width: 20
      },
      {
        name: 'engine',
        label: 'Rendering engine',
        sortable: true
      },
      {
        name: 'grade',
        type: 'map',
        label: 'Rendering engine',
        map: {
          'A': "<span class='label label-info'>A</span>",
          'B': "<span class='label label-success'>B</span>",
          'C': "<span class='label label-primary'>C</span>",
          'X': "<span class='label label-danger'>X</span>",
          '*': 'Unkown'
        }
      },
      {
        type: 'operation',
        label: '操作',
        width: 200,
        buttons: [
          {
            type: 'button-group',
            buttons: [
              {
                type: 'button',
                label: '查看',
                actionType: 'dialog',
                dialog: {
                  disabled: true,
                  body: {
                    type: 'form',
                    body: [
                      {
                        name: 'engine',
                        label: 'Rendering engine',
                        type: 'static'
                      }
                    ]
                  }
                }
              },

              {
                type: 'button',
                label: '编辑',
                actionType: 'dialog',
                dialog: {
                  body: {
                    api: '/api/sample/$id',
                    type: 'form',
                    body: [
                      {
                        name: 'engine',
                        label: 'Rendering engine',
                        type: 'text'
                      }
                    ]
                  }
                }
              },

              {
                type: 'button',
                label: '删除',
                level: 'danger',
                actionType: 'ajax',
                confirmText: '确定？',
                api: 'delete:/api/sample/$id'
              }
            ]
          }
        ]
      }
    ]
  }
};
