export default {
  type: 'page',
  title: '表单与表单之间的联动',
  aside: {
    type: 'form',
    target: 'detailForm',
    className: 'wrapper-sm', // 来点间隔
    wrapWithPanel: false, // 不要用 panel 包裹了。
    body: [
      {
        type: 'input-text',
        placeholder: '关键字',
        name: 'keywords',
        addOn: {
          type: 'submit',
          label: '搜索',
          primary: true
        }
      },

      '<span class="text-danger">请在此输入内容后点击搜索</sapn>'
    ]
  },
  body: {
    name: 'detailForm',
    type: 'form',
    mode: 'horizontal',
    title: '',
    initApi: '/api/mock2/form/initData?keywords=${keywords}',
    actions: [],
    body: [
      'Form 模型除了用来提交数据外，还比较适合用来做详情数据的展示',
      {
        type: 'divider'
      },

      {
        label: '名称',
        type: 'static',
        labelClassName: 'text-muted',
        name: 'name'
      },

      {
        label: '作者',
        type: 'static',
        labelClassName: 'text-muted',
        name: 'author'
      },

      {
        label: '输入信息',
        type: 'static',
        labelClassName: 'text-muted',
        name: 'info'
      },

      {
        label: '请求时间',
        type: 'static-datetime',
        labelClassName: 'text-muted',
        format: 'YYYY-MM-DD HH:mm:ss',
        name: 'date'
      }
    ]
  }
};
