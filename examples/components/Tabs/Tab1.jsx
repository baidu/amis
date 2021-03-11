export default {
  type: 'page',
  title: '选项卡1页面',
  body: [
    '<p>也可以多个页面，利用导航<code>nav</code>渲染期模拟 tabs 的效果。这样可以让 url 更加友好，而不是只能用 hash。</p>',

    {
      type: 'nav',
      links: [
        {
          label: '选项卡1',
          icon: 'fa fa-cloud',
          to: './tab1'
        },

        {
          label: '选项卡2',
          to: './tab2'
        },

        {
          label: '选项卡3',
          icon: 'fa fa-youtube',
          to: './tab3'
        }
      ]
    },

    {
      type: 'wrapper',
      className: 'wrapper bg-white b-l b-b b-r',
      body: '选项卡1的内容'
    }
  ]
};
