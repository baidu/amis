export default {
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
          popOverClassName: 'min-w-0',
          position: 'left-center-right-center right-center-left-center'
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
