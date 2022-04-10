export default {
  title: '点击左侧 crud 会触发右侧 crud 刷新',
  subTitle: '需要配置 syncLocation: false 避免左侧也刷新',
  body: {
    type: 'grid',
    columns: [
      {
        body: [
          {
            type: 'crud',
            api: '/api/sample',
            headerToolbar: [],
            perPage: 10,
            syncLocation: false,
            itemAction: {
              actionType: 'reload',
              target: 'detailCRUD?id=${id}'
            },
            columns: [
              {
                name: 'id',
                label: 'ID',
                width: 20,
                type: 'text'
              },
              {
                name: 'platform',
                label: 'Platform(s)',
                type: 'text'
              }
            ]
          }
        ]
      },
      {
        body: [
          {
            type: 'crud',
            name: 'detailCRUD',
            headerToolbar: [],
            syncLocation: false,
            api: '/api/sample?perPage=10&id=${id}&waitSeconds=1',
            columns: [
              {
                name: 'engine',
                label: 'Rendering engine',
                type: 'text'
              },
              {
                name: 'version',
                label: 'Engine version',
                type: 'text'
              }
            ]
          }
        ]
      }
    ]
  }
};
