export default {
  type: 'page',
  title: '动态选项卡',
  subTitle: '根据变量动态生成',
  data: {
    arr: [
      {
        label: '收入',
        value: 123
      },

      {
        label: '支出',
        value: 233
      }
    ]
  },
  body: [
    {
      type: 'tabs',
      source: '${arr}',
      mode: 'card',
      tabs: [
        {
          title: '${label}-A',
          body: '选项卡内容 ${value}'
        },

        {
          title: '${label}-B',
          body: '选项卡内容 ${value}'
        }
      ]
    }
  ]
};
