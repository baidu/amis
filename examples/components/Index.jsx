export default {
  type: 'page',
  data: {
    items: [
      {
        engine: 'Trident',
        browser: 'Internet Explorer 4.0',
        platform: 'Win 95+',
        version: '4',
        grade: 'X'
      },
      {
        engine: 'Trident',
        browser: 'Internet Explorer 5.0',
        platform: 'Win 95+',
        version: '5',
        grade: 'C'
      },
      {
        engine: 'Trident',
        browser: 'Internet Explorer 5.5',
        platform: 'Win 95+',
        version: '5.5',
        grade: 'A'
      },
      {
        engine: 'Trident',
        browser: 'Internet Explorer 6',
        platform: 'Win 98+',
        version: '6',
        grade: 'A'
      },
      {
        engine: 'Trident',
        browser: 'Internet Explorer 7',
        platform: 'Win XP SP2+',
        version: '7',
        grade: 'A'
      }
    ]
  },
  body: {
    type: 'cards',
    source: '$items',
    card: {
      body: [
        {
          label: 'Engine',
          popOver: "dfasdfa'",
          name: 'engine'
        },
        {
          label: 'Browser',
          name: 'browser'
        },
        {
          name: 'version',
          label: 'Version'
        }
      ],
      actions: [
        {
          type: 'button',
          level: 'link',
          icon: 'fa fa-eye',
          actionType: 'dialog',
          dialog: {
            title: '查看详情',
            body: {
              type: 'form',
              body: [
                {
                  label: 'Engine',
                  name: 'engine',
                  type: 'static'
                },
                {
                  name: 'browser',
                  label: 'Browser',
                  type: 'static'
                },
                {
                  name: 'version',
                  label: 'Version',
                  type: 'static'
                }
              ]
            }
          }
        }
      ]
    }
  }
};
