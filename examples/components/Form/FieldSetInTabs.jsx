export default {
  title: 'FieldSet In Tabs',
  remark: '',
  body: {
    type: 'form',

    body: [
      {
        type: 'tabs',
        collapsable: true,
        tabs: [
          {
            title: 'Tab A',
            body: [
              {
                type: 'fieldset',
                body: [
                  {
                    type: 'tabs',
                    title: 'Group A',
                    tabs: [
                      {
                        title: 'SubTab A',
                        body: [
                          {
                            name: 'a',
                            type: 'input-text',
                            label: 'Text'
                          },
                          {
                            name: 'a',
                            type: 'input-text',
                            label: 'Text'
                          }
                        ]
                      },
                      {
                        title: 'SubTab B',
                        body: [
                          {
                            name: 'a',
                            type: 'input-text',
                            label: 'Text'
                          },
                          {
                            name: 'a',
                            type: 'input-text',
                            label: 'Text'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    type: 'tabs',
                    title: 'Group B',
                    body: [
                      {
                        name: 'a',
                        type: 'input-text',
                        label: 'Text'
                      },
                      {
                        name: 'a',
                        type: 'input-text',
                        label: 'Text'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            title: 'Tab B',
            body: [
              {
                type: 'fieldset',
                title: 'Group A',
                body: [
                  {
                    name: 'a',
                    type: 'input-text',
                    label: 'Text'
                  },
                  {
                    name: 'a',
                    type: 'input-text',
                    label: 'Text'
                  }
                ]
              },
              {
                type: 'fieldset',
                title: 'Group B',
                body: [
                  {
                    name: 'a',
                    type: 'input-text',
                    label: 'Text'
                  },
                  {
                    name: 'a',
                    type: 'input-text',
                    label: 'Text'
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
