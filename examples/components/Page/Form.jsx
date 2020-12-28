export default {
  type: 'page',
  title: '表单页面',
  data: {
    name: 'rick'
  },
  body: {
    type: 'form',
    mode: 'horizontal',
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
      }
    ]
  }
};
