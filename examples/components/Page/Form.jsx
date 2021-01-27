export default {
  type: 'page',
  title: '表单页面',
  body: {
    type: 'form',
    mode: 'horizontal',
    api: '/api/mock2/form/saveForm',
    debug: true,
    controls: [
      {
        label: 'Name',
        type: 'text',
        name: 'name',
        value: 'true'
      },

      {
        label: 'Email',
        type: 'email',
        name: 'email',
        value: 'aaa',
        hidden: true,
        clearValueOnHidden: true
      }
    ]
  }
};
