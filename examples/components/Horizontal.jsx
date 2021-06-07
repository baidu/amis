export default {
  title: 'HBox & Grid',
  type: 'page',
  body: [
    {
      type: 'plain',
      tpl: 'Grid 请参考 bootstrap 的 grid 布局',
      inline: false,
      className: 'h3  m-b-xs'
    },
    {
      type: 'grid',
      columns: [
        {
          type: 'tpl',
          tpl: 'sm-2',
          sm: 2,
          className: 'bg-info',
          inline: false
        },
        {
          type: 'tpl',
          tpl: 'sm-4',
          sm: 4,
          className: 'bg-success',
          inline: false
        },
        {
          type: 'tpl',
          tpl: 'sm-6',
          sm: 6,
          className: 'bg-primary',
          inline: false
        }
      ]
    },
    {
      type: 'plain',
      tpl: 'Hbox',
      inline: false,
      className: 'h3 m-t m-b-xs'
    },
    {
      type: 'hbox',
      columns: [
        {
          type: 'tpl',
          tpl: '平均分配',
          className: 'bg-info',
          inline: false
        },
        {
          type: 'tpl',
          tpl: '平均分配',
          className: 'bg-success',
          inline: false
        },
        {
          type: 'tpl',
          tpl: '平均分配',
          className: 'bg-primary',
          inline: false
        }
      ]
    },
    {
      type: 'plain',
      tpl: 'Hbox 部分定宽',
      inline: false,
      className: 'h3 m-t m-b-xs'
    },
    {
      type: 'hbox',
      columns: [
        {
          type: 'tpl',
          tpl: 'w-xs',
          className: 'bg-info',
          inline: false,
          columnClassName: 'w-xs'
        },
        {
          type: 'tpl',
          tpl: 'w-sm',
          className: 'bg-info lter',
          inline: false,
          columnClassName: 'w-sm'
        },
        {
          type: 'tpl',
          tpl: 'w',
          className: 'bg-info dk',
          inline: false,
          columnClassName: 'w'
        },
        {
          type: 'tpl',
          tpl: '平均分配',
          className: 'bg-success',
          inline: false
        },
        {
          type: 'tpl',
          tpl: '平均分配',
          className: 'bg-primary',
          inline: false
        }
      ]
    },
    {
      type: 'plain',
      tpl: '示例',
      inline: false,
      className: 'h3 m-t m-b-xs'
    },
    {
      type: 'grid',
      columns: [
        {
          type: 'panel',
          title: '面板1',
          className: 'Panel--danger',
          body: '内容',
          sm: 4
        },
        {
          type: 'panel',
          title: '面板2',
          className: 'Panel--primary',
          body: '内容',
          sm: 8
        }
      ]
    }
  ]
};
