export default {
  type: 'page',
  title: '动态加载数据',
  body: [
    '<span class="text-danger">除了用 Page、CRUD、Form 或者 Wizard 能拉取数据外，还可以通过 Service 专门拉取数据，然后丢给其他类型的渲染器渲染。</span>',

    {
      type: 'form',
      title: '条件输入',
      className: 'm-t',
      wrapWithPanel: false,
      target: 'service1',
      mode: 'inline',
      body: [
        {
          type: 'input-text',
          name: 'keywords',
          placeholder: '关键字',
          addOn: {
            type: 'button',
            icon: 'fa fa-search',
            actionType: 'submit',
            level: 'primary'
          }
        }
      ]
    },

    {
      name: 'service1',
      type: 'service',
      className: 'm-t',
      api: '/api/mock2/service/data?keywords=${keywords}',
      body: [
        '当前关键字是 ${keywords}，当前时间是： ${date|date:YYYY-MM-DD HH\\:mm}',

        {
          type: 'table',
          className: 'm-t',
          source: '${table1}',
          columns: [
            {
              name: 'id',
              label: 'ID',
              type: 'text'
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
              popOver: {
                title: '查看大图',
                body:
                  '<div class="w-xxl"><img class="w-full" src="${image}"/></div>'
              }
            },
            {
              name: 'date',
              type: 'date',
              label: '日期'
            }
          ]
        },

        {
          type: 'table',
          source: '${table2}',
          columns: [
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
              listItem: {
                title: '${title}',
                subTitle: '${description}'
              }
            }
          ]
        }
      ]
    }
  ]
};
