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
        }
      ]
    }
  ]
};