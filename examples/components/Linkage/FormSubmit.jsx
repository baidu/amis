export default {
  type: 'page',
  title: '表单提交后显示结果',
  body: {
    type: 'form',
    api: '/api/mock2/form/saveForm',
    title: '查询用户 ID',
    body: [
      {
        type: 'input-group',
        name: 'input-group',
        body: [
          {
            type: 'input-text',
            name: 'name',
            label: '姓名'
          },
          {
            type: 'submit',
            label: '查询',
            level: 'primary'
          }
        ]
      },
      {
        type: 'static',
        name: 'id',
        visibleOn: "typeof data.id !== 'undefined'",
        label: '返回 ID'
      }
    ],
    actions: []
  }
};
