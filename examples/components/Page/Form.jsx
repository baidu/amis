export default {
  type: 'page',
  title: '表单页面',
  body: {
    type: 'form',
    mode: 'horizontal',
    title: '',
    api: '/api/mock2/form/saveForm',
    controls: [
      {
        label: 'Name',
        type: 'text',
        name: 'name'
      },

      {
        label: 'Email',
        type: 'email',
        name: 'email'
      },

      {
        label: 'Transfer',
        type: 'transfer',
        name: 'transfer',
        sortable: true,
        selectMode: 'nested',
        searchable: true,
        options: [
          {
            label: '诸葛亮',
            value: 'zhugeliang'
          },
          {
            label: '曹操',
            value: 'caocao'
          },
          {
            label: '钟无艳',
            value: 'zhongwuyan'
          },
          {
            label: '野核',
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
      },

      {
        label: 'Transfer',
        type: 'tabs-transfer',
        name: 'transfer2',
        sortable: true,
        selectMode: 'tree',
        searchable: true,
        options: [
          {
            label: '成员',
            selectMode: 'tree',
            children: [
              {
                label: '诸葛亮',
                value: 'zhugeliang'
              },
              {
                label: '曹操',
                value: 'caocao'
              },
              {
                label: '钟无艳',
                value: 'zhongwuyan'
              },
              {
                label: '野核',
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
          },

          {
            label: '用户',
            children: [
              {
                label: '诸葛亮',
                value: 'zhugeliang2'
              },
              {
                label: '曹操',
                value: 'caocao2'
              },
              {
                label: '钟无艳',
                value: 'zhongwuyan2'
              },
              {
                label: '野核',
                children: [
                  {
                    label: '李白',
                    value: 'libai2'
                  },
                  {
                    label: '韩信',
                    value: 'hanxin2'
                  },
                  {
                    label: '云中君',
                    value: 'yunzhongjun2'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
