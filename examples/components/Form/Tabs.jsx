export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
  title: 'Tabs 示例',
  body: [
    {
      type: 'form',
      mode: 'horizontal',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      title: '',
      actions: [
        {
          type: 'button',
          actionType: 'dialog',
          label: '弹框中的 Tabs',
          level: 'info',
          dialog: {
            title: '',
            // size: "md",
            body: {
              type: 'form',
              mode: 'horizontal',
              horizontal: {
                leftFixed: 'xs'
              },
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
                  type: 'tabs',
                  tabs: [
                    {
                      title: '基本信息',
                      controls: [
                        {
                          type: 'group',
                          controls: [
                            {
                              type: 'email',
                              name: 'email1',
                              placeholder: '请输入邮箱地址',
                              label: '邮箱'
                            },
                            {
                              type: 'password',
                              name: 'password',
                              placeholder: '密码',
                              label: false
                            }
                          ]
                        },
                        {
                          type: 'divider'
                        },
                        {
                          type: 'group',
                          controls: [
                            {
                              type: 'email',
                              name: 'email2',
                              placeholder: '请输入邮箱地址',
                              label: '邮箱'
                            },
                            {
                              type: 'checkbox',
                              name: 'rememberMe',
                              label: false,
                              option: '记住我'
                            }
                          ]
                        }
                      ]
                    },
                    {
                      title: '其他信息',
                      controls: [
                        {
                          type: 'email',
                          name: 'email3',
                          placeholder: '请输入邮箱地址',
                          label: '邮箱'
                        },
                        {
                          type: 'divider'
                        },
                        {
                          type: 'checkbox',
                          name: 'rememberMe2',
                          option: '记住我'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          }
        },
        {
          type: 'submit',
          label: '提交',
          primary: true
        }
      ],
      controls: [
        {
          type: 'tabs',
          name: 'outertabs',
          className: 'm-b',
          tabs: [
            {
              title: '基本信息',
              hash: 'tab1',
              controls: [
                {
                  type: 'group',
                  controls: [
                    {
                      type: 'email',
                      name: 'email',
                      placeholder: '请输入邮箱地址',
                      label: '邮箱'
                    },
                    {
                      type: 'password',
                      name: 'password',
                      placeholder: '密码',
                      label: false
                    }
                  ]
                },
                {
                  type: 'divider'
                },
                {
                  type: 'group',
                  controls: [
                    {
                      type: 'email',
                      name: 'email2',
                      placeholder: '请输入邮箱地址',
                      label: '邮箱'
                    },
                    {
                      type: 'checkbox',
                      name: 'rememberMe',
                      label: false,
                      option: '记住我'
                    }
                  ]
                }
              ]
            },
            {
              title: '其他信息',
              hash: 'tab2',
              controls: [
                {
                  type: 'email',
                  name: 'email3',
                  placeholder: '请输入邮箱地址',
                  label: '邮箱'
                },
                {
                  type: 'divider'
                },
                {
                  type: 'checkbox',
                  name: 'rememberMe4',
                  label: '记住我'
                }
              ]
            }
          ]
        },

        {
          type: 'radios',
          name: 'outertabs',
          label: 'Tabs值',
          mode: 'normal',
          description:
            '如果 tabs 设置了 name 是可以跟表单值联动的，默认并不会开启此功能。',
          options: [
            {
              label: '基本信息',
              value: '基本信息'
            },
            {
              label: '其他信息',
              value: '其他信息'
            }
          ]
        }
      ]
    }
  ]
};
