export default {
  type: 'page',
  body: {
    type: 'form',
    api: '/api/mock/saveForm?waitSeconds=1',
    mode: 'horizontal',
    onSubmit: values => {
      debugger;
    },
    body: [
      {
        name: 'array',
        label: '颜色集合',
        type: 'input-array',
        inline: true,
        items: {
          type: 'input-text',
          clearable: false
        }
      }
    ]
  }
};
