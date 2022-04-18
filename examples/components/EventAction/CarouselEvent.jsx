export default {
  type: 'page',
  title: '标签页组件事件',
  regions: ['body', 'toolbar', 'header'],
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
              activeIndex: 2
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
          image:
            'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg'
        }
      ],
      onEvent: {
        change: {
          actions: [
            {
              actionType: 'toast',
              msg: '${activeIndex}'
            }
          ]
        }
      }
    }
  ]
};
