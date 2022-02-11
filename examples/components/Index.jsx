export default {
  type: 'page',
  body: {
    type: 'form',
    mode: 'horizontal',
    api: '/api/mock2/form/saveForm',
    debug: true,
    body: [
      {
        type: 'input-date',
        name: 'date',
        label: '日期'
      }
    ]
  }
};
