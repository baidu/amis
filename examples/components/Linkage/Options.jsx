export default {
  type: 'page',
  title: '表单选线之间的远程联动',
  body: {
    type: 'form',
    mode: 'horizontal',
    title: '',
    actions: [],
    body: [
      '<p class="text-danger">表单选项可以设置 source 通过 API 远程拉取，同时如果 source 中有变量的话，变量值发生变化就会重新拉取，达到联动效果。</p>',
      {
        type: 'divider'
      },

      {
        label: '选项1',
        type: 'select',
        labelClassName: 'text-muted',
        name: 'a',
        inline: true,
        options: [
          {
            label: '选项1',
            value: 1
          },

          {
            label: '选项2',
            value: 2
          },

          {
            label: '选项3',
            value: 3
          }
        ]
      },

      {
        label: '选项2',
        type: 'select',
        labelClassName: 'text-muted',
        name: 'b',
        inline: true,
        source: '/api/mock2/options/level2?a=${a}',
        initFetchOn: 'data.a'
      },

      {
        label: '选项3',
        type: 'select',
        labelClassName: 'text-muted',
        name: 'c',
        inline: true,
        visibleOn: 'data.b',
        source: '/api/mock2/options/level3?b=${b}'
      }
    ]
  }
};
