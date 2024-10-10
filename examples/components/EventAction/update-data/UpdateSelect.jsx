export default {
  type: 'page',
  id: 'mypage',
  data: {
    singleData: 'a',
    multipleData: 'caocao,libai'
  },
  body: [
    {
      type: 'alert',
      body: '直接更新指定下拉框的选中值。',
      level: 'info',
      className: 'mb-1'
    },
    {
      type: 'button',
      label: '更新单选数据',
      level: 'primary',
      className: 'mt-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'single-select',
              args: {
                value: '${singleData}'
              }
            }
          ]
        }
      }
    },
    {
      label: '选项',
      type: 'select',
      name: 'single-select',
      id: 'single-select',
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
        }
      ]
    },
    {
      type: 'button',
      label: '更新多选数据',
      level: 'primary',
      className: 'mt-2 mb-2',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'setValue',
              componentId: 'multiple-select',
              args: {
                value: '${multipleData}'
              }
            }
          ]
        }
      }
    },
    {
      label: '分组',
      type: 'select',
      name: 'multiple-select',
      id: 'multiple-select',
      multiple: true,
      selectMode: 'group',
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
};
