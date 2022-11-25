export default {
  type: 'page',
  title: '标题',
  remark: {
    title: '标题',
    body: '这是一段描述问题，注意到了没，还可以设置标题。而且只有点击了才弹出来。',
    icon: 'question-mark',
    placement: 'right',
    trigger: 'click',
    rootClose: true
  },
  // body: '内容部分. 可以使用 \\${var} 获取变量。如: `\\$date`: ${date}',
  body: [
    {
      type: 'tabs',
      tabsMode: 'vertical',
      unmountOnExit: true,
      tabs: [
        {
          title: '选项卡1',
          body: [
            {
              type: 'service',
              api: '/api/mock2/crud/table?perPage=5',
              body: [
                {
                  type: 'table',
                  title: '表格1',
                  source: '$rows',
                  columns: [
                    {
                      name: 'id',
                      label: 'ID'
                    },
                    {
                      name: 'engine',
                      label: 'Rendering engine',
                      width: 300
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
                      name: 'platform',
                      label: 'Platform(s)'
                    },
                    {
                      name: 'platform',
                      label: 'Platform(s)'
                    },
                    {
                      name: 'platform',
                      label: 'Platform(s)'
                    },
                    {
                      name: 'platform',
                      label: 'Platform(s)'
                    },
                    {
                      name: 'platform',
                      label: 'Platform(s)'
                    },
                    {
                      name: 'platform',
                      label: 'Platform(s)'
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
                    },
                    {
                      type: 'operation',
                      label: '操作',
                      buttons: [
                        {
                          label: '详情',
                          type: 'button',
                          level: 'link',
                          actionType: 'dialog',
                          dialog: {
                            title: '查看详情',
                            body: {
                              type: 'form',
                              body: [
                                {
                                  type: 'input-text',
                                  name: 'engine',
                                  label: 'Engine'
                                },
                                {
                                  type: 'input-text',
                                  name: 'browser',
                                  label: 'Browser'
                                },
                                {
                                  type: 'input-text',
                                  name: 'platform',
                                  label: 'platform'
                                },
                                {
                                  type: 'input-text',
                                  name: 'version',
                                  label: 'version'
                                },
                                {
                                  type: 'control',
                                  label: 'grade',
                                  body: {
                                    type: 'tag',
                                    label: '${grade}',
                                    displayMode: 'normal',
                                    color: 'active'
                                  }
                                }
                              ]
                            }
                          }
                        },
                        {
                          label: '删除',
                          type: 'button',
                          level: 'link',
                          className: 'text-danger',
                          disabledOn: "this.grade === 'A'"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              type: 'form',
              debug: true,
              body: [{type: 'input-text', name: 'stage', label: 'stagw'}]
            }
          ]
        },
        {
          title: '选项卡2',
          body: '选项卡内容2'
        },
        {
          title: '选项卡3',
          body: '选项卡内容3'
        }
      ]
    }
  ],
  aside: '边栏部分',
  toolbar: '工具栏',
  initApi: '/api/mock2/page/initData'
};
