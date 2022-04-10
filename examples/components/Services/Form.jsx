export default {
  type: 'page',
  title: '动态加载表单中的部分',
  body: [
    '<span class="text-danger">同样通过 <code>service</code>的<code>schemaApi</code> 来加载部分内容，当然也可以全部由它来加载</span>',

    {
      type: 'form',
      panelClassName: 'Panel--info m-t',
      target: 'service1',
      mode: 'horizontal',
      api: '/api/mock2/form/saveForm?waitSeconds=1',
      body: [
        {
          type: 'fieldset',
          title: '基本信息',
          body: [
            {
              type: 'input-text',
              label: '字段一',
              name: 'filed1'
            },

            {
              type: 'input-text',
              label: '字段二',
              name: 'filed2'
            }
          ]
        },

        {
          title: '其他信息',
          type: 'fieldset',
          body: [
            {
              name: 'tpl',
              type: 'select',
              label: '模板',
              inline: true,
              required: true,
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
              type: 'service',
              className: 'm-t',
              initFetchSchemaOn: 'data.tpl',
              schemaApi: '/api/mock2/service/form?tpl=$tpl'
            }
          ]
        }
      ]
    }
  ]
};
