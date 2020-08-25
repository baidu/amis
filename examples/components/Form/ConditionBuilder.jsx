export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
  title: '条件生成器',
  body: [
    {
      type: 'form',
      api: '/api/mock2/saveForm?waitSeconds=2',
      title: '',
      mode: 'horizontal',
      horizontal: {
        leftFixed: true
      },
      actions: [
        {
          label: '查看数据',
          type: 'button',
          actionType: 'dialog',
          dialog: {
            title: '数据',
            body: '<pre>${conditions|json:2}</pre>'
          }
        }
      ],
      controls: [
        {
          type: 'condition-builder',
          label: '条件组件',
          name: 'conditions',
          description:
            '适合让用户自己拼查询条件，然后后端根据数据生成 query where',
          fields: [
            {
              label: '文本',
              type: 'text',
              name: 'text'
            },
            {
              label: '数字',
              type: 'number',
              name: 'number'
            },
            {
              label: '布尔',
              type: 'boolean',
              name: 'boolean'
            },
            {
              label: '选项',
              type: 'select',
              name: 'select',
              options: [
                {
                  label: 'A',
                  value: 'a'
                },
                {
                  label: 'B',
                  value: 'b'
                },
                {
                  label: 'C',
                  value: 'c'
                },
                {
                  label: 'D',
                  value: 'd'
                },
                {
                  label: 'E',
                  value: 'e'
                }
              ]
            },
            {
              label: '日期',
              children: [
                {
                  label: '日期',
                  type: 'date',
                  name: 'date'
                },
                {
                  label: '时间',
                  type: 'time',
                  name: 'time'
                },
                {
                  label: '日期时间',
                  type: 'datetime',
                  name: 'datetime'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
