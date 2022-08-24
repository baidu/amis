const loadingBody = {
  type: 'service',
  api: '/api/mock2/sample?orderBy=id&orderDir=desc&perPage=10&waitSeconds=10',
  body: {
    type: 'page',
    initApi:
      '/api/mock2/sample?orderBy=id&orderDir=desc&perPage=10&waitSeconds=10',
    body: [
      {
        loading: false,
        type: 'nav',
        stacked: true,
        className: 'w-md',
        draggable: true,
        saveOrderApi: '/api/options/nav',
        source:
          '/api/mock2/sample?orderBy=id&orderDir=desc&perPage=10&waitSeconds=30',
        itemActions: [
          {
            type: 'icon',
            icon: 'cloud',
            visibleOn: "this.to === '?cat=1'"
          },
          {
            type: 'dropdown-button',
            level: 'link',
            icon: 'fa fa-ellipsis-h',
            hideCaret: true,
            buttons: [
              {
                type: 'button',
                label: '编辑'
              },
              {
                type: 'button',
                label: '删除'
              }
            ]
          }
        ]
      },
      {
        type: 'page',
        body: {
          type: 'crud',
          syncLocation: false,
          api: '/api/mock2/sample?waitSeconds=30',
          headerToolbar: ['bulkActions'],
          bulkActions: [
            {
              label: '批量删除',
              actionType: 'ajax',
              api: 'delete:/api/mock2/sample/${ids|raw}?waitSeconds=30',
              confirmText: '确定要批量删除?'
            },
            {
              label: '批量修改',
              actionType: 'dialog',
              dialog: {
                title: '批量编辑',
                body: {
                  type: 'form',
                  api: '/api/mock2/sample/bulkUpdate2?waitSeconds=30',
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
              }
            }
          ],
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine'
            },
            {
              name: 'browser',
              label: 'Browser'
            },
            {
              name: 'platform',
              label: 'Platform(s)'
            },
            {
              name: 'version',
              label: 'Engine version'
            },
            {
              name: 'grade',
              label: 'CSS grade'
            }
          ]
        }
      },
      {
        type: 'page',
        body: {
          type: 'crud',
          api: '/api/mock2/sample?orderBy=id&orderDir=desc&waitSeconds=30',
          syncLocation: false,
          columns: [
            {
              name: 'id',
              label: 'ID'
            },
            {
              name: 'engine',
              label: 'Rendering engine'
            },
            {
              name: 'browser',
              label: 'Browser'
            },
            {
              type: 'operation',
              label: '操作',
              buttons: [
                {
                  label: '删除',
                  type: 'button',
                  actionType: 'ajax',
                  level: 'danger',
                  confirmText: '确认要删除？',
                  api: 'delete:/api/mock2/sample/${id}?waitSeconds=30'
                }
              ]
            }
          ]
        }
      }
    ]
  }
};

export default {
  type: 'page',
  body: [
    {
      type: 'button',
      label: 'dialog内带 loading',
      actionType: 'dialog',
      level: 'primary',
      dialog: {
        size: 'lg',
        title: '提示',
        body: loadingBody
      }
    },
    loadingBody
  ]
};
