export default {
  type: 'page',
  title: '表单中选项卡分组',
  subTitle: '',
  body: [
    '<p>多个 controls 可以通过  tabs 来分组展示，表单将作为一个整体提交。</p>',
    {
      type: 'form',
      title: '',
      tabs: [
        {
          title: '选项卡1',
          hash: 'tab1',
          body: [
            {
              type: 'input-text',
              label: '文本1',
              name: 'a'
            }
          ]
        },
        {
          title: '选项卡2',
          hash: 'tab2',
          body: [
            {
              type: 'input-text',
              label: '文本2',
              name: 'b'
            }
          ]
        },

        {
          title: '选项卡3',
          hash: 'tab3',
          body: [
            {
              type: 'input-text',
              label: '文本3',
              name: 'c'
            }
          ]
        }
      ]
    }
  ]
};
