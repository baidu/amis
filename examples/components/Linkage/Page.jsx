export default {
  type: 'page',
  title: '地址栏变化自动更新',
  initApi: '/api/mock2/form/initData?id=${id}',
  aside: {
    type: 'wrapper',
    size: 'xs',
    className: '',
    body: {
      type: 'nav',
      stacked: true,
      links: [
        {
          label: '页面1',
          to: '?id=1'
        },

        {
          label: '页面2',
          children: [
            {
              label: '页面2-1',
              to: '?id=2-1'
            },
            {
              label: '页面2-2',
              to: '?id=2-2'
            },
            {
              label: '页面2-3（disabled）',
              disabled: true,
              to: '?id=2-3'
            }
          ]
        },

        {
          label: '页面3',
          to: '?id=3'
        }
      ]
    }
  },
  body: [
    '<p><span class="text-danger">注意 page 渲染器的 `initApi` 中有变量跟地址栏中变量关联，只要值发生了变化，就会重新拉取一次 initApi。</sapn></p>',
    '<p>这些数据是通过 initApi 拉取到的数据。 `\\$infoId`: <span class="text-danger">${infoId|default:空}</span></p>'
  ]
};
