export default {
  type: 'page',
  title: '标题',
  remark: {
    title: '标题',
    body: '这是一段描述问题，注意到了没，还可以设置标题。而且只有点击了才弹出来。',
    icon: 'question-mark',
    placement: 'right',
    trigger: 'click',
    rootClose: true
  },
  body: '内容部分. 可以使用 \\${var} 获取变量。如: `\\$date`: ${date}',
  aside: '边栏部分',
  toolbar: '工具栏',
  initApi: '/api/mock2/page/initData'
};
