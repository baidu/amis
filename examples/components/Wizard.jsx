export default {
  title: '表单向导',
  body: [
    {
      type: 'wizard',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      initApi: '/api/mock2/form/initData?waitSeconds=2',
      steps: [
        {
          title: '第一步',
          body: [
            {
              name: 'website',
              label: '网址',
              type: 'input-url',
              required: true
            },
            {
              name: 'name',
              label: '名称',
              type: 'input-text',
              required: true
            }
          ]
        },
        {
          title: 'Step 2',
          body: [
            {
              name: 'email2',
              label: '邮箱',
              type: 'input-email',
              required: true
            }
          ]
        },
        {
          title: 'Step 3',
          body: ['这是最后一步了']
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
          body: [
            {
              name: 'website',
              label: '网址',
              type: 'input-url',
              required: true
            },
            {
              name: 'email',
              label: '邮箱',
              type: 'input-email',
              required: true
            }
          ]
        },
        {
          title: 'Step 2',
          body: [
            {
              name: 'email2',
              label: '邮箱',
              type: 'input-email',
              required: true
            }
          ]
        },
        {
          title: 'Step 3',
          body: ['这是最后一步了']
        }
      ]
    },
    {
      type: 'wizard',
      steps: [
        {
          title: '第一步',
          body: [
            {
              name: 'website',
              label: '网址',
              type: 'input-url',
              required: true
            },
            {
              name: 'email',
              label: '邮箱',
              type: 'input-email',
              required: true
            }
          ],
          api: '/api/mock2/form/saveForm?waitSeconds=2'
        },
        {
          title: '第二步',
          body: [
            {
              name: 'test1',
              type: 'input-email',
              label: 'Email',
              value: 'test@test.com'
            },
            {
              type: 'divider'
            },
            {
              type: 'input-text',
              name: 'test2',
              label: '必填示例',
              required: true
            },
            {
              type: 'divider'
            },
            {
              type: 'input-text',
              name: 'test3',
              placeholder: '可选'
            }
          ],
          initApi: '/api/mock2/form/initForm',
          api: '/api/mock2/form/saveForm?waitSeconds=2'
        },
        {
          title: '确定',
          body: ['最后一步了，确认要提交吗？'],
          api: '/api/mock2/form/saveForm?waitSeconds=2'
        }
      ]
    }
  ]
};
