export default {
  type: 'app',
  brandName: 'JSSDK Test',
  pages: [
    {
      label: '示例',
      isDefaultPage: true,
      schema: {
        type: 'page',
        title: '首页',
        body: '首页'
      },
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
          label: '用户管理'
        },

        {
          label: '角色管理'
        },

        {
          label: '部门管理'
        }
      ]
    }
  ]
};
