export default {
  type: 'service',
  api: '/api/mock2/sample',
  id: 'service-reload',
  body: [
    {
      type: 'each',
      name: 'rows',
      items: {
        type: 'tag',
        label: '${id}',
        closable: true,
        onEvent: {
          close: {
            actions: [
              {
                actionType: 'ajax',
                args: {
                  api: {
                    url: '/api/mock2/sample/${event.data.label}',
                    method: 'DELETE'
                  },
                  messages: {
                    success: '${label} 删除成功',
                    failed: '删除失败'
                  }
                }
              },
              {
                actionType: 'reload',
                componentId: 'service-reload'
              }
            ]
          }
        }
      }
    }
  ]
};
