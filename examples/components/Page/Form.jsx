export default {
  type: 'page',
  title: '表单页面',
  body: [
    {
      type: 'form',
      mode: 'horizontal',
      api: '/api/mock2/form/saveForm',
      body: [
        {
          label: 'Name',
          type: 'input-text',
          name: 'name'
        },

        {
          label: 'Email',
          type: 'input-email',
          placeholder: '请输入邮箱地址',
          name: 'email'
        },

        {
          label: '默认',
          type: 'select',
          name: 'select',
          searchable: true,
          options: [
            {
              label: '曹操',
              value: 'caocao'
            },
            {
              label: '钟无艳',
              value: 'zhongwuyan'
            }
          ]
        },

        {
          label: '分组',
          type: 'select',
          selectMode: 'chained',
          name: 'transfer',
          searchable: true,
          options: [
            {
              label: '法师',
              children: [
                {
                  label: '诸葛亮',
                  value: 'zhugeliang'
                }
              ]
            },
            {
              label: '战士',
              children: [
                {
                  label: '曹操',
                  value: 'caocao'
                },
                {
                  label: '钟无艳',
                  value: 'zhongwuyan'
                }
              ]
            },
            {
              label: '打野',
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
        }
      ]
    }
  ]
};
