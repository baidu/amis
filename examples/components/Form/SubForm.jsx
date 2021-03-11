export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
  title: 'SubForm 示例',
  body: [
    {
      type: 'form',
      api: '/api/mock2/saveForm?waitSeconds=2',
      title: 'Form elements',
      mode: 'horizontal',
      // debug: true,
      controls: [
        {
          type: 'form',
          label: '子表单单条',
          name: 'subForm1',
          btnLabel: '点击设置',
          form: {
            title: '子表单',
            controls: [
              {
                name: 'a',
                type: 'text',
                label: 'Foo'
              },
              {
                name: 'b',
                type: 'switch',
                label: 'Boo'
              }
            ]
          }
        },

        {
          type: 'form',
          label: '子表单多条',
          name: 'subForm2',
          labelField: 'a',
          btnLabel: '点击设置',
          multiple: true,
          form: {
            title: '子表单',
            controls: [
              {
                name: 'a',
                type: 'text',
                label: 'Foo'
              },
              {
                name: 'b',
                type: 'switch',
                label: 'Boo'
              }
            ]
          }
        }
      ]
    }
  ]
};
