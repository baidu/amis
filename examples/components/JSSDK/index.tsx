export default {
  type: 'app',
  brandName: 'JSSDK Test',
  header: {
    type: 'tpl',
    inline: false,
    className: 'w-full',
    tpl:
      '<div class="flex justify-between"><div>顶部区域左侧</div><div>顶部区域右侧</div></div>'
  },
  // footer: '<div class="p-2 text-center bg-light">底部区域</div>',
  // asideBefore: '<div class="p-2 text-center">菜单前面区域</div>',
  // asideAfter: '<div class="p-2 text-center">菜单后面区域</div>',
  pages: [
    {
      label: 'Home',
      url: '/',
      rewrite: '/pageA'
    },
    {
      label: '示例',
      children: [
        {
          label: '页面A',
          url: 'pageA',
          schema: {
            type: 'page',
            title: '页面A',
            body: '页面A'
          },

          children: [
            {
              label: '页面A-1',
              url: '1',
              schema: {
                type: 'page',
                title: '页面A-1',
                body: '页面A-1'
              }
            },

            {
              label: '页面A-2',
              url: '2',
              schema: {
                type: 'page',
                title: '页面A-2',
                body: '页面A-2'
              }
            },

            {
              label: '页面A-3',
              url: '3',
              schema: {
                type: 'page',
                title: '页面A-3',
                body: '页面A-3'
              }
            }
          ]
        },

        {
          label: '页面B',
          schema: {
            type: 'page',
            title: '页面B',
            body: '页面B'
          }
        },

        {
          label: '页面C',
          schema: {
            type: 'page',
            title: '页面C',
            body: '页面C'
          }
        }
      ]
    },

    {
      label: '管理中心',
      children: [
        {
          label: '用户管理',
          schema: {
            type: 'page',
            title: '用户管理',
            body: '页面C'
          }
        },

        {
          label: '角色管理',
          schemaApi: '/api/mock2/service/form?tpl=tpl2'
        },

        {
          label: '部门管理',
          schemaApi: '/api/mock2/service/form?tpl=tpl3'
        }
      ]
    }
  ]
};
