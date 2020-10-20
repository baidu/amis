export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
  title: '所有 Form 元素列举',
  data: {
    id: 1,
    image:
      'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3893101144,2877209892&fm=23&gp=0.jpg',
    images: [
      {
        image:
          'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg@s_0,w_216,l_1,f_jpg,q_80',
        src:
          'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692722/4f3cb4202335.jpeg'
      },
      {
        image:
          'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg@s_0,w_216,l_1,f_jpg,q_80',
        src:
          'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395692942/d8e4992057f9.jpeg'
      },
      {
        image:
          'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg@s_0,w_216,l_1,f_jpg,q_80',
        src:
          'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693148/1314a2a3d3f6.jpeg'
      },
      {
        image:
          'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg@s_0,w_216,l_1,f_jpg,q_80',
        src:
          'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693379/8f2e79f82be0.jpeg'
      },
      {
        image:
          'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg@s_0,w_216,l_1,f_jpg,q_80',
        src:
          'https://internal-amis-res.cdn.bcebos.com/images/2020-1/1578395693566/552b175ef11d.jpeg'
      }
    ]
  },
  body: [
    {
      type: 'form',
      api: '/api/mock2/saveForm?waitSeconds=2',
      title: '表单项静态展示',
      mode: 'horizontal',
      controls: [
        {
          type: 'static',
          label: '文本',
          value: '文本'
        },

        {
          type: 'divider'
        },

        {
          type: 'static-tpl',
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
          type: 'static-month',
          label: '月份',
          value: Math.round(Date.now() / 1000)
        },

        {
          type: 'divider'
        },

        {
          type: 'static-mapping',
          label: '映射',
          value: Math.floor(Math.random() * 5),
          map: {
            '*': "<span class='label label-default'>-</span>",
            '0': "<span class='label label-info'>一</span>",
            '1': "<span class='label label-success'>二</span>",
            '2': "<span class='label label-danger'>三</span>",
            '3': "<span class='label label-warning'>四</span>",
            '4': "<span class='label label-primary'>五</span>"
          }
        },

        {
          type: 'divider'
        },

        {
          type: 'static-progress',
          label: '进度',
          value: 66.66
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
            body:
              '<div class="w-xxl"><img class="w-full" src="${image}"/></div>'
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
