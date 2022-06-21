export default {
  title: '表单各种展示模式汇总',
  remark: '展示各种模式的 Form',
  body: [
    {
      type: 'grid',
      columns: [
        {
          type: 'form',
          api: '/api/mock2/form/saveForm?waitSeconds=2',
          title: '常规模式',
          mode: 'normal',
          body: [
            {
              type: 'input-email',
              name: 'email',
              required: true,
              placeholder: '请输入邮箱',
              label: '邮箱',
              size: 'full'
            },
            {
              type: 'input-password',
              name: 'password',
              label: '密码',
              required: true,
              placeholder: '请输入密码',
              size: 'full'
            },
            {
              type: 'checkbox',
              name: 'rememberMe',
              label: '记住登录'
            },
            {
              type: 'submit',
              label: '登录'
            }
          ]
        },
        {
          type: 'form',
          api: '/api/mock2/form/saveForm?waitSeconds=2',
          title: '常规模式 input md 尺寸',
          mode: 'normal',
          body: [
            {
              type: 'input-email',
              name: 'email',
              required: true,
              placeholder: '请输入邮箱',
              label: '邮箱',
              size: 'md',
              remark: 'xxxx',
              hint: 'bla bla bla'
            },
            {
              type: 'input-password',
              name: 'password',
              label: '密码',
              required: true,
              placeholder: '请输入密码',
              size: 'md'
            },
            {
              type: 'checkbox',
              name: 'rememberMe',
              label: '记住登录'
            },
            {
              type: 'submit',
              label: '登录'
            }
          ]
        }
      ]
    },

    {
      type: 'grid',
      columns: [
        {
          type: 'form',
          api: '/api/mock2/form/saveForm?waitSeconds=2',
          title: '水平模式，左右摆放 左右比率分配 ',
          mode: 'horizontal',
          autoFocus: false,
          horizontal: {
            left: 'col-sm-2',
            right: 'col-sm-10',
            offset: 'col-sm-offset-2'
          },
          body: [
            {
              type: 'input-email',
              name: 'email',
              placeholder: '请输入邮箱地址',
              label: '邮箱',
              required: true,
              desc: '表单描述文字'
            },
            {
              type: 'input-password',
              name: 'password',
              label: '密码',
              placeholder: '输入密码'
            },
            {
              type: 'checkbox',
              name: 'rememberMe',
              label: '记住登录'
            },
            {
              type: 'control',
              body: {
                type: 'submit',
                label: 'Submit'
              }
            }
          ]
        },
        {
          type: 'form',
          api: '/api/mock2/form/saveForm?waitSeconds=2',
          title: '水平模式，左右摆放 左侧固定宽度 input md 尺寸',
          mode: 'horizontal',
          autoFocus: false,
          horizontal: {
            leftFixed: 'xs'
          },
          body: [
            {
              type: 'input-email',
              name: 'email',
              placeholder: '请输入邮箱地址',
              label: '邮箱',
              required: true,
              desc: '表单描述文字',
              size: 'md',
              remark: 'xxxx',
              hint: 'bla bla bla'
            },
            {
              type: 'input-password',
              name: 'password',
              label: '密码',
              placeholder: '输入密码',
              size: 'md'
            },
            {
              type: 'checkbox',
              name: 'rememberMe',
              label: '记住登录'
            },
            {
              type: 'control',
              body: {
                type: 'submit',
                label: 'Submit'
              }
            }
          ]
        }
      ]
    },
    {
      type: 'form',
      className: 'm-b',
      // debug: true,
      body: [
        {
          type: 'property',
          title: '机器配置',
          items: [
            {
              label: 'cpu',
              content: {
                type: 'select',
                name: 'cpu',
                value: '1',
                options: [
                  {
                    label: '1 core',
                    value: '1'
                  },
                  {
                    label: '4 core',
                    value: '4'
                  },
                  {
                    label: '8 core',
                    value: '8'
                  }
                ]
              }
            },
            {
              label: 'memory',
              content: '4G'
            },
            {
              label: 'disk',
              content: '80G'
            },
            {
              label: 'network',
              content: '4M',
              span: 2
            },
            {
              label: 'IDC',
              content: 'beijing'
            },
            {
              label: 'Note',
              content: {
                type: 'textarea',
                required: true,
                name: 'note',
                placeholder: 'Enter...'
              },
              span: 3
            }
          ]
        }
      ],
      actions: [
        {
          type: 'submit',
          label: 'Submit'
        }
      ]
    },
    {
      type: 'form',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      title: '内联模式',
      mode: 'inline',
      autoFocus: false,
      body: [
        {
          type: 'input-email',
          name: 'email',
          placeholder: 'Enter Email',
          label: '邮箱'
        },
        {
          type: 'input-date-range',
          name: 'date',
          label: '日期'
        },
        {
          type: 'input-password',
          name: 'password',
          placeholder: '密码',
          remark: 'Bla bla bla'
        },
        {
          type: 'checkbox',
          name: 'rememberMe',
          label: '记住登录'
        },
        {
          type: 'submit',
          label: '登录'
        },
        {
          type: 'button',
          label: '导出',
          url: 'http://www.baidu.com/',
          level: 'success'
        }
      ]
    },
    {
      type: 'form',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      title: '常规模式下用数组包起来还能控制一行显示多个',
      mode: 'normal',
      autoFocus: false,
      body: [
        {
          type: 'input-text',
          name: 'name',
          placeholder: '请输入...',
          label: '名字',
          size: 'full'
        },
        {
          type: 'divider'
        },
        {
          type: 'group',
          body: [
            {
              type: 'input-email',
              name: 'email',
              placeholder: '输入邮箱',
              label: '邮箱',
              size: 'full'
            },
            {
              type: 'input-password',
              name: 'password',
              label: '密码',
              placeholder: '请输入密码',
              size: 'full'
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'group',
          body: [
            {
              type: 'input-email',
              name: 'email2',
              mode: 'inline',
              placeholder: '请输入邮箱地址',
              label: '邮箱',
              size: 'full'
            },
            {
              type: 'input-password',
              name: 'password2',
              label: '密码',
              mode: 'inline',
              placeholder: '请输入密码',
              size: 'full'
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'group',
          body: [
            {
              type: 'input-email',
              name: 'email3',
              mode: 'inline',
              placeholder: '请输入邮箱地址',
              label: '邮箱',
              size: 'full',
              columnClassName: 'v-bottom'
            },
            {
              type: 'input-password',
              name: 'password3',
              label: '密码',
              placeholder: '请输入密码',
              size: 'full'
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'group',
          body: [
            {
              type: 'input-email',
              name: 'email4',
              placeholder: '请输入邮箱地址',
              label: '邮箱',
              size: 'full'
            },
            {
              type: 'input-password',
              name: 'password4',
              label: '密码',
              placeholder: '请输入密码',
              mode: 'inline',
              size: 'full',
              columnClassName: 'v-bottom'
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'checkbox',
          name: 'rememberMe',
          label: '记住我'
        },
        {
          type: 'submit',
          label: '提交'
        }
      ]
    },
    {
      type: 'form',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      title: '水平模式用数组包起来也能控制一行显示多个',
      mode: 'horizontal',
      autoFocus: false,
      body: [
        {
          type: 'input-email',
          name: 'email',
          placeholder: '请输入邮箱地址',
          label: '邮箱',
          size: 'full'
        },
        {
          type: 'divider'
        },
        {
          type: 'group',
          body: [
            {
              type: 'input-email',
              name: 'email2',
              placeholder: '请输入邮箱地址',
              label: '邮箱',
              size: 'full'
            },
            {
              type: 'input-password',
              name: 'password2',
              label: '密码',
              placeholder: '请输入密码',
              size: 'full'
            }
          ]
        },

        {
          type: 'divider'
        },
        {
          type: 'group',
          body: [
            {
              type: 'input-email',
              name: 'email3',
              placeholder: '请输入邮箱地址',
              label: '邮箱',
              size: 'full'
            },
            {
              type: 'input-password',
              name: 'password3',
              label: '密码',
              placeholder: '请输入密码',
              size: 'full'
            },
            {
              type: 'input-password',
              name: 'password3',
              label: '密码',
              placeholder: '请输入密码',
              size: 'full'
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'group',
          body: [
            {
              type: 'input-email',
              name: 'email4',
              placeholder: '请输入邮箱地址',
              label: '邮箱',
              size: 'full',
              columnClassName: 'col-sm-6',
              horizontal: {
                left: 'col-sm-4',
                right: 'col-sm-8'
              }
            },
            {
              type: 'input-password',
              name: 'password4',
              label: '密码',
              placeholder: '请输入密码',
              mode: 'inline',
              size: 'full'
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'group',
          label: '邮箱',
          gap: 'xs',
          body: [
            {
              label: false,
              type: 'input-email',
              name: 'email5',
              placeholder: '请输入邮箱地址',
              size: 'full'
            },
            {
              type: 'input-password',
              name: 'password5',
              label: '密码',
              placeholder: '请输入密码',
              mode: 'inline',
              size: 'full'
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'group',
          label: '邮箱',
          description: 'bla bla',
          gap: 'xs',
          body: [
            {
              type: 'input-email',
              name: 'email6',
              placeholder: '请输入邮箱地址',
              mode: 'inline'
            },
            {
              type: 'input-password',
              name: 'password6',
              // label: "密码",
              placeholder: '请输入密码',
              labelClassName: 'w-auto p-r-none',
              mode: 'inline'
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'group',
          label: '邮箱',
          description: 'bla bla',
          direction: 'vertical',
          body: [
            {
              type: 'input-email',
              name: 'email9',
              mode: 'normal',
              placeholder: '请输入邮箱地址',
              inline: true,
              description: 'Bla blamfejkf fdjk'
            },
            {
              type: 'input-password',
              name: 'password9',
              mode: 'normal',
              placeholder: '请输入密码',
              labelClassName: 'w-auto p-r-none'
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'checkbox',
          name: 'rememberMe',
          label: '记住我'
        },
        {
          type: 'submit',
          label: 'Submit'
        }
      ]
    },
    {
      type: 'form',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      title: 'Inline form  用数组包起来还能控制一行显示多个',
      mode: 'inline',
      submitText: null,
      autoFocus: false,
      body: [
        {
          type: 'group',
          body: [
            {
              type: 'input-email',
              name: 'email',
              placeholder: 'Enter Email',
              label: '邮箱',
              size: 'full'
            },
            {
              type: 'input-password',
              name: 'password',
              placeholder: 'Password',
              size: 'full'
            }
          ]
        },
        {
          type: 'divider'
        },
        {
          type: 'group',
          body: [
            {
              type: 'input-email',
              name: 'email',
              placeholder: 'Enter Email',
              label: '邮箱',
              size: 'full'
            },
            {
              type: 'checkbox',
              name: 'rememberMe',
              label: '记住我',
              size: 'full'
            },
            {
              type: 'button-toolbar',
              buttons: [
                {
                  type: 'submit',
                  label: '登录'
                },
                {
                  type: 'button',
                  label: '导出',
                  url: 'http://www.baidu.com/',
                  level: 'success'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
