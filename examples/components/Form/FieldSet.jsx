export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
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
      controls: [
        {
          type: 'fieldSet',
          title: '基本信息',
          collapsable: true,
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
              controls: [
                {
                  type: 'email',
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
          controls: [
            {
              type: 'email',
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
      controls: [
        {
          title: '超级小',
          type: 'fieldSet',
          className: 'fieldset-xs',
          controls: [
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
          controls: [
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
          controls: [
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
          controls: [
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
          controls: [
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
