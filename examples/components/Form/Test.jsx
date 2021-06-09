export default {
  type: 'page',
  body: {
    type: 'form',
    title: '详情',
    name: 'scene_detail',
    mode: 'horizontal',
    submitText: '',
    submitOnChange: false,
    actions: [
      {
        type: 'button',
        label: '修改',
        actionType: 'drawer',
        drawer: {
          type: 'form',
          position: 'left',
          title: '修改内容',
          body: [
            {
              type: 'input-text',
              label: '标题',
              name: 'name',
              required: true
            },
            {
              label: '描述',
              type: 'input-text',
              name: 'typeDesc',
              required: true
            },
            {
              label: '内容',
              type: 'textarea',
              name: 'contents',
              required: true
            }
          ]
        }
      }
    ],
    body: [
      {
        type: 'input-tree',
        name: 'tree',
        label: '树',
        options: [
          {
            label: 'Folder A',
            value: 1,
            children: [
              {
                label: 'file A',
                value: 2
              },
              {
                label: 'file B',
                value: 3
              }
            ]
          },
          {
            label: 'file C',
            value: 4
          },
          {
            label: 'file D',
            value: 5
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        type: 'tree',
        name: 'trees',
        label: '树多选',
        multiple: true,
        options: [
          {
            label: 'Folder A',
            value: 1,
            children: [
              {
                label: 'file A',
                value: 2
              },
              {
                label: 'file B',
                value: 3
              }
            ]
          },
          {
            label: 'file C',
            value: 4
          },
          {
            label: 'file D',
            value: 5
          }
        ]
      },
      {
        type: 'divider'
      },

      {
        name: 'select',
        type: 'tree-select',
        label: '动态选项',
        source: '/api/mock2/form/getTreeOptions?waitSeconds=1',
        description: '通过接口一口气拉取选项',
        clearable: true,
        searchable: true
      },
      {
        type: 'divider'
      },
      {
        name: 'select2',
        type: 'tree-select',
        label: '选项自动补全',
        autoComplete: '/api/mock2/tree/autoComplete?term=$term',
        placeholder: '请输入',
        description: '通过接口自动补全',
        multiple: true
      }
    ]
  }
};
