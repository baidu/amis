export default {
  title: '所有 Form 元素列举',
  data: {
    id: 1,
    image: __uri('../../static/photo/3893101144.jpg'),
    images: [
      {
        image: __uri('../../static/photo/4f3cb4202335.jpg'),
        src: __uri('../../static/photo/4f3cb4202335.jpg')
      },
      {
        image: __uri('../../static/photo/d8e4992057f9.jpg'),
        src: __uri('../../static/photo/d8e4992057f9.jpg')
      },
      {
        image: __uri('../../static/photo/1314a2a3d3f6.jpg'),
        src: __uri('../../static/photo/1314a2a3d3f6.jpg')
      },
      {
        image: __uri('../../static/photo/8f2e79f82be0.jpg'),
        src: __uri('../../static/photo/8f2e79f82be0.jpg')
      },
      {
        image: __uri('../../static/photo/552b175ef11d.jpg'),
        src: __uri('../../static/photo/552b175ef11d.jpg')
      }
    ]
  },
  body: [
    {
      type: 'form',
      api: '/api/mock2/saveForm?waitSeconds=2',
      title: '表单项静态展示',
      mode: 'horizontal',
      body: [
        {
          type: 'static',
          label: '文本',
          value: '文本'
        },

        {
          type: 'divider'
        },

        {
          type: 'static',
          label: '模板',
          tpl: '自己拼接 HTML 取变量 \\${id}: ${id}'
        },

        {
          type: 'divider'
        },

        {
          type: 'static-date',
          label: '日期',
          value: Math.round(Date.now() / 1000)
        },

        {
          type: 'divider'
        },

        {
          type: 'static-datetime',
          label: '日期时间',
          value: Math.round(Date.now() / 1000)
        },

        {
          type: 'divider'
        },

        {
          type: 'control',
          label: '映射',
          body: {
            type: 'mapping',
            value: Math.floor(Math.random() * 5),
            map: {
              '*': "<span class='label label-default'>-</span>",
              '0': "<span class='label label-info'>一</span>",
              '1': "<span class='label label-success'>二</span>",
              '2': "<span class='label label-danger'>三</span>",
              '3': "<span class='label label-warning'>四</span>",
              '4': "<span class='label label-primary'>五</span>"
            }
          }
        },

        {
          type: 'divider'
        },

        {
          type: 'control',
          label: '进度',
          body: {
            type: 'progress',
            value: 66.66
          }
        },

        {
          type: 'divider'
        },

        {
          type: 'static-image',
          label: '图片',
          name: 'image',
          thumbMode: 'cover',
          thumbRatio: '4:3',
          title: '233',
          imageCaption: 'jfe fjkda fejfkda fejk fdajf dajfe jfkda',
          popOver: {
            title: '查看大图',
            body: '<div class="w-xxl"><img class="w-full" src="${image}"/></div>'
          }
        },

        {
          type: 'divider'
        },

        {
          type: 'static-image',
          label: '图片自带放大',
          name: 'image',
          thumbMode: 'cover',
          thumbRatio: '4:3',
          title: '233',
          imageCaption: 'jfe fjkda fejfkda fejk fdajf dajfe jfkda',
          enlargeAble: true,
          originalSrc: '${image}'
        },

        {
          type: 'static-images',
          label: '图片集',
          name: 'images',
          thumbMode: 'cover',
          thumbRatio: '4:3',
          enlargeAble: true,
          originalSrc: '${src}' // 注意这个取变量是想对数组成员取的。
        },

        {
          type: 'divider'
        },

        {
          type: 'static-json',
          label: 'JSON',
          value: {a: 1, b: 2, c: {d: 3}}
        },

        {
          type: 'divider'
        },

        {
          type: 'static',
          label: '可复制',
          value: '文本',
          copyable: {
            content: '内容，支持变量 ${id}'
          }
        },

        {
          type: 'divider'
        },

        {
          type: 'static',
          name: 'text',
          label: '可快速编辑',
          value: '文本',
          quickEdit: true
        }
      ]
    }
  ]
};
