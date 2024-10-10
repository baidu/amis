export default {
  type: 'page',
  title: '轮播图组件事件',
  regions: ['body', 'toolbar', 'header'],
  data: {
    index: 3
  },
  body: [
    {
      type: 'action',
      label: '上一张',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'prev',
              componentId: 'carousel_001'
            }
          ]
        }
      }
    },
    {
      type: 'action',
      label: '下一张',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'next',
              componentId: 'carousel_001'
            }
          ]
        }
      }
    },
    {
      type: 'action',
      label: '滚动到第三张',
      level: 'primary',
      className: 'mr-3 mb-3',
      onEvent: {
        click: {
          actions: [
            {
              actionType: 'goto-image',
              componentId: 'carousel_001',
              args: {
                activeIndex: '${index}'
              }
            }
          ]
        }
      }
    },
    {
      type: 'carousel',
      id: 'carousel_001',
      auto: false,
      thumbMode: 'cover',
      animation: 'slide',
      height: 300,
      options: [
        {
          image:
            'https://internal-amis-res.cdn.bcebos.com/images/2019-12/1577157239810/da6376bf988c.png'
        },
        {
          html: '<div style="width: 100%; height: 300px; background: #e3e3e3; text-align: center; line-height: 300px;">carousel data</div>'
        },
        {
          thumbMode: 'contain',
          image: 'https://suda.cdn.bcebos.com/amis/images/alice-macaw.jpg'
        }
      ],
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'toast',
              args: {
                msg: '滚动至${activeIndex}'
              }
            }
          ]
        }
      }
    }
  ]
};
