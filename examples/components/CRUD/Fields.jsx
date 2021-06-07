export default {
  title: '增删改查列类型汇总',
  body: {
    type: 'crud',
    api: '/api/mock2/crud/list',
    columns: [
      {
        name: 'id',
        label: 'ID',
        type: 'text'
      },
      {
        name: 'audio',
        label: '音频',
        type: 'audio'
      },
      {
        name: 'carousel',
        label: '轮播图',
        type: 'carousel',
        width: '300'
      },
      {
        name: 'text',
        label: '文本',
        type: 'text'
      },
      {
        type: 'image',
        label: '图片',
        name: 'image',
        enlargeAble: true,
        title: '233',
        thumbMode: 'cover'
        // popOver: {
        //   title: '查看大图',
        //   body: '<div class="w-xxl"><img class="w-full" src="${image}"/></div>'
        // }
      },
      {
        name: 'date',
        type: 'date',
        label: '日期'
      },
      {
        name: 'progress',
        label: '进度',
        type: 'progress'
      },
      {
        name: 'boolean',
        label: '状态',
        type: 'status'
      },
      {
        name: 'boolean',
        label: '开关',
        type: 'switch'
        // readOnly: false // 可以开启修改模式
      },
      {
        name: 'type',
        label: '映射',
        type: 'mapping',
        map: {
          '*': '其他：${type}',
          '1': "<span class='label label-info'>漂亮</span>",
          '2': "<span class='label label-success'>开心</span>",
          '3': "<span class='label label-danger'>惊吓</span>",
          '4': "<span class='label label-warning'>紧张</span>"
        }
      },

      {
        name: 'list',
        type: 'list',
        label: 'List',
        placeholder: '-',
        size: 'sm',
        listItem: {
          title: '${title}',
          subTitle: '${description}'
        }
      },

      {
        name: 'json',
        type: 'json',
        label: 'Json'
      }
    ]
  }
};
