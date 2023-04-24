export default {
  type: 'page',
  body: {
    type: 'form',
    body: [
      {
        label: '多选',
        type: 'select',
        name: 'select2',
        searchable: true,
        checkAll: true,
        multiple: true,
        clearable: true,
        source: '/api/mock2/form/getOptions'
      }
    ]
  }
};
