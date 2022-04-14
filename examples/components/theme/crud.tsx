/**
 * 给自定义组件预览用的 CRUD
 */

export default {
  type: 'crud',
  syncLocation: false,
  data: {
    items: [
      {
        engine: 'Trident',
        browser: 'Internet Explorer 4.0',
        platform: 'Win 95+',
        version: '4',
        id: 1
      },
      {
        engine: 'Trident',
        browser: 'Internet Explorer 5.0',
        platform: 'Win 95+',
        id: 2
      },
      {
        engine: 'Trident',
        browser: 'Internet Explorer 5.5',
        platform: 'Win 95+',
        id: 3
      },
      {
        engine: 'Trident',
        browser: 'Internet Explorer 6',
        platform: 'Win 98+',
        id: 4
      },
      {
        engine: 'Trident',
        browser: 'Internet Explorer 7',
        platform: 'Win XP SP2+',
        id: 5
      },
      {
        engine: 'Trident',
        browser: 'AOL browser (AOL desktop)',
        platform: 'Win XP',
        id: 6
      }
    ]
  },
  source: '${items}',
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
    }
  ]
};
