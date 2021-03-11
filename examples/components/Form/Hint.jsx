export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
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
      controls: [
        {
          name: 'button',
          type: 'button',
          label: 'ID',
          value: '',
          size: 'xs',
          hint: '比如输入 a-xxxx-xxx'
        },

        {
          type: 'input-group',
          size: 'md',
          label: 'Icon 组合',
          controls: [
            {
              type: 'icon',
              addOnclassName: 'no-bg',
              className: 'text-sm',
              icon: 'search',
              vendor: 'iconfont'
            },
            {
              type: 'text',
              placeholder: '搜索作业ID/名称',
              inputClassName: 'b-l-none p-l-none',
              name: 'jobName'
            }
          ]
        },

        {
          name: 'a',
          type: 'text',
          label: 'ID',
          value: '',
          size: 'xs',
          hint: '比如输入 a-xxxx-xxx'
        },

        {
          name: 'b',
          type: 'text',
          label: 'ID',
          value: '',
          size: 'sm',
          hint: '比如输入 a-xxxx-xxx'
        },

        {
          name: 'c',
          type: 'text',
          label: 'ID',
          value: '',
          size: 'md',
          hint: '比如输入 a-xxxx-xxx'
        },

        {
          name: 'd',
          type: 'text',
          label: 'ID',
          value: '',
          size: 'lg',
          hint: '比如输入 a-xxxx-xxx'
        },

        {
          name: 'tag',
          type: 'tag',
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
