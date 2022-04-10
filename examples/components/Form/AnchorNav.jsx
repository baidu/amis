export default {
  title: '表单内锚点导航示例',
  body: [
    {
      type: 'form',
      mode: 'horizontal',
      api: '/api/mock2/form/saveForm?waitSeconds=2',
      title: '',
      body: [
        {
          type: 'anchor-nav',
          links: [
            {
              title: '员工基本信息',
              body: [
                {
                  type: 'fieldSet',
                  title: '员工基本信息',
                  body: [
                    {
                      name: 'name',
                      type: 'input-text',
                      label: '用户名'
                    },

                    {
                      name: 'age',
                      type: 'input-text',
                      label: '年龄'
                    }
                  ]
                }
              ]
            },

            {
              title: '在职信息',
              body: [
                {
                  type: 'fieldSet',
                  title: '地址信息',
                  body: [
                    {
                      name: 'home',
                      type: 'input-text',
                      label: '居住地址'
                    },

                    {
                      name: 'address',
                      type: 'input-text',
                      label: '工作地址'
                    }
                  ]
                }
              ]
            },

            {
              title: '教育经历',
              body: [
                {
                  type: 'fieldSet',
                  title: '教育经历',
                  body: [
                    {
                      name: 'school1',
                      type: 'input-text',
                      label: '经历1'
                    },
                    {
                      name: 'school2',
                      type: 'input-text',
                      label: '经历2'
                    },
                    {
                      name: 'school2',
                      type: 'input-text',
                      label: '经历2'
                    }
                  ]
                }
              ]
            },

            {
              title: '紧急联系人信息',
              body: [
                {
                  type: 'fieldSet',
                  title: '紧急联系人信息',
                  body: [
                    {
                      name: 'contact1',
                      type: 'input-text',
                      label: '联系人1'
                    },
                    {
                      name: 'contact2',
                      type: 'input-text',
                      label: '联系人2'
                    },
                    {
                      name: 'contact3',
                      type: 'input-text',
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
