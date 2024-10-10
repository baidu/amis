export default {
  type: 'page',
  title: '轮播图',
  data: {
    carousel0: [
      __uri('../static/photo/bd3eb13533fa828b13b24500f31f4134960a5a44.jpg'),
      __uri('../static/photo/da6376bf988c.jpg'),
      __uri('../static/photo/3893101144.jpg')
    ],
    carousel1: [
      {
        html:
          '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data in form</div>'
      },
      {
        image: __uri(
          '../static/photo/bd3eb13533fa828b13b24500f31f4134960a5a44.jpg'
        )
      },
      {
        image: __uri('../static/photo/3893101144.jpg')
      }
    ]
  },
  body: [
    {
      type: 'grid',
      columns: [
        {
          type: 'panel',
          title: '直接页面配置',
          body: {
            type: 'carousel',
            controlsTheme: 'light',
            height: '300',
            options: [
              {
                image: __uri('../static/photo/da6376bf988c.jpg')
              },
              {
                html:
                  '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
              },
              {
                image: __uri('../static/photo/3893101144.jpg')
              }
            ]
          }
        },
        {
          type: 'panel',
          title: '使用itemSchema配置',
          body: {
            type: 'carousel',
            name: 'carousel0',
            controlsTheme: 'dark',
            height: '300',
            itemSchema: {
              type: 'tpl',
              tpl:
                '<div style="height: 100%; background-image: url(<%=data.item%>); background-position: center center; background-size: cover;"></div>'
            }
          }
        }
      ]
    },
    {
      type: 'grid',
      columns: [
        {
          type: 'form',
          title: '表单内展示',
          sm: 6,
          body: [
            {
              type: 'carousel',
              controlsTheme: 'dark',
              name: 'carousel1',
              label: 'carousel',
              animation: 'slide',
              height: '300'
            }
          ]
        }
      ]
    }
  ]
};
