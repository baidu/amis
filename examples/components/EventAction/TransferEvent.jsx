export default {
  type: 'page',
  title: '穿梭框类事件',
  regions: ['body', 'toolbar', 'header'],
  body: [
    // transfer
    {
      type: 'tpl',
      tpl: 'transfer',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      debug: true,
      body: [
        {
          name: 'transferEvent1',
          id: 'transferEvent1',
          type: 'action',
          label: '全选功能',
          level: 'primary',
          className: 'mr-3 mb-3',
          debugger: true,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'selectAll',
                  componentId: 'transfer-receiver'
                }
              ]
            }
          }
        },
        {
          name: 'transferEvent2',
          id: 'transferEvent2',
          type: 'action',
          label: '清空功能',
          level: 'primary',
          className: 'mr-3 mb-3',
          debugger: true,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: 'transfer-receiver'
                }
              ]
            }
          }
        },
        {
          name: 'transferEvent2',
          id: 'transferEvent2',
          type: 'action',
          label: '重置功能',
          level: 'primary',
          className: 'mr-3 mb-3',
          debugger: true,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'reset',
                  componentId: 'transfer-receiver'
                }
              ]
            }
          }
        },
        {
          label: '穿梭器',
          id: 'transfer-receiver',
          type: 'transfer',
          name: 'transfer',
          debugger: true,
          resetValue: 'zhugeliang',
          options: [
            {
              label: '诸葛亮',
              value: 'zhugeliang'
            },
            {
              label: '曹操',
              value: 'caocao'
            },
            {
              label: '钟无艳',
              value: 'zhongwuyan'
            },
            {
              label: '李白',
              value: 'libai'
            },
            {
              label: '韩信',
              value: 'hanxin'
            },
            {
              label: '云中君',
              value: 'yunzhongjun'
            }
          ]
        }
      ]
    },
    // tabstransfer
    {
      type: 'tpl',
      tpl: 'tabstransfer',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      debug: true,
      body: [
        {
          name: 'transferEvent4',
          id: 'transferEvent4',
          type: 'action',
          label: '设置changeTabKey为1',
          level: 'primary',
          className: 'mr-3 mb-3',
          debugger: true,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'changeTabKey',
                  componentId: 'tab-transfer-receiver',
                  args: {
                    activeKey: 1
                  }
                }
              ]
            }
          }
        },
        {
          name: 'transferEvent5',
          id: 'transferEvent5',
          type: 'action',
          label: '清空功能',
          level: 'primary',
          className: 'mr-3 mb-3',
          debugger: true,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: 'tab-transfer-receiver'
                }
              ]
            }
          }
        },
        {
          name: 'transferEvent6',
          id: 'transferEvent6',
          type: 'action',
          label: '重置功能',
          level: 'primary',
          className: 'mr-3 mb-3',
          debugger: true,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'reset',
                  componentId: 'tab-transfer-receiver'
                }
              ]
            }
          }
        },
        {
          label: '组合穿梭器',
          type: 'tabs-transfer',
          name: 'transferEvent7',
          sortable: true,
          selectMode: 'tree',
          debug: true,
          id: 'tab-transfer-receiver',
          resetValue: 'zhugeliang',
          options: [
            {
              label: '成员',
              selectMode: 'tree',
              searchable: true,
              children: [
                {
                  label: '法师',
                  children: [
                    {
                      label: '诸葛亮',
                      value: 'zhugeliang'
                    }
                  ]
                },
                {
                  label: '战士',
                  children: [
                    {
                      label: '曹操',
                      value: 'caocao'
                    },
                    {
                      label: '钟无艳',
                      value: 'zhongwuyan'
                    }
                  ]
                },
                {
                  label: '打野',
                  children: [
                    {
                      label: '李白',
                      value: 'libai'
                    },
                    {
                      label: '韩信',
                      value: 'hanxin'
                    },
                    {
                      label: '云中君',
                      value: 'yunzhongjun'
                    }
                  ]
                }
              ]
            },
            {
              label: '用户',
              selectMode: 'chained',
              children: [
                {
                  label: '法师',
                  children: [
                    {
                      label: '诸葛亮',
                      value: 'zhugeliang2'
                    }
                  ]
                },
                {
                  label: '战士',
                  children: [
                    {
                      label: '曹操',
                      value: 'caocao2'
                    },
                    {
                      label: '钟无艳',
                      value: 'zhongwuyan2'
                    }
                  ]
                },
                {
                  label: '打野',
                  children: [
                    {
                      label: '李白',
                      value: 'libai2'
                    },
                    {
                      label: '韩信',
                      value: 'hanxin2'
                    },
                    {
                      label: '云中君',
                      value: 'yunzhongjun2'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    // transferpicker
    {
      type: 'tpl',
      tpl: 'transferpicker',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      debug: true,
      body: [
        {
          name: 'transferEvent8',
          id: 'transferEvent8',
          type: 'action',
          label: '清空功能',
          level: 'primary',
          className: 'mr-3 mb-3',
          debugger: true,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: 'transfer-picker-receiver'
                }
              ]
            }
          }
        },
        {
          name: 'transferEvent9',
          id: 'transferEvent9',
          type: 'action',
          label: '重置功能',
          level: 'primary',
          className: 'mr-3 mb-3',
          debugger: true,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'reset',
                  componentId: 'transfer-picker-receiver'
                }
              ]
            }
          }
        },
        {
          label: '组合穿梭器',
          type: 'transfer-picker',
          name: 'transferEvent10',
          debug: true,
          id: 'transfer-picker-receiver',
          resetValue: 'zhugeliang',
          sortable: true,
          selectMode: 'tree',
          searchable: true,
          options: [
            {
              label: '法师',
              children: [
                {
                  label: '诸葛亮',
                  value: 'zhugeliang'
                }
              ]
            },
            {
              label: '战士',
              children: [
                {
                  label: '曹操',
                  value: 'caocao'
                },
                {
                  label: '钟无艳',
                  value: 'zhongwuyan'
                }
              ]
            },
            {
              label: '打野',
              children: [
                {
                  label: '李白',
                  value: 'libai'
                },
                {
                  label: '韩信',
                  value: 'hanxin'
                },
                {
                  label: '云中君',
                  value: 'yunzhongjun'
                }
              ]
            }
          ]
        }
      ]
    },
    // tabsTransferPicker
    {
      type: 'tpl',
      tpl: 'tabsTransferPicker',
      inline: false,
      wrapperComponent: 'h2'
    },
    {
      type: 'form',
      debug: true,
      body: [
        {
          name: 'transferEvent11',
          id: 'transferEvent11',
          type: 'action',
          label: '清空功能',
          level: 'primary',
          className: 'mr-3 mb-3',
          debugger: true,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'clear',
                  componentId: 'tabs-transfer-picker-receiver'
                }
              ]
            }
          }
        },
        {
          name: 'transferEvent12',
          id: 'transferEvent12',
          type: 'action',
          label: '重置功能',
          level: 'primary',
          className: 'mr-3 mb-3',
          debugger: true,
          onEvent: {
            click: {
              actions: [
                {
                  actionType: 'reset',
                  componentId: 'tabs-transfer-picker-receiver'
                }
              ]
            }
          }
        },
        {
          label: '组合穿梭器',
          type: 'tabs-transfer-picker',
          name: 'transferEvent13',
          debug: true,
          id: 'tabs-transfer-picker-receiver',
          resetValue: 'zhugeliang',
          sortable: true,
          selectMode: 'tree',
          pickerSize: 'md',
          menuTpl:
            "<div class='flex justify-between'><span>${label}</span>${email ? `<div class='text-muted m-r-xs text-sm text-right'>${email}<br />${phone}</div>`: ''}</div>",
          valueTpl: '${label}(${value})',
          options: [
            {
              label: '成员',
              selectMode: 'tree',
              searchable: true,
              children: [
                {
                  label: '法师',
                  children: [
                    {
                      label: '诸葛亮',
                      value: 'zhugeliang',
                      email: 'zhugeliang@timi.com',
                      phone: 13111111111
                    }
                  ]
                },
                {
                  label: '战士',
                  children: [
                    {
                      label: '曹操',
                      value: 'caocao',
                      email: 'caocao@timi.com',
                      phone: 13111111111
                    },
                    {
                      label: '钟无艳',
                      value: 'zhongwuyan',
                      email: 'zhongwuyan@timi.com',
                      phone: 13111111111
                    }
                  ]
                },
                {
                  label: '打野',
                  children: [
                    {
                      label: '李白',
                      value: 'libai',
                      email: 'libai@timi.com',
                      phone: 13111111111
                    },
                    {
                      label: '韩信',
                      value: 'hanxin',
                      email: 'hanxin@timi.com',
                      phone: 13111111111
                    },
                    {
                      label: '云中君',
                      value: 'yunzhongjun',
                      email: 'yunzhongjun@timi.com',
                      phone: 13111111111
                    }
                  ]
                }
              ]
            },
            {
              label: '角色',
              selectMode: 'list',
              children: [
                {
                  label: '角色 1',
                  value: 'role1'
                },
                {
                  label: '角色 2',
                  value: 'role2'
                },
                {
                  label: '角色 3',
                  value: 'role3'
                },
                {
                  label: '角色 4',
                  value: 'role4'
                }
              ]
            },
            {
              label: '部门',
              selectMode: 'tree',
              children: [
                {
                  label: '总部',
                  value: 'dep0',
                  children: [
                    {
                      label: '部门 1',
                      value: 'dep1',
                      children: [
                        {
                          label: '部门 4',
                          value: 'dep4'
                        },
                        {
                          label: '部门 5',
                          value: 'dep5'
                        }
                      ]
                    },
                    {
                      label: '部门 2',
                      value: 'dep2'
                    },
                    {
                      label: '部门 3',
                      value: 'dep3'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
