export default {
  $schema: 'https://houtai.baidu.com/v2/schemas/page.json#',
  title: '表单内锚点导航示例',
  body: [
    {
      type: 'form',
      mode: 'horizontal',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      title: '',
      controls: [
        {
          type: 'anchor-nav',
          links: [
            {
              title: '员工基本信息',
              controls: [
                {
                  type: 'fieldSet',
                  title: '员工基本信息',
                  controls: [
                    {
                      name: 'name',
                      type: 'text',
                      label: '用户名'
                    },

                    {
                      name: 'age',
                      type: 'text',
                      label: '年龄'
                    }
                  ]
                }
              ]
            },

            {
              title: '在职信息',
              controls: [
                {
                  type: 'fieldSet',
                  title: '地址信息',
                  controls: [
                    {
                      name: 'home',
                      type: 'text',
                      label: '居住地址'
                    },

                    {
                      name: 'address',
                      type: 'text',
                      label: '工作地址'
                    }
                  ]
                }
              ]
            },

            {
              title: '教育经历',
              controls: [
                {
                  type: 'fieldSet',
                  title: '教育经历',
                  controls: [
                    {
                      name: 'school1',
                      type: 'text',
                      label: '经历1'
                    },
                    {
                      name: 'school2',
                      type: 'text',
                      label: '经历2'
                    },
                    {
                      name: 'school2',
                      type: 'text',
                      label: '经历2'
                    }
                  ]
                }
              ]
            },

            {
              title: '紧急联系人信息',
              controls: [
                {
                  type: 'fieldSet',
                  title: '紧急联系人信息',
                  controls: [
                    {
                      name: 'contact1',
                      type: 'text',
                      label: '联系人1'
                    },
                    {
                      name: 'contact2',
                      type: 'text',
                      label: '联系人2'
                    },
                    {
                      name: 'contact3',
                      type: 'text',
                      label: '联系人3'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
