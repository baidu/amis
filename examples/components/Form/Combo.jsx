export default {
  title: 'Combo 示例',
  body: [
    {
      type: 'tabs',
      tabs: [
        {
          title: '基本用法',
          hash: 'basic',
          body: [
            {
              type: 'form',
              api: '/api/mock2/saveForm?waitSeconds=2',
              title: '',
              mode: 'horizontal',
              wrapWithPanel: false,
              className: 'm-t',
              // debug: true,
              body: [
                {
                  type: 'input-text',
                  label: '文本',
                  name: 'a'
                },
                {
                  type: 'divider'
                },
                {
                  type: 'combo',
                  name: 'combo1',
                  label: '组合多条多行',
                  multiple: true,
                  multiLine: true,
                  value: [{}],
                  items: [
                    {
                      name: 'a',
                      label: '文本',
                      type: 'input-text',
                      placeholder: '文本',
                      value: '',
                      size: 'full'
                    },
                    {
                      name: 'b',
                      label: '选项',
                      type: 'select',
                      options: ['a', 'b', 'c'],
                      size: 'full'
                    }
                  ]
                },

                {
                  type: 'button',
                  label: '独立排序',
                  level: 'dark',
                  className: 'm-t-n-xs',
                  size: 'sm',
                  actionType: 'dialog',
                  visibleOn: 'data.combo1.length > 1',
                  dialog: {
                    title: '对 Combo 进行 拖拽排序',
                    body: {
                      type: 'form',
                      body: [
                        {
                          type: 'combo',
                          name: 'combo1',
                          label: false,
                          multiple: true,
                          draggable: true,
                          addable: false,
                          removable: false,
                          value: [{}],
                          items: [
                            {
                              name: 'a',
                              type: 'static',
                              tpl: '${a} - ${b}'
                            }
                          ]
                        }
                      ]
                    },
                    actions: [
                      {
                        type: 'submit',
                        mergeData: true,
                        label: '确认',
                        level: 'primary'
                      },

                      {
                        type: 'button',
                        actionType: 'close',
                        label: '取消'
                      }
                    ]
                  }
                },

                {
                  type: 'combo',
                  name: 'combo2',
                  label: '组合多条单行',
                  multiple: true,
                  value: [{}],
                  items: [
                    {
                      name: 'a',
                      type: 'input-text',
                      placeholder: '文本',
                      value: '',
                      columnClassName: 'w-sm'
                    },
                    {
                      name: 'b',
                      type: 'select',
                      options: ['a', 'b', 'c']
                    }
                  ]
                },
                {
                  type: 'divider'
                },
                {
                  type: 'combo',
                  name: 'combo3',
                  label: '组合单条多行',
                  multiLine: true,
                  items: [
                    {
                      name: 'a',
                      label: '文本',
                      type: 'input-text',
                      placeholder: '文本',
                      value: '',
                      size: 'full'
                    },
                    {
                      name: 'b',
                      label: '选项',
                      type: 'select',
                      options: ['a', 'b', 'c']
                    }
                  ]
                },

                {
                  type: 'combo',
                  name: 'combo4',
                  label: '组合单条单行',
                  items: [
                    {
                      name: 'a',
                      type: 'input-text',
                      placeholder: '文本',
                      value: '',
                      size: 'full'
                    },
                    {
                      name: 'b',
                      type: 'select',
                      options: ['a', 'b', 'c']
                    }
                  ]
                }
              ]
            }
          ]
        },

        {
          title: '内联样式',
          hash: 'inline',
          body: [
            {
              type: 'form',
              api: '/api/mock2/saveForm?waitSeconds=2',
              title: '',
              mode: 'horizontal',
              wrapWithPanel: false,
              className: 'm-t',
              body: [
                {
                  type: 'combo',
                  name: 'combo11',
                  label: '组合多条多行内联',
                  multiple: true,
                  multiLine: true,
                  inline: true,
                  value: [{}],
                  items: [
                    {
                      name: 'a',
                      label: '文本',
                      type: 'input-text',
                      placeholder: '文本',
                      value: ''
                    },
                    {
                      name: 'b',
                      label: '选项',
                      type: 'select',
                      options: ['a', 'b', 'c']
                    }
                  ]
                },

                {
                  type: 'combo',
                  name: 'combo22',
                  label: '组合多条单行内联',
                  multiple: true,
                  inline: true,
                  value: [{}],
                  items: [
                    {
                      name: 'a',
                      type: 'input-text',
                      placeholder: '文本',
                      value: ''
                    },
                    {
                      name: 'b',
                      type: 'select',
                      options: ['a', 'b', 'c']
                    }
                  ]
                },
                {
                  type: 'divider'
                },
                {
                  type: 'combo',
                  name: 'combo33',
                  label: '组合单条多行内联',
                  multiLine: true,
                  inline: true,
                  items: [
                    {
                      name: 'a',
                      label: '文本',
                      type: 'input-text',
                      placeholder: '文本',
                      value: ''
                    },
                    {
                      name: 'b',
                      label: '选项',
                      type: 'select',
                      options: ['a', 'b', 'c']
                    }
                  ]
                },

                {
                  type: 'combo',
                  name: 'combo44',
                  label: '组合单条单行内联',
                  inline: true,
                  items: [
                    {
                      name: 'a',
                      type: 'input-text',
                      placeholder: '文本',
                      value: ''
                    },
                    {
                      name: 'b',
                      type: 'select',
                      options: ['a', 'b', 'c']
                    }
                  ]
                }
              ]
            }
          ]
        },

        {
          title: '唯一验证',
          hash: 'unique',
          body: [
            {
              type: 'form',
              api: '/api/mock2/saveForm?waitSeconds=2',
              title: '',
              mode: 'horizontal',
              wrapWithPanel: false,
              className: 'm-t',
              // debug: true,
              body: [
                {
                  type: 'combo',
                  name: 'combo666',
                  label: '组合多条唯一',
                  multiple: true,
                  value: [{}],
                  items: [
                    {
                      name: 'a',
                      type: 'input-text',
                      placeholder: '文本',
                      value: '',
                      unique: true
                    },
                    {
                      name: 'b',
                      type: 'select',
                      options: ['a', 'b', 'c'],
                      unique: true
                    }
                  ]
                }
              ]
            }
          ]
        },

        {
          title: '可拖拽排序',
          hash: 'sortable',
          body: [
            {
              type: 'form',
              api: '/api/mock2/saveForm?waitSeconds=2',
              title: '',
              mode: 'horizontal',
              wrapWithPanel: false,
              className: 'm-t',
              // debug: true,
              body: [
                {
                  type: 'combo',
                  name: 'combo777',
                  label: '可拖拽排序',
                  multiple: true,
                  value: [
                    {a: '1', b: 'a'},
                    {a: '2', b: 'b'}
                  ],
                  draggable: true,
                  items: [
                    {
                      name: 'a',
                      type: 'input-text',
                      placeholder: '文本',
                      unique: true
                    },
                    {
                      name: 'b',
                      type: 'select',
                      options: ['a', 'b', 'c'],
                      unique: true
                    }
                  ]
                }
              ]
            }
          ]
        },

        {
          title: '值打平',
          hash: 'flat',
          body: [
            {
              type: 'form',
              api: '/api/mock2/saveForm?waitSeconds=2',
              title: '',
              mode: 'horizontal',
              wrapWithPanel: false,
              className: 'm-t',
              // debug: true,
              body: [
                {
                  type: 'combo',
                  name: 'combo888',
                  label: '可打平只存储值',
                  multiple: true,
                  flat: true,
                  value: ['red', 'pink'],
                  draggable: true,
                  items: [
                    {
                      name: 'a',
                      type: 'input-color',
                      placeholder: '选取颜色'
                    }
                  ]
                },
                {
                  type: 'static',
                  name: 'combo888',
                  label: '当前值',
                  tpl: '<pre>${combo888|json}</pre>'
                }
              ]
            }
          ]
        },

        {
          title: '条件',
          hash: 'conditions',
          body: [
            {
              type: 'form',
              api: '/api/mock2/saveForm?waitSeconds=2',
              title: '',
              mode: 'horizontal',
              wrapWithPanel: false,
              className: 'm-t',
              // debug: true,
              body: [
                {
                  type: 'tpl',
                  tpl:
                    '<p class="m-b-xl">添加时可选择类型，比如这个例子，可以选择是文本类型还是数字类型</p>'
                },
                {
                  type: 'combo',
                  name: 'combo-conditions1',
                  label: '单选',
                  value: {
                    type: 'number'
                  },
                  multiLine: true,
                  conditions: [
                    {
                      label: '文本',
                      test: 'this.type === "text"',
                      scaffold: {
                        type: 'text',
                        label: '文本',
                        name: ''
                      },
                      items: [
                        {
                          label: '名称',
                          name: 'label',
                          type: 'input-text'
                        },
                        {
                          label: '字段名',
                          name: 'name',
                          type: 'input-text'
                        }
                      ]
                    },

                    {
                      label: '数字',
                      test: 'this.type === "number"',
                      scaffold: {
                        type: 'number',
                        label: '数字',
                        name: ''
                      },
                      items: [
                        {
                          label: '名称',
                          name: 'label',
                          type: 'input-text'
                        },
                        {
                          label: '字段名',
                          name: 'name',
                          type: 'input-text'
                        },
                        {
                          label: '最小值',
                          name: 'min',
                          type: 'input-number'
                        },
                        {
                          label: '最大值',
                          name: 'max',
                          type: 'input-number'
                        },
                        {
                          label: '步长',
                          name: 'step',
                          type: 'input-number'
                        }
                      ]
                    }
                  ]
                },

                {
                  type: 'combo',
                  name: 'combo-conditions2',
                  label: '多选',
                  value: [
                    {
                      type: 'text'
                    }
                  ],
                  multiLine: true,
                  multiple: true,
                  typeSwitchable: false,
                  conditions: [
                    {
                      label: '文本',
                      test: 'this.type === "text"',
                      scaffold: {
                        type: 'text',
                        label: '文本',
                        name: ''
                      },
                      items: [
                        {
                          label: '名称',
                          name: 'label',
                          type: 'input-text'
                        },
                        {
                          label: '字段名',
                          name: 'name',
                          type: 'input-text'
                        }
                      ]
                    },

                    {
                      label: '数字',
                      test: 'this.type === "number"',
                      scaffold: {
                        type: 'number',
                        label: '数字',
                        name: ''
                      },
                      items: [
                        {
                          label: '名称',
                          name: 'label',
                          type: 'input-text'
                        },
                        {
                          label: '字段名',
                          name: 'name',
                          type: 'input-text'
                        },
                        {
                          label: '最小值',
                          name: 'min',
                          type: 'input-number'
                        },
                        {
                          label: '最大值',
                          name: 'max',
                          type: 'input-number'
                        },
                        {
                          label: '步长',
                          name: 'step',
                          type: 'input-number'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },

        {
          title: 'Tabs',
          hash: 'tabs',
          body: [
            {
              type: 'form',
              api: '/api/mock2/saveForm?waitSeconds=2',
              title: '',
              mode: 'horizontal',
              wrapWithPanel: false,
              className: 'm-t',
              // debug: true,
              body: [
                {
                  type: 'combo',
                  name: 'combo101',
                  label: '组合多条多行',
                  multiple: true,
                  multiLine: true,
                  value: [{}],
                  tabsMode: true,
                  tabsStyle: 'card',
                  maxLength: 3,
                  items: [
                    {
                      name: 'a',
                      label: '文本',
                      type: 'input-text',
                      placeholder: '文本',
                      value: '',
                      size: 'full'
                    },
                    {
                      name: 'b',
                      label: '选项',
                      type: 'select',
                      options: ['a', 'b', 'c'],
                      size: 'full'
                    }
                  ]
                }
              ]
            }
          ]
        },

        {
          title: '其他',
          hash: 'others',
          body: [
            {
              type: 'form',
              api: '/api/mock2/saveForm?waitSeconds=2',
              title: '',
              mode: 'horizontal',
              wrapWithPanel: false,
              className: 'm-t',
              // debug: true,
              body: [
                {
                  type: 'input-text',
                  disabled: true,
                  label: '父级值',
                  name: 'a_super',
                  value: '123'
                },

                {
                  type: 'combo',
                  name: 'combo999',
                  label: '可获取父级数据',
                  multiple: true,
                  canAccessSuperData: true,
                  strictMode: false,
                  items: [
                    {
                      name: 'a_super',
                      type: 'input-text'
                    }
                  ]
                },

                {
                  type: 'combo',
                  name: 'combo9999',
                  label: '显示序号',
                  multiple: true,
                  items: [
                    {
                      type: 'tpl',
                      tpl: '<%= data.index + 1%>',
                      className: 'p-t-xs',
                      mode: 'inline'
                    },
                    {
                      name: 'a',
                      type: 'input-text'
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
