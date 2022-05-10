export default {
  type: 'page',
  body: {
    type: 'form',
    api: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com/api/amis-mock/saveForm',
    title: '登录',
    body: [
      {
        type: 'alert',
        body: '阻止表单提交后的默认提示。',
        level: 'info',
        className: 'mb-1'
      },
      {
        type: 'input-text',
        name: 'name',
        label: '姓名'
      },
      {
        type: 'input-email',
        name: 'email',
        label: '邮箱'
      }
    ],
    onEvent: {
      submitFail: {
        actions: [
          {
            actionType: 'drawer',
            drawer: {
              title: '请求失败',
              body: {
                type: 'alert',
                level: 'warning',
                icon: 'fa fa-cloud',
                body: '请求失败，若给您造成不便，敬请谅解。'
              }
            },
            preventDefault: true
          }
        ]
      }
    }
  }
};
