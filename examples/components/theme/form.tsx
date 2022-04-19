/**
 * @file 用于主题预览的表单样式
 */

export default {
  type: 'form',
  title: '表单项',
  mode: 'horizontal',
  wrapWithPanel: false,
  autoFocus: true,
  body: [
    {
      type: 'group',
      body: [
        {
          type: 'input-text',
          name: 'var1',
          label: '输入框'
        },
        {
          type: 'input-number',
          name: 'number',
          label: '数字',
          placeholder: '',
          inline: true,
          value: 5,
          min: 1,
          max: 10
        }
      ]
    },
    {
      type: 'group',
      body: [
        {
          type: 'input-tag',
          name: 'tag',
          label: '标签',
          placeholder: '',
          clearable: true,
          // dropdown: false, 保留原来的展现方式。
          // size: 'md',
          // inline: true,
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
              label: '野核',
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
          type: 'input-text',
          disabled: true,
          name: 'disabled',
          label: '禁用状态',
          placeholder: '这里禁止输入内容'
        }
      ]
    },
    {
      type: 'group',
      body: [
        {
          type: 'input-text',
          name: 'text-sug',
          label: '文本提示',
          options: ['lixiaolong', 'zhouxingxing', 'yipingpei', 'liyuanfang'],
          addOn: {
            type: 'input-text',
            label: '$'
          }
        },
        {
          type: 'input-text',
          name: 'text-sug-multiple',
          label: '文本提示多选',
          multiple: true,
          options: ['lixiaolong', 'zhouxingxing', 'yipingpei', 'liyuanfang']
        }
      ]
    },
    {
      type: 'button-toolbar',
      label: '按钮',
      buttons: [
        {
          type: 'action',
          label: '默认'
        },
        {
          type: 'action',
          label: '信息',
          level: 'info'
        },
        {
          type: 'action',
          label: '主要',
          level: 'primary'
        },
        {
          type: 'action',
          label: '次要',
          level: 'secondary'
        },
        {
          type: 'action',
          label: '成功',
          level: 'success'
        },
        {
          type: 'action',
          label: '警告',
          level: 'warning'
        },
        {
          type: 'action',
          label: '危险',
          level: 'danger'
        },
        {
          type: 'action',
          label: '浅色',
          level: 'light'
        },
        {
          type: 'action',
          label: '深色',
          level: 'dark'
        },
        {
          type: 'action',
          label: '链接',
          level: 'link'
        }
      ]
    },
    {
      type: 'group',
      body: [
        {
          type: 'radios',
          name: 'radios',
          label: '单选',
          value: 3,
          options: [
            {
              label: '选项1',
              value: 1
            },
            {
              label: '选项2',
              value: 2
            },
            {
              label: '选项3',
              disabled: true,
              value: 3
            }
          ]
        },
        {
          type: 'checkboxes',
          name: 'checkboxes',
          label: '多选框',
          value: 3,
          options: [
            {
              label: '选项1',
              value: 1
            },
            {
              label: '选项2',
              value: 2
            },
            {
              label: '选项3',
              disabled: true,
              value: 3
            }
          ]
        }
      ]
    },
    {
      type: 'group',
      body: [
        {
          type: 'switch',
          name: 'switch',
          onText: '开',
          offText: '关',
          label: '开关'
        },
        {
          type: 'switch',
          name: 'switch2',
          value: true,
          label: '开关开启'
        },
        {
          type: 'switch',
          name: 'switch3',
          value: true,
          disabled: true,
          label: '开关禁用'
        }
      ]
    },
    {
      type: 'group',
      body: [
        {
          type: 'button-group-select',
          name: 'btn-group',
          label: '按钮组',
          options: [
            {
              label: '选项 A',
              value: 1
            },
            {
              label: '选项 B',
              value: 2
            },
            {
              label: '选项 C',
              value: 3
            }
          ]
        },
        {
          type: 'list-select',
          name: 'List',
          label: 'List',
          options: [
            {
              label: '选项 A',
              value: 1
            },
            {
              label: '选项 B',
              value: 2
            },
            {
              label: '选项 C',
              value: 3
            }
          ]
        }
      ]
    },
    {
      type: 'group',
      body: [
        {
          type: 'select',
          name: 'type',
          label: '单选',
          inline: true,
          options: [
            {
              label: '选项1',
              value: 1
            },
            {
              label: '选项2',
              value: 2
            }
          ]
        },
        {
          type: 'select',
          name: 'type2',
          label: '多选',
          multiple: true,
          inline: true,
          options: [
            {
              label: '选项1',
              value: 1
            },
            {
              label: '选项2',
              value: 2
            }
          ]
        }
      ]
    },
    {
      type: 'group',
      body: [
        {
          type: 'input-date',
          name: 'date',
          inline: true,
          label: '日期'
        },
        {
          type: 'input-time',
          name: 'time',
          inline: true,
          label: '时间'
        }
      ]
    },
    {
      type: 'input-date-range',
      name: 'daterangee',
      inline: true,
      label: '时间范围'
    },
    {
      type: 'input-group',
      size: 'sm',
      inline: true,
      label: 'Icon 组合',
      body: [
        {
          type: 'icon',
          addOnclassName: 'no-bg',
          className: 'text-sm',
          icon: 'search'
          // "vendor": "iconfont"
        },
        {
          type: 'input-text',
          placeholder: '搜索作业ID/名称',
          inputClassName: 'b-l-none p-l-none',
          name: 'jobName'
        }
      ]
    },
    {
      type: 'input-tree',
      name: 'tree',
      label: '树',
      options: [
        {
          label: 'Folder A',
          value: 1,
          children: [
            {
              label: 'file A',
              value: 2
            },
            {
              label: 'file B',
              value: 3
            }
          ]
        },
        {
          label: 'file C',
          value: 4
        },
        {
          label: 'file D',
          value: 5
        }
      ]
    },
    {
      type: 'group',
      body: [
        {
          type: 'input-tree',
          name: 'trees',
          label: '树多选',
          multiple: true,
          options: [
            {
              label: 'Folder A',
              value: 1,
              children: [
                {
                  label: 'file A',
                  value: 2
                },
                {
                  label: 'file B',
                  value: 3
                }
              ]
            },
            {
              label: 'file C',
              value: 4
            },
            {
              label: 'file D',
              value: 5
            }
          ]
        },
        {
          type: 'nested-select',
          name: 'nestedSelect',
          label: '级联选择器',
          options: [
            {
              label: '概念',
              value: 'concepts',
              children: [
                {
                  label: '配置与组件',
                  value: 'schema'
                },
                {
                  label: '数据域与数据链',
                  value: 'scope'
                },
                {
                  label: '模板',
                  value: 'template'
                },
                {
                  label: '数据映射',
                  value: 'data-mapping'
                },
                {
                  label: '表达式',
                  value: 'expression'
                },
                {
                  label: '联动',
                  value: 'linkage'
                },
                {
                  label: '行为',
                  value: 'action'
                },
                {
                  label: '样式',
                  value: 'style'
                }
              ]
            },
            {
              label: '类型',
              value: 'types',
              children: [
                {
                  label: 'SchemaNode',
                  value: 'schemanode'
                },
                {
                  label: 'API',
                  value: 'api'
                },
                {
                  label: 'Definitions',
                  value: 'definitions'
                }
              ]
            },
            {
              label: '组件',
              value: 'zujian',
              children: [
                {
                  label: '布局',
                  value: 'buju',
                  children: [
                    {
                      label: 'Page 页面',
                      value: 'page'
                    },
                    {
                      label: 'Container 容器',
                      value: 'container'
                    },
                    {
                      label: 'Collapse 折叠器',
                      value: 'Collapse'
                    }
                  ]
                },
                {
                  label: '功能',
                  value: 'gongneng',
                  children: [
                    {
                      label: 'Action 行为按钮',
                      value: 'action-type'
                    },
                    {
                      label: 'App 多页应用',
                      value: 'app'
                    },
                    {
                      label: 'Button 按钮',
                      value: 'button'
                    }
                  ]
                },
                {
                  label: '数据输入',
                  value: 'shujushuru',
                  children: [
                    {
                      label: 'Form 表单',
                      value: 'form'
                    },
                    {
                      label: 'FormItem 表单项',
                      value: 'formitem'
                    },
                    {
                      label: 'Options 选择器表单项',
                      value: 'options'
                    }
                  ]
                },
                {
                  label: '数据展示',
                  value: 'shujuzhanshi',
                  children: [
                    {
                      label: 'CRUD 增删改查',
                      value: 'crud'
                    },
                    {
                      label: 'Table 表格',
                      value: 'table'
                    },
                    {
                      label: 'Card 卡片',
                      value: 'card'
                    }
                  ]
                },
                {
                  label: '反馈',
                  value: 'fankui'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      type: 'matrix-checkboxes',
      name: 'matrix',
      label: '矩阵开关',
      rowLabel: '行标题说明',
      columns: [
        {
          label: '列1'
        },
        {
          label: '列2'
        }
      ],
      rows: [
        {
          label: '行1'
        },
        {
          label: '行2'
        }
      ]
    },
    {
      type: 'combo',
      name: 'combo2',
      label: '组合多条',
      multiple: true,
      value: [{}],
      items: [
        {
          name: 'a',
          type: 'input-text',
          placeholder: 'A'
        },
        {
          name: 'b',
          type: 'select',
          options: ['a', 'b', 'c']
        }
      ]
    },
    {
      type: 'input-file',
      name: 'file',
      label: '文件上传',
      joinValues: false
    },
    {
      type: 'input-range',
      name: 'range',
      label: '范围'
    },
    {
      type: 'divider'
    }
  ],
  actions: []
};
