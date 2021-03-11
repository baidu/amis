export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
  title: '表单向导',
  body: [
    {
      type: 'wizard',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      initApi: '/api/mock2/form/initData?waitSeconds=2',
      steps: [
        {
          title: '第一步',
          controls: [
            {
              name: 'website',
              label: '网址',
              type: 'url',
              required: true
            },
            {
              name: 'name',
              label: '名称',
              type: 'text',
              required: true
            }
          ]
        },
        {
          title: 'Step 2',
          controls: [
            {
              name: 'email2',
              label: '邮箱',
              type: 'email',
              required: true
            }
          ]
        },
        {
          title: 'Step 3',
          controls: ['这是最后一步了']
        }
      ]
    },
    {
      type: 'wizard',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      mode: 'vertical',
      steps: [
        {
          title: '第一步',
          controls: [
            {
              name: 'website',
              label: '网址',
              type: 'url',
              required: true
            },
            {
              name: 'email',
              label: '邮箱',
              type: 'email',
              required: true
            }
          ]
        },
        {
          title: 'Step 2',
          controls: [
            {
              name: 'email2',
              label: '邮箱',
              type: 'email',
              required: true
            }
          ]
        },
        {
          title: 'Step 3',
          controls: ['这是最后一步了']
        }
      ]
    },
    {
      type: 'wizard',
      steps: [
        {
          title: '第一步',
          controls: [
            {
              name: 'website',
              label: '网址',
              type: 'url',
              required: true
            },
            {
              name: 'email',
              label: '邮箱',
              type: 'email',
              required: true
            }
          ],
          api: '/api/mock2/form/saveForm?waitSeconds=2'
        },
        {
          title: '第二步',
          controls: [
            {
              name: 'test1',
              type: 'email',
              label: 'Email',
              value: 'test@test.com'
            },
            {
              type: 'divider'
            },
            {
              type: 'text',
              name: 'test2',
              label: '必填示例',
              required: true
            },
            {
              type: 'divider'
            },
            {
              type: 'text',
              name: 'test3',
              placeholder: '可选'
            }
          ],
          initApi: '/api/mock2/form/initForm',
          api: '/api/mock2/form/saveForm?waitSeconds=2'
        },
        {
          title: '确定',
          controls: ['最后一步了，确认要提交吗？'],
          api: '/api/mock2/form/saveForm?waitSeconds=2'
        }
      ]
    }
  ]
};
