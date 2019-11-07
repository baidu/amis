export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
  title: 'FieldSet In Tabs',
  remark: '',
  body: {
    type: 'form',
    collapsable: true,
    tabs: [
      {
        title: 'Tab A',
        fieldSet: [
          {
            title: 'Group A',
            tabs: [
              {
                title: 'SubTab A',
                controls: [
                  {
                    name: 'a',
                    type: 'text',
                    label: 'Text'
                  },
                  {
                    name: 'a',
                    type: 'text',
                    label: 'Text'
                  }
                ]
              },
              {
                title: 'SubTab B',
                controls: [
                  {
                    name: 'a',
                    type: 'text',
                    label: 'Text'
                  },
                  {
                    name: 'a',
                    type: 'text',
                    label: 'Text'
                  }
                ]
              }
            ]
          },
          {
            title: 'Group B',
            controls: [
              {
                name: 'a',
                type: 'text',
                label: 'Text'
              },
              {
                name: 'a',
                type: 'text',
                label: 'Text'
              }
            ]
          }
        ]
      },
      {
        title: 'Tab B',
        fieldSet: [
          {
            title: 'Group A',
            controls: [
              {
                name: 'a',
                type: 'text',
                label: 'Text'
              },
              {
                name: 'a',
                type: 'text',
                label: 'Text'
              }
            ]
          },
          {
            title: 'Group B',
            controls: [
              {
                name: 'a',
                type: 'text',
                label: 'Text'
              },
              {
                name: 'a',
                type: 'text',
                label: 'Text'
              }
            ]
          }
        ]
      }
    ]
  }
};
