export default {
  title: '动态拉取选项',
  name: 'page-form-remote',
  body: [
    {
      type: 'form',
      title: '动态表单元素示例',
      name: 'demo-form',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      mode: 'horizontal',
      actions: [
        {
          type: 'submit',
          label: '提交'
        }
      ],
      body: [
        {
          name: 'select',
          type: 'select',
          label: '动态选项',
          source: '/api/mock2/form/getOptions?waitSeconds=1',
          description: '通过接口一口气拉取选项',
          clearable: true,
          searchable: true
        },
        {
          type: 'divider'
        },
        {
          name: 'select2',
          type: 'select',
          label: '选项自动补全',
          autoComplete: '/api/mock2/options/autoComplete?term=$term',
          placeholder: '请输入',
          description: '通过接口自动补全'
        },
        {
          type: 'divider'
        },
        {
          type: 'input-text',
          name: 'text',
          label: '文本提示',
          source: '/api/mock2/form/getOptions?waitSeconds=1',
          placeholder: '请选择',
          creatable: true
        },
        {
          type: 'divider'
        },
        {
          name: 'text2',
          type: 'input-text',
          label: '文本自动补全',
          clearable: true,
          autoComplete: '/api/mock2/options/autoComplete2?term=$term',
          description: '通过接口自动补全'
        },
        {
          name: 'chained',
          type: 'chained-select',
          label: '级联选项',
          source:
            '/api/mock2/options/chainedOptions?waitSeconds=1&parentId=$parentId&level=$level&maxLevel=4&waiSeconds=1',
          desc: '无限级别, 只要 api 返回数据就能继续往下选择. 当没有下级时请返回 null.',
          value: 'a,b'
        },
        {
          type: 'divider'
        },
        {
          name: 'tree',
          showOutline: true,
          type: 'input-tree',
          label: '动态树',
          source: '/api/mock2/options/tree?waitSeconds=1'
        },
        {
          type: 'divider'
        },
        {
          name: 'tree',
          type: 'input-tree',
          label: '树懒加载',
          multiple: true,
          deferApi: '/api/mock2/form/deferOptions?label=${label}&waitSeconds=2',
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
              defer: true
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
        },
        {
          type: 'divider'
        },
        {
          name: 'matrix',
          type: 'matrix-checkboxes',
          label: '动态矩阵开关',
          source: '/api/mock2/options/matrix?waitSeconds=1'
        }
      ]
    }
  ]
};
