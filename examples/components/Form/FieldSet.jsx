export default {
  title: 'FieldSet 示例',
  body: [
    {
      type: 'form',
      mode: 'horizontal',
      api: '/api/mock2/saveForm?waitSeconds=2',
      actions: [
        {
          type: 'submit',
          label: '提交',
          primary: true
        }
      ],
      collapsable: true,
      title: 'fieldSet 可以对表单元素做个分组',
      body: [
        {
          type: 'fieldSet',
          title: '基本信息',
          collapsable: true,
          body: [
            {
              type: 'group',
              body: [
                {
                  type: 'input-email',
                  name: 'email',
                  placeholder: '请输入邮箱地址',
                  label: '邮箱'
                },
                {
                  type: 'input-password',
                  name: 'password',
                  label: false,
                  placeholder: 'Password'
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
                  placeholder: '请输入邮箱地址',
                  label: '邮箱'
                },
                {
                  type: 'checkbox',
                  name: 'rememberMe',
                  label: false,
                  option: 'Remember me'
                }
              ]
            }
          ]
        },

        {
          title: '其他信息',
          type: 'fieldSet',
          body: [
            {
              type: 'input-email',
              name: 'email',
              placeholder: '请输入邮箱地址',
              label: '邮箱'
            },
            {
              type: 'divider'
            },
            {
              type: 'checkbox',
              name: 'rememberMe',
              option: '记住我'
            }
          ]
        }
      ]
    },
    {
      title: 'FieldSet 样式集',
      type: 'form',
      body: [
        {
          title: '超级小',
          type: 'fieldSet',
          className: 'fieldset-xs',
          body: [
            {
              type: 'plain',
              text: '文本 ...'
            }
          ]
        },
        {
          title: '小尺寸',
          type: 'fieldSet',
          className: 'fieldset-sm',
          body: [
            {
              type: 'plain',
              text: '文本 ...'
            }
          ]
        },
        {
          title: '正常尺寸',
          type: 'fieldSet',
          className: 'fieldset',
          body: [
            {
              type: 'plain',
              text: '文本 ...'
            }
          ]
        },
        {
          title: '中大尺寸',
          type: 'fieldSet',
          className: 'fieldset-md',
          body: [
            {
              type: 'plain',
              text: '文本 ...'
            }
          ]
        },
        {
          title: '超大尺寸',
          type: 'fieldSet',
          className: 'fieldset-lg',
          body: [
            {
              type: 'plain',
              text: '文本 ...'
            }
          ]
        }
      ]
    }
  ]
};
