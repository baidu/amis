export default {
  type: 'page',
  body: {
    type: 'crud',
    api: '/examples/index',
    syncLocation: false,
    columns: [
      {
        name: 'id',
        label: 'ID'
      },
      {
        name: 'engine',
        label: 'Rendering engine'
      },
      {
        name: 'browser',
        label: 'Browser'
      },
      {
        name: 'platform',
        label: 'Platform(s)'
      },
      {
        name: 'version',
        label: 'Engine version'
      },
      {
        name: 'grade',
        label: 'CSS grade'
      }
    ]
  }
};
