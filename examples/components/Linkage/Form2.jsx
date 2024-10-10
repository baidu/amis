export default {
  type: 'page',
  title: '表单初始数据自动重新拉取',
  body: [
    {
      type: 'form',
      mode: 'horizontal',
      title: '监听表单内部的修改',
      initApi: '/api/mock2/form/initData?tpl=${tpl}',
      actions: [],
      body: [
        '<span class="text-danger">当 <code>initApi</code> 中有变量，且变量的值发生了变化了，则该表单就会重新初始数据。</span>',
        {
          type: 'divider'
        },

        {
          label: '数据模板',
          type: 'select',
          labelClassName: 'text-muted',
          name: 'tpl',
          value: 'tpl1',
          inline: true,
          options: [
            {
              label: '模板1',
              value: 'tpl1'
            },

            {
              label: '模板2',
              value: 'tpl2'
            },

            {
              label: '模板3',
              value: 'tpl3'
            }
          ],
          description: '<span class="text-danger">请修改这里看效果</span>'
        },

        {
          label: '名称',
          type: 'static',
          labelClassName: 'text-muted',
          name: 'name'
        },

        {
          label: '作者',
          type: 'static',
          labelClassName: 'text-muted',
          name: 'author'
        },

        {
          label: '请求时间',
          type: 'static-datetime',
          labelClassName: 'text-muted',
          format: 'YYYY-MM-DD HH:mm:ss',
          name: 'date'
        }
      ]
    },

    {
      type: 'grid',
      columns: [
        {
          type: 'form',
          mode: 'horizontal',
          title: '自动填充',
          actions: [],
          body: [
            {
              label: '数据模板',
              type: 'select',
              labelClassName: 'text-muted',
              name: 'tpl',
              value: 'tpl1',
              inline: true,
              options: [
                {
                  label: '模板1',
                  value: 'tpl1'
                },

                {
                  label: '模板2',
                  value: 'tpl2'
                },

                {
                  label: '模板3',
                  value: 'tpl3'
                }
              ],
              description: '<span class="text-danger">请修改这里看效果</span>'
            },

            '<div class="text-danger m-b">如果 <code>initApi</code> 已经暂用，用 <code>service</code>一样可以拉取值填充，同样以下 api 值发生变化时会自动填充。</div>',

            {
              type: 'service',
              api: '/api/mock2/form/initData?tpl=${tpl}',
              body: [
                {
                  label: '名称',
                  type: 'input-text',
                  labelClassName: 'text-muted',
                  name: 'name'
                },

                {
                  label: '作者',
                  type: 'input-text',
                  labelClassName: 'text-muted',
                  name: 'author'
                },

                {
                  label: '请求时间',
                  type: 'input-datetime',
                  labelClassName: 'text-muted',
                  inputFormat: 'YYYY-MM-DD HH:mm:ss',
                  name: 'date'
                }
              ]
            }
          ]
        },

        {
          type: 'form',
          mode: 'horizontal',
          title: '手动填充',
          actions: [],
          body: [
            {
              type: 'group',
              label: '数据模板',
              labelClassName: 'text-muted',
              body: [
                {
                  type: 'select',
                  name: 'tpl',
                  value: 'tpl1',
                  mode: 'inline',
                  options: [
                    {
                      label: '模板1',
                      value: 'tpl1'
                    },

                    {
                      label: '模板2',
                      value: 'tpl2'
                    },

                    {
                      label: '模板3',
                      value: 'tpl3'
                    }
                  ]
                },

                {
                  mode: 'inline',
                  type: 'button',
                  label: '获取',
                  level: 'dark',
                  actionType: 'reload',
                  target: 'theService'
                }
              ]
            },

            '<div class="text-danger m-b">如果不想自动填充，自动填充，则把参数放在 data 里面，就不会监控变化自动拉取了，同时把 <code>servcie</code> 的初始拉取关掉，然后来个刷新目标组件的按钮。</div>',

            {
              type: 'service',
              name: 'theService',
              api: {
                method: 'get',
                url: '/api/mock2/form/initData',
                data: {
                  tpl: '${tpl}'
                }
              },
              body: [
                {
                  label: '名称',
                  type: 'input-text',
                  labelClassName: 'text-muted',
                  name: 'name'
                },

                {
                  label: '作者',
                  type: 'input-text',
                  labelClassName: 'text-muted',
                  name: 'author'
                },

                {
                  label: '请求时间',
                  type: 'input-datetime',
                  labelClassName: 'text-muted',
                  inputFormat: 'YYYY-MM-DD HH:mm:ss',
                  name: 'date'
                }
              ]
            }
          ]
        }
      ]
    },

    {
      type: 'divider'
    },

    {
      type: 'form',
      title: '条件表单',
      target: 'detailForm',
      submitOnInit: true,
      mode: 'inline',
      body: [
        {
          label: '数据模板',
          type: 'select',
          labelClassName: 'text-muted',
          name: 'tpl',
          value: 'tpl1',
          options: [
            {
              label: '模板1',
              value: 'tpl1'
            },

            {
              label: '模板2',
              value: 'tpl2'
            },

            {
              label: '模板3',
              value: 'tpl3'
            }
          ]
        },

        {
          type: 'submit',
          label: '提交',
          primary: true
        }
      ]
    },

    {
      name: 'detailForm',
      type: 'form',
      mode: 'horizontal',
      title: '响应表单',
      initApi: '/api/mock2/form/initData?tpl=${tpl}',
      initFetchOn: 'data.tpl',
      actions: [],
      body: [
        '<span class="text-danger">当 <code>initApi</code> 中有变量，且变量的值发生了变化了，则该表单就会重新初始数据。</span>',
        {
          type: 'divider'
        },

        {
          label: '名称',
          type: 'static',
          labelClassName: 'text-muted',
          name: 'name'
        },

        {
          label: '作者',
          type: 'static',
          labelClassName: 'text-muted',
          name: 'author'
        },

        {
          label: '请求时间',
          type: 'static-datetime',
          labelClassName: 'text-muted',
          format: 'YYYY-MM-DD HH:mm:ss',
          name: 'date'
        }
      ]
    }
  ]
};
