export default {
  title: '其他类型演示',
  body: [
    {
      type: 'form',
      api: '/api/mock2/saveForm?waitSeconds=2',
      title: 'Hint demo',
      mode: 'horizontal',
      horizontal: {
        leftFixed: true
      },
      body: [
        {
          type: 'input-group',
          size: 'md',
          label: 'Icon 组合',
          body: [
            {
              type: 'icon',
              addOnclassName: 'no-bg',
              className: 'text-sm',
              icon: 'search',
              vendor: 'iconfont'
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
          name: 'a',
          type: 'input-text',
          label: 'ID',
          value: '',
          size: 'xs',
          hint: '比如输入 a-xxxx-xxx'
        },

        {
          name: 'b',
          type: 'input-text',
          label: 'ID',
          value: '',
          size: 'sm',
          hint: '比如输入 a-xxxx-xxx'
        },

        {
          name: 'c',
          type: 'input-text',
          label: 'ID',
          value: '',
          size: 'md',
          hint: '比如输入 a-xxxx-xxx'
        },

        {
          name: 'd',
          type: 'input-text',
          label: 'ID',
          value: '',
          size: 'lg',
          hint: '比如输入 a-xxxx-xxx'
        },

        {
          name: 'tag',
          type: 'input-tag',
          label: 'Tag',
          size: 'md',
          clearable: true,
          placeholder: '多个标签以逗号分隔',
          options: ['周小度', '杜小度']
        }
      ]
    }
  ]
};
