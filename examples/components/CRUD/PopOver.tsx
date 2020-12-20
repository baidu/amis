export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
  title: '列展示详情',
  body: {
    type: 'crud',
    title: '',
    api: '/api/sample/list',
    columnsTogglable: false,
    columns: [
      {
        name: 'id',
        label: 'ID',
        width: 20,
        type: 'text'
      },
      {
        name: 'engine',
        label: 'Rendering engine',
        type: 'text',
        popOver: {
          trigger: 'hover',
          showIcon: false,
          body: 'Popover 内容：${platform}',
          position: 'right-bottom'
        }
      },
      {
        name: 'browser',
        label: 'Browser',
        type: 'text'
      }
    ]
  }
};
