export default {
  title: 'SubForm 示例',
  body: [
    {
      type: 'form',
      api: '/api/mock2/saveForm?waitSeconds=2',
      title: 'Form elements',
      mode: 'horizontal',
      // debug: true,
      body: [
        {
          type: 'input-sub-form',
          label: '子表单单条',
          name: 'subForm1',
          btnLabel: '点击设置${a}',
          form: {
            title: '子表单',
            body: [
              {
                name: 'a',
                type: 'input-text',
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
          type: 'input-sub-form',
          label: '子表单多条',
          name: 'subForm2',
          labelField: 'a',
          btnLabel: '点击设置',
          multiple: true,
          form: {
            title: '子表单',
            body: [
              {
                name: 'a',
                type: 'input-text',
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
